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
    nodeUpdates[n.id] = {
      status: n.data.status || 'healthy',
      currentRps: 0,
    };
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
  const pathLatency: Record<string, number> = {};
  sourceNodes.forEach((sn) => {
    pathLatency[sn.id] = 0;
  });
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

    if (currentNode.data.status === 'crashed') {
      status = 'crashed';
      totalDroppedRps += rpsIn;
      rpsOut = 0;
      nodeLatency = 500;
    } else if (isDirectClientOrRoutingToStorage) {
      hasDirectClientToStorage = true;
      status = 'crashed';
      nodeLatency = 500; // Connection refused / timeout
      totalDroppedRps += rpsIn;
      rpsOut = 0;
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

    const currentPathLatency =
      (pathLatency[currentId] || 0) + (currentNode.data.name !== 'User Traffic' ? nodeLatency : 0);
    pathLatency[currentId] = currentPathLatency;

    // Forward to downstream targets
    const targets = adjacency[currentId] || [];
    targets.forEach((targetId) => {
      pathLatency[targetId] = Math.max(pathLatency[targetId] || 0, currentPathLatency);
    });
    if (targets.length > 0) {
      const isLoadBalancer = currentNode.data.name.toLowerCase().includes('load balancer');
      if (isLoadBalancer) {
        // Health Check: only route to non-crashed targets
        const healthyTargets = targets.filter((targetId) => {
          const targetNode = nodes.find((n) => n.id === targetId);
          return targetNode?.data.status !== 'crashed';
        });

        if (healthyTargets.length > 0) {
          const sharePerTarget = rpsOut / healthyTargets.length;
          healthyTargets.forEach((targetId) => {
            incomingRpsMap[targetId] = (incomingRpsMap[targetId] || 0) + sharePerTarget;
            if (!visited.has(targetId)) {
              queue.push(targetId);
            }
          });
          targets
            .filter((tId) => !healthyTargets.includes(tId))
            .forEach((crashedId) => {
              incomingRpsMap[crashedId] = 0;
            });
        } else {
          // All downstream targets are crashed -> 503 Service Unavailable
          status = 'overloaded';
          totalDroppedRps += rpsOut;
          rpsOut = 0;
        }
      } else {
        const targetNodes = targets
          .map((targetId) => nodes.find((n) => n.id === targetId))
          .filter(Boolean) as CustomNodeType[];

        const isMasterDbNode = (n: CustomNodeType) =>
          n.data.category === 'storage' &&
          !n.data.name.toLowerCase().includes('replica') &&
          !n.data.name.toLowerCase().includes('cache') &&
          !n.data.name.toLowerCase().includes('redis');

        const isReplicaDbNode = (n: CustomNodeType) =>
          n.data.category === 'storage' && n.data.name.toLowerCase().includes('replica');

        const masterTargets = targetNodes.filter((n) => isMasterDbNode(n) && n.data.status !== 'crashed');
        const replicaTargets = targetNodes.filter((n) => isReplicaDbNode(n) && n.data.status !== 'crashed');
        const otherTargets = targetNodes.filter((n) => !isMasterDbNode(n) && !isReplicaDbNode(n));

        const hasStorageTargets = masterTargets.length > 0 || replicaTargets.length > 0;

        if (hasStorageTargets) {
          // Read/Write Splitting
          const writePart = isCache
            ? Math.min(rpsOut, rpsIn * writeRatio)
            : rpsOut * writeRatio;
          const readPart = Math.max(0, rpsOut - writePart);

          // Write traffic routes 100% to Master DB
          if (masterTargets.length > 0) {
            const writeShare = writePart / masterTargets.length;
            masterTargets.forEach((m) => {
              incomingRpsMap[m.id] = (incomingRpsMap[m.id] || 0) + writeShare;
              if (!visited.has(m.id)) queue.push(m.id);
            });
          } else if (writePart > 0) {
            // No Master DB to receive writes -> dropped writes
            totalDroppedRps += writePart;
          }

          // Read traffic: distributed across Read Replicas, fallback to Master DB if no replicas
          if (replicaTargets.length > 0) {
            const readShare = readPart / replicaTargets.length;
            replicaTargets.forEach((r) => {
              incomingRpsMap[r.id] = (incomingRpsMap[r.id] || 0) + readShare;
              if (!visited.has(r.id)) queue.push(r.id);
            });
          } else if (masterTargets.length > 0) {
            // Fallback: Master DB handles reads as well
            const readShare = readPart / masterTargets.length;
            masterTargets.forEach((m) => {
              incomingRpsMap[m.id] = (incomingRpsMap[m.id] || 0) + readShare;
              if (!visited.has(m.id)) queue.push(m.id);
            });
          } else {
            totalDroppedRps += readPart;
          }

          // Forward to any other non-storage targets (e.g. Cache or Queue)
          otherTargets.forEach((o) => {
            incomingRpsMap[o.id] = (incomingRpsMap[o.id] || 0) + rpsOut;
            if (!visited.has(o.id)) queue.push(o.id);
          });
        } else {
          // Standard forwarding
          const sharePerTarget = rpsOut;
          targets.forEach((targetId) => {
            incomingRpsMap[targetId] = (incomingRpsMap[targetId] || 0) + sharePerTarget;
            if (!visited.has(targetId)) {
              queue.push(targetId);
            }
          });
        }
      }
    } else if (currentNode.data.name !== 'User Traffic' && !isDirectClientOrRoutingToStorage && currentNode.data.status !== 'crashed') {
      // Leaf node in architecture flow
      if (isCache) {
        // Cache without DB downstream drops write/miss requests
        totalDroppedRps += rpsOut;
      } else {
        totalSuccessfulRps += rpsOut;
      }
    }

    nodeUpdates[currentId] = {
      status,
      currentRps: rpsIn,
    };
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

  const maxPathLatency = Math.max(0, ...Object.values(pathLatency));

  return {
    metrics: {
      throughputRps: Math.round(totalSuccessfulRps),
      p95LatencyMs: Math.round(maxPathLatency * 1.15),
      costPerMonth: totalCost,
      budgetLimit,
      errorRate: Math.round(errorRate * 100) / 100,
      activeRequests: Math.round(trafficRps * (maxPathLatency / 1000)),
    },
    nodeUpdates,
    architectureErrors,
    hasComputeLayer,
    hasStorageLayer,
    hasDirectClientToStorage,
  };
}
