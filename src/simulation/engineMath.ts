import { CustomNodeType } from '../state/graphStore';
import { Edge } from '@xyflow/react';
import { LiveMetrics } from '../types';

export interface NodeSimUpdate {
  status: 'healthy' | 'warning' | 'overloaded' | 'crashed';
  currentRps: number;
}

export interface TickResult {
  metrics: LiveMetrics;
  nodeUpdates: Record<string, NodeSimUpdate>;
  architectureErrors?: string[];
  hasComputeLayer?: boolean;
  hasStorageLayer?: boolean;
  hasDirectClientToStorage?: boolean;
}

export function calculateSimulationTick(
  nodes: CustomNodeType[],
  edges: Edge[],
  trafficRps: number = 50,
  budgetLimit: number = 35,
  writeRatio: number = 0.20
): TickResult {
  const nodeUpdates: Record<string, NodeSimUpdate> = {};
  const incomingRpsMap: Record<string, number> = {};
  const architectureErrors: string[] = [];

  // Initialize
  nodes.forEach((n) => {
    incomingRpsMap[n.id] = 0;
  });

  // Identify traffic source nodes (e.g. User Traffic)
  const sourceNodes = nodes.filter(
    (n) => n.data.name === 'User Traffic' || (n.data.category === 'routing' && n.data.icon === 'Users')
  );

  sourceNodes.forEach((s) => {
    incomingRpsMap[s.id] = trafficRps;
  });

  // Calculate adjacency list: source -> targets
  const adjacency: Record<string, string[]> = {};
  edges.forEach((e) => {
    if (!adjacency[e.source]) adjacency[e.source] = [];
    adjacency[e.source].push(e.target);
  });

  // BFS Queue to push traffic downstream
  const queue: string[] = [...sourceNodes.map((s) => s.id)];
  const visited = new Set<string>();

  let totalSuccessfulRps = 0;
  let totalDroppedRps = 0;
  let cumulativeLatencyMs = 0;
  let hasDirectClientToStorage = false;

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const currentNode = nodes.find((n) => n.id === currentId);
    if (!currentNode) continue;

    const rpsIn = incomingRpsMap[currentId] || 0;
    const capacity = currentNode.data.capacityRps || 100;
    const addedLatency = currentNode.data.addedLatencyMs || 0;

    let status: 'healthy' | 'warning' | 'overloaded' | 'crashed' = 'healthy';
    let rpsOut = rpsIn;
    let nodeLatency = addedLatency;

    // Check Architecture Rule: Cannot connect User Traffic / Routing directly to Storage (Database/Cache)
    const incomingSources = edges.filter((e) => e.target === currentId).map((e) => e.source);
    const isDirectClientOrRoutingToStorage =
      currentNode.data.category === 'storage' &&
      incomingSources.some((srcId) => {
        const srcNode = nodes.find((n) => n.id === srcId);
        return srcNode?.data.name === 'User Traffic' || srcNode?.data.category === 'routing';
      });

    const isCache =
      currentNode.data.name.toLowerCase().includes('cache') ||
      currentNode.data.name.toLowerCase().includes('redis');

    if (isDirectClientOrRoutingToStorage) {
      hasDirectClientToStorage = true;
      status = 'crashed';
      nodeLatency = 500; // Connection refused / timeout
      totalDroppedRps += rpsIn;
      rpsOut = 0;
      cumulativeLatencyMs += nodeLatency;
    } else if (currentNode.data.name !== 'User Traffic') {
      const ratio = capacity > 0 ? rpsIn / capacity : 1.0;

      if (ratio < 0.8) {
        status = 'healthy';
        nodeLatency = addedLatency;
      } else if (ratio < 1.0) {
        status = 'warning';
        nodeLatency = addedLatency * (1 + ((ratio - 0.8) / 0.2) * 2);
      } else {
        status = 'overloaded';
        nodeLatency = addedLatency * 4;
        const dropped = rpsIn - capacity;
        totalDroppedRps += dropped;
        rpsOut = capacity;
      }

      cumulativeLatencyMs += nodeLatency;

      // Cache absorption: 90% hit rate on read traffic
      if (isCache) {
        const readRatio = Math.max(0, 1 - writeRatio);
        const hitTraffic = rpsOut * readRatio * 0.90;
        // Hit requests are fulfilled directly by cache
        totalSuccessfulRps += hitTraffic;
        // Remaining misses and writes are forwarded downstream to DB
        rpsOut = Math.max(0, rpsOut - hitTraffic);
      }
    }

    nodeUpdates[currentId] = {
      status,
      currentRps: rpsIn,
    };

    // Forward to downstream targets
    const targets = adjacency[currentId] || [];
    if (targets.length > 0) {
      const isLoadBalancer = currentNode.data.name.toLowerCase().includes('load balancer');
      const sharePerTarget = isLoadBalancer ? rpsOut / targets.length : rpsOut;

      targets.forEach((targetId) => {
        incomingRpsMap[targetId] = (incomingRpsMap[targetId] || 0) + sharePerTarget;
        if (!visited.has(targetId)) {
          queue.push(targetId);
        }
      });
    } else if (currentNode.data.name !== 'User Traffic' && !isDirectClientOrRoutingToStorage) {
      // Leaf node in architecture flow
      if (isCache) {
        // Cache without DB downstream drops write/miss requests
        totalDroppedRps += rpsOut;
      } else {
        totalSuccessfulRps += rpsOut;
      }
    }
  }

  // Check Layer Presence (distinguish Database from Cache)
  const isDatabaseNode = (n: CustomNodeType) =>
    n.data.category === 'storage' &&
    !n.data.name.toLowerCase().includes('cache') &&
    !n.data.name.toLowerCase().includes('redis');

  const hasComputeLayer = nodes.some(
    (n) => n.data.category === 'compute' && (incomingRpsMap[n.id] || 0) > 0
  );
  const hasStorageLayer = nodes.some(
    (n) => isDatabaseNode(n) && (incomingRpsMap[n.id] || 0) > 0
  );

  if (hasDirectClientToStorage) {
    architectureErrors.push(
      'LỖI BẢO MẬT & KIẾN TRÚC: Bạn đang nối Client trực tiếp vào Database! Database không thể chạy mã nguồn web hay nhận raw HTTP request trực tiếp.'
    );
  } else if (!hasComputeLayer && nodes.length > 1) {
    architectureErrors.push(
      'THIẾU TẦNG XỬ LÝ (COMPUTE): Không có App Server để chạy backend web và xử lý đơn hàng!'
    );
  } else if (hasComputeLayer && !hasStorageLayer && writeRatio > 0) {
    architectureErrors.push(
      `MẤT DỮ LIỆU (DATA LOSS): Hệ thống thiếu Database để lưu trữ ${Math.round(writeRatio * 100)}% yêu cầu ghi dữ liệu (Write)!`
    );
  }

  // Calculate total monthly cost
  const totalCost = nodes
    .filter((n) => n.data.name !== 'User Traffic')
    .reduce((sum, n) => sum + (n.data.cost || 0), 0);

  const totalReq = totalSuccessfulRps + totalDroppedRps;
  const errorRate = totalReq > 0 ? totalDroppedRps / totalReq : 0;

  return {
    metrics: {
      throughputRps: Math.round(totalSuccessfulRps),
      p95LatencyMs: Math.round(cumulativeLatencyMs * 1.15),
      costPerMonth: totalCost,
      budgetLimit,
      errorRate: Math.round(errorRate * 100) / 100,
      activeRequests: Math.round(trafficRps * (cumulativeLatencyMs / 1000)),
    },
    nodeUpdates,
    architectureErrors,
    hasComputeLayer,
    hasStorageLayer,
    hasDirectClientToStorage,
  };
}
