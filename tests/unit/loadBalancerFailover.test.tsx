import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { calculateSimulationTick } from '../../src/simulation/engineMath';
import { useGraphStore, CustomNodeType } from '../../src/state/graphStore';
import { Inspector } from '../../src/components/Inspector/Inspector';
import { ParticleEdge } from '../../src/components/ParticleEdge/ParticleEdge';
import { Edge } from '@xyflow/react';

describe('S-009 Load Balancer Health Check & Failover', () => {
  const nodes: CustomNodeType[] = [
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
      id: 'lb-1',
      type: 'custom',
      position: { x: 300, y: 180 },
      data: {
        name: 'Load Balancer',
        category: 'routing',
        cost: 25,
        capacityRps: 15000,
        addedLatencyMs: 4,
        icon: 'Network',
        status: 'healthy',
        currentRps: 1000,
      },
    },
    {
      id: 'server-1',
      type: 'custom',
      position: { x: 550, y: 100 },
      data: {
        name: 'App Server 1 (VM)',
        category: 'compute',
        cost: 45,
        capacityRps: 3000,
        addedLatencyMs: 20,
        icon: 'Cpu',
        status: 'healthy',
        currentRps: 500,
      },
    },
    {
      id: 'server-2',
      type: 'custom',
      position: { x: 550, y: 260 },
      data: {
        name: 'App Server 2 (VM)',
        category: 'compute',
        cost: 45,
        capacityRps: 3000,
        addedLatencyMs: 20,
        icon: 'Cpu',
        status: 'healthy',
        currentRps: 500,
      },
    },
    {
      id: 'db-1',
      type: 'custom',
      position: { x: 850, y: 180 },
      data: {
        name: 'PostgreSQL DB',
        category: 'storage',
        cost: 40,
        capacityRps: 2000,
        addedLatencyMs: 15,
        icon: 'Database',
        status: 'healthy',
        currentRps: 500,
      },
    },
  ];

  const edges: Edge[] = [
    { id: 'e1-lb', source: 'user-client-1', target: 'lb-1', type: 'particle' },
    { id: 'e-lb-s1', source: 'lb-1', target: 'server-1', type: 'particle' },
    { id: 'e-lb-s2', source: 'lb-1', target: 'server-2', type: 'particle' },
    { id: 'e-s1-db', source: 'server-1', target: 'db-1', type: 'particle' },
    { id: 'e-s2-db', source: 'server-2', target: 'db-1', type: 'particle' },
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

  it('splits traffic equally when both downstream servers are healthy', () => {
    const result = calculateSimulationTick(nodes, edges, 1000, 200, 0.1);

    expect(result.nodeUpdates['server-1'].currentRps).toBe(500);
    expect(result.nodeUpdates['server-2'].currentRps).toBe(500);
    expect(result.nodeUpdates['server-1'].status).toBe('healthy');
    expect(result.nodeUpdates['server-2'].status).toBe('healthy');
    expect(result.metrics.errorRate).toBe(0);
  });

  it('automatically isolates crashed server and routes 100% traffic to healthy server', () => {
    const nodesWithCrash = nodes.map((n) =>
      n.id === 'server-1' ? { ...n, data: { ...n.data, status: 'crashed' as const } } : n
    );

    const result = calculateSimulationTick(nodesWithCrash, edges, 1000, 200, 0.1);

    // Crashed server receives 0 traffic
    expect(result.nodeUpdates['server-1'].currentRps).toBe(0);
    expect(result.nodeUpdates['server-1'].status).toBe('crashed');

    // Healthy server receives 100% of the traffic (1000 RPS)
    expect(result.nodeUpdates['server-2'].currentRps).toBe(1000);
    expect(result.nodeUpdates['server-2'].status).toBe('healthy');

    // Zero dropped packets because server 2 has 3000 RPS capacity
    expect(result.metrics.errorRate).toBe(0);
    expect(result.metrics.throughputRps).toBeGreaterThanOrEqual(1000);
  });

  it('drops all traffic (503 Service Unavailable) when all downstream servers crash', () => {
    const nodesAllCrash = nodes.map((n) =>
      n.id === 'server-1' || n.id === 'server-2'
        ? { ...n, data: { ...n.data, status: 'crashed' as const } }
        : n
    );

    const result = calculateSimulationTick(nodesAllCrash, edges, 1000, 200, 0.1);

    expect(result.nodeUpdates['lb-1'].status).toBe('overloaded');
    expect(result.metrics.throughputRps).toBe(0);
    expect(result.metrics.errorRate).toBe(1);
  });

  it('Inspector allows crashing and recovering a server via Chaos button', () => {
    const appNode: CustomNodeType = {
      id: 'app-server-chaos',
      type: 'custom',
      position: { x: 400, y: 180 },
      data: {
        name: 'App Server (VM)',
        category: 'compute',
        cost: 45,
        capacityRps: 3000,
        addedLatencyMs: 20,
        icon: 'Cpu',
        status: 'healthy',
      },
    };

    useGraphStore.getState().addNode(appNode);
    useGraphStore.getState().selectNode('app-server-chaos');

    render(<Inspector />);

    // Click 'Simulate Crash'
    const crashBtn = screen.getByRole('button', { name: /Đánh sập node/i });
    expect(crashBtn).toBeInTheDocument();
    fireEvent.click(crashBtn);

    let updatedNode = useGraphStore.getState().nodes.find((n) => n.id === 'app-server-chaos');
    expect(updatedNode?.data.status).toBe('crashed');

    // Click 'Recover Server'
    const recoverBtn = screen.getByRole('button', { name: /Khởi động lại node/i });
    expect(recoverBtn).toBeInTheDocument();
    fireEvent.click(recoverBtn);

    updatedNode = useGraphStore.getState().nodes.find((n) => n.id === 'app-server-chaos');
    expect(updatedNode?.data.status).toBe('healthy');
  });

  it('ParticleEdge stops animating particles when target node is crashed', () => {
    const targetNode: CustomNodeType = {
      id: 'crashed-target',
      type: 'custom',
      position: { x: 300, y: 100 },
      data: {
        name: 'Crashed App Server',
        category: 'compute',
        cost: 20,
        capacityRps: 500,
        addedLatencyMs: 25,
        icon: 'Cpu',
        status: 'crashed',
      },
    };

    useGraphStore.getState().addNode(targetNode);

    const { queryByTestId } = render(
      <svg>
        <ParticleEdge
          id="edge-to-crashed"
          source="user-client-1"
          target="crashed-target"
          sourceX={50}
          sourceY={50}
          targetX={200}
          targetY={50}
          sourcePosition={'right' as any}
          targetPosition={'left' as any}
        />
      </svg>
    );

    // Particles should be halted/hidden when target is crashed
    expect(queryByTestId('particle-group-edge-to-crashed')).toBeNull();
  });
});
