import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { calculateSimulationTick } from '../../src/simulation/engineMath';
import { useGraphStore, CustomNodeType } from '../../src/state/graphStore';
import { Inspector } from '../../src/components/Inspector/Inspector';
import { SidebarDock } from '../../src/components/SidebarDock/SidebarDock';
import { Edge } from '@xyflow/react';

describe('S-011 Database Read Replicas & Read/Write Splitting', () => {
  const baseNodes: CustomNodeType[] = [
    {
      id: 'user-client-1',
      type: 'custom',
      position: { x: 80, y: 180 },
      data: {
        name: 'User Traffic',
        category: 'routing',
        cost: 0,
        capacityRps: 10000,
        addedLatencyMs: 0,
        icon: 'Users',
        status: 'healthy',
        currentRps: 1000,
      },
    },
    {
      id: 'app-server-1',
      type: 'custom',
      position: { x: 380, y: 180 },
      data: {
        name: 'App Server (VM)',
        category: 'compute',
        cost: 45,
        capacityRps: 3000,
        addedLatencyMs: 20,
        icon: 'Cpu',
        status: 'healthy',
        currentRps: 1000,
      },
    },
    {
      id: 'db-master-1',
      type: 'custom',
      position: { x: 700, y: 80 },
      data: {
        name: 'PostgreSQL DB',
        category: 'storage',
        cost: 40,
        capacityRps: 2000,
        addedLatencyMs: 15,
        icon: 'Database',
        status: 'healthy',
        currentRps: 200,
      },
    },
    {
      id: 'db-replica-1',
      type: 'custom',
      position: { x: 700, y: 200 },
      data: {
        name: 'Database Read Replica 1',
        category: 'storage',
        cost: 25,
        capacityRps: 1500,
        addedLatencyMs: 10,
        icon: 'Database',
        status: 'healthy',
        currentRps: 400,
      },
    },
    {
      id: 'db-replica-2',
      type: 'custom',
      position: { x: 700, y: 320 },
      data: {
        name: 'Database Read Replica 2',
        category: 'storage',
        cost: 25,
        capacityRps: 1500,
        addedLatencyMs: 10,
        icon: 'Database',
        status: 'healthy',
        currentRps: 400,
      },
    },
  ];

  const edges: Edge[] = [
    { id: 'e-client-app', source: 'user-client-1', target: 'app-server-1', type: 'particle' },
    { id: 'e-app-master', source: 'app-server-1', target: 'db-master-1', type: 'particle' },
    { id: 'e-app-rep1', source: 'app-server-1', target: 'db-replica-1', type: 'particle' },
    { id: 'e-app-rep2', source: 'app-server-1', target: 'db-replica-2', type: 'particle' },
  ];

  beforeEach(() => {
    useGraphStore.setState({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      isSimulationRunning: true,
      simulationSpeed: 1,
    });
  });

  it('routes 100% of write traffic to Master DB and divides read traffic across Read Replicas', () => {
    // 1000 RPS, 20% write (200 RPS write), 80% read (800 RPS read)
    const result = calculateSimulationTick(baseNodes, edges, 1000, 200, 0.20);

    // Master DB receives 100% write traffic = 200 RPS
    expect(result.nodeUpdates['db-master-1'].currentRps).toBe(200);
    expect(result.nodeUpdates['db-master-1'].status).toBe('healthy');

    // Read traffic (800 RPS) is split equally between the 2 Read Replicas = 400 RPS each
    expect(result.nodeUpdates['db-replica-1'].currentRps).toBe(400);
    expect(result.nodeUpdates['db-replica-2'].currentRps).toBe(400);
    expect(result.nodeUpdates['db-replica-1'].status).toBe('healthy');
    expect(result.nodeUpdates['db-replica-2'].status).toBe('healthy');

    // Total successful throughput: 1000 RPS, zero drops
    expect(result.metrics.throughputRps).toBe(1000);
    expect(result.metrics.errorRate).toBe(0);
  });

  it('falls back read traffic to Master DB when all Read Replicas are crashed', () => {
    const crashedReplicaNodes = baseNodes.map((n) =>
      n.id.includes('replica') ? { ...n, data: { ...n.data, status: 'crashed' as const } } : n
    );

    const result = calculateSimulationTick(crashedReplicaNodes, edges, 1000, 200, 0.20);

    // Both replicas crashed receive 0 traffic
    expect(result.nodeUpdates['db-replica-1'].currentRps).toBe(0);
    expect(result.nodeUpdates['db-replica-2'].currentRps).toBe(0);

    // Master DB receives fallback reads + writes = 1000 RPS
    expect(result.nodeUpdates['db-master-1'].currentRps).toBe(1000);
    expect(result.nodeUpdates['db-master-1'].status).toBe('healthy');
    expect(result.metrics.throughputRps).toBe(1000);
    expect(result.metrics.errorRate).toBe(0);
  });

  it('renders Read-Only Replica badge on Inspector when selecting replica', () => {
    const replicaNode: CustomNodeType = {
      id: 'test-replica',
      type: 'custom',
      position: { x: 500, y: 200 },
      data: {
        name: 'Database Read Replica',
        category: 'storage',
        cost: 25,
        capacityRps: 1500,
        addedLatencyMs: 10,
        icon: 'Database',
        status: 'healthy',
      },
    };

    useGraphStore.getState().addNode(replicaNode);
    useGraphStore.getState().selectNode('test-replica');

    render(<Inspector />);

    expect(screen.getByText('Read-Only Replica')).toBeInTheDocument();
    expect(screen.getByText('Database Read Replica')).toBeInTheDocument();
  });

  it('displays Database Read Replica in Toolbox with correct specifications', () => {
    render(<SidebarDock />);

    expect(screen.getByText('Database Read Replica')).toBeInTheDocument();
    expect(screen.getByText('1500 RPS')).toBeInTheDocument();
    expect(screen.getAllByText('$25/m').length).toBeGreaterThanOrEqual(1);
  });
});
