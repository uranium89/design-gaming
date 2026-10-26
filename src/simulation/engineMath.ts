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
}

export function calculateSimulationTick(
  nodes: CustomNodeType[],
  edges: Edge[],
  trafficRps: number = 50,
  budgetLimit: number = 35
): TickResult {
  const nodeUpdates: Record<string, NodeSimUpdate> = {};
  const incomingRpsMap: Record<string, number> = {};

  // Initialize
  nodes.forEach((n) => {
    incomingRpsMap[n.id] = 0;
  });

  // Identify traffic source nodes (e.g. User Traffic)
  const sourceNodes = nodes.filter(
    (n) => n.data.name === 'User Traffic' || n.data.category === 'routing' && n.data.icon === 'Users'
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

    if (currentNode.data.name !== 'User Traffic') {
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
    }

    nodeUpdates[currentId] = {
      status,
      currentRps: rpsIn,
    };

    // Forward to downstream targets
    const targets = adjacency[currentId] || [];
    if (targets.length > 0) {
      // If load balancer: divide traffic equally
      const isLoadBalancer = currentNode.data.name.toLowerCase().includes('load balancer');
      const sharePerTarget = isLoadBalancer ? rpsOut / targets.length : rpsOut;

      targets.forEach((targetId) => {
        incomingRpsMap[targetId] = (incomingRpsMap[targetId] || 0) + sharePerTarget;
        if (!visited.has(targetId)) {
          queue.push(targetId);
        }
      });
    } else if (currentNode.data.name !== 'User Traffic') {
      // Leaf node in architecture flow
      totalSuccessfulRps += rpsOut;
    }
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
      p95LatencyMs: Math.round(cumulativeLatencyMs * 1.15), // estimate p95 from mean
      costPerMonth: totalCost,
      budgetLimit,
      errorRate: Math.round(errorRate * 100) / 100,
      activeRequests: Math.round(trafficRps * (cumulativeLatencyMs / 1000)),
    },
    nodeUpdates,
  };
}
