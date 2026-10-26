import { describe, it, expect } from 'vitest';
import { calculateSimulationTick } from '../../src/simulation/engineMath';
import { CustomNodeType } from '../../src/state/graphStore';
import { Edge } from '@xyflow/react';

describe('Simulation Engine Mathematics Unit Tests', () => {
  const baseNodes: CustomNodeType[] = [
    {
      id: 'client-1',
      type: 'custom',
      position: { x: 0, y: 0 },
      data: {
        name: 'User Traffic',
        category: 'routing',
        cost: 0,
        capacityRps: 10000,
        addedLatencyMs: 0,
        icon: 'Users',
        status: 'healthy',
      },
    },
    {
      id: 'server-1',
      type: 'custom',
      position: { x: 200, y: 0 },
      data: {
        name: 'App Server (VM)',
        category: 'compute',
        cost: 20,
        capacityRps: 500,
        addedLatencyMs: 25,
        icon: 'Cpu',
        status: 'healthy',
      },
    },
    {
      id: 'db-1',
      type: 'custom',
      position: { x: 400, y: 0 },
      data: {
        name: 'PostgreSQL DB',
        category: 'storage',
        cost: 40,
        capacityRps: 600,
        addedLatencyMs: 15,
        icon: 'Database',
        status: 'healthy',
      },
    },
  ];

  const baseEdges: Edge[] = [
    { id: 'e1', source: 'client-1', target: 'server-1' },
    { id: 'e2', source: 'server-1', target: 'db-1' },
  ];

  it('calculates normal healthy traffic flow correctly', () => {
    const result = calculateSimulationTick(baseNodes, baseEdges, 50, 35);

    expect(result.metrics.throughputRps).toBe(50);
    expect(result.metrics.errorRate).toBe(0);
    expect(result.metrics.costPerMonth).toBe(60); // $20 + $40
    expect(result.metrics.p95LatencyMs).toBeGreaterThanOrEqual(40); // (25ms + 15ms) * 1.15
    expect(result.nodeUpdates['server-1'].status).toBe('healthy');
    expect(result.nodeUpdates['db-1'].status).toBe('healthy');
  });

  it('detects warning status when traffic approaches 80%-100% capacity', () => {
    // 450 RPS on 500 RPS server = 90% utilization
    const result = calculateSimulationTick(baseNodes, baseEdges, 450, 35);

    expect(result.nodeUpdates['server-1'].status).toBe('warning');
    // Latency should be non-linearly inflated
    expect(result.metrics.p95LatencyMs).toBeGreaterThan(60);
    expect(result.metrics.errorRate).toBe(0);
  });

  it('drops traffic and sets overloaded status when traffic exceeds 100% capacity', () => {
    // 800 RPS on 500 RPS server
    const result = calculateSimulationTick(baseNodes, baseEdges, 800, 35);

    expect(result.nodeUpdates['server-1'].status).toBe('overloaded');
    expect(result.metrics.throughputRps).toBe(500); // capped at capacity
    expect(result.metrics.errorRate).toBeGreaterThan(0.3); // 300 dropped / 800 total = 37.5%
  });

  it('splits traffic equally across targets downstream of a Load Balancer', () => {
    const lbNodes: CustomNodeType[] = [
      {
        id: 'client-1',
        type: 'custom',
        position: { x: 0, y: 0 },
        data: {
          name: 'User Traffic',
          category: 'routing',
          cost: 0,
          capacityRps: 10000,
          addedLatencyMs: 0,
          icon: 'Users',
          status: 'healthy',
        },
      },
      {
        id: 'lb-1',
        type: 'custom',
        position: { x: 200, y: 0 },
        data: {
          name: 'Load Balancer',
          category: 'routing',
          cost: 25,
          capacityRps: 15000,
          addedLatencyMs: 4,
          icon: 'Network',
          status: 'healthy',
        },
      },
      {
        id: 'server-1',
        type: 'custom',
        position: { x: 400, y: -100 },
        data: {
          name: 'App Server 1',
          category: 'compute',
          cost: 20,
          capacityRps: 500,
          addedLatencyMs: 25,
          icon: 'Cpu',
          status: 'healthy',
        },
      },
      {
        id: 'server-2',
        type: 'custom',
        position: { x: 400, y: 100 },
        data: {
          name: 'App Server 2',
          category: 'compute',
          cost: 20,
          capacityRps: 500,
          addedLatencyMs: 25,
          icon: 'Cpu',
          status: 'healthy',
        },
      },
    ];

    const lbEdges: Edge[] = [
      { id: 'e0', source: 'client-1', target: 'lb-1' },
      { id: 'e1', source: 'lb-1', target: 'server-1' },
      { id: 'e2', source: 'lb-1', target: 'server-2' },
    ];

    // 600 RPS divided across 2 servers = 300 RPS each (well below 500 capacity)
    const result = calculateSimulationTick(lbNodes, lbEdges, 600, 100);

    expect(result.nodeUpdates['server-1'].currentRps).toBe(300);
    expect(result.nodeUpdates['server-2'].currentRps).toBe(300);
    expect(result.nodeUpdates['server-1'].status).toBe('healthy');
    expect(result.metrics.throughputRps).toBe(600);
  });

  it('crashes and drops 100% traffic when User Traffic directly connects to Database without compute layer', () => {
    const invalidNodes: CustomNodeType[] = [
      {
        id: 'client-1',
        type: 'custom',
        position: { x: 0, y: 0 },
        data: {
          name: 'User Traffic',
          category: 'routing',
          cost: 0,
          capacityRps: 10000,
          addedLatencyMs: 0,
          icon: 'Users',
          status: 'healthy',
        },
      },
      {
        id: 'db-1',
        type: 'custom',
        position: { x: 200, y: 0 },
        data: {
          name: 'SQLite / Micro DB',
          category: 'storage',
          cost: 10,
          capacityRps: 150,
          addedLatencyMs: 8,
          icon: 'Database',
          status: 'healthy',
        },
      },
    ];

    const invalidEdges: Edge[] = [
      { id: 'e1', source: 'client-1', target: 'db-1' },
    ];

    const result = calculateSimulationTick(invalidNodes, invalidEdges, 50, 35);

    expect(result.nodeUpdates['db-1'].status).toBe('crashed');
    expect(result.metrics.throughputRps).toBe(0);
    expect(result.metrics.errorRate).toBe(1); // 100% drop
    expect(result.hasDirectClientToStorage).toBe(true);
    expect(result.architectureErrors?.length).toBeGreaterThan(0);
  });
});
