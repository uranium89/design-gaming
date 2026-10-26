import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { SidebarDock } from '../../src/components/SidebarDock/SidebarDock';
import { Inspector } from '../../src/components/Inspector/Inspector';
import { useGraphStore, CustomNodeType } from '../../src/state/graphStore';
import { calculateSimulationTick } from '../../src/simulation/engineMath';
import { Edge } from '@xyflow/react';

describe('S-013 Message Queue (RabbitMQ) & Worker Pool Unit Tests', () => {
  it('displays Message Queue (RabbitMQ) and Worker Pool in SidebarDock', () => {
    render(<SidebarDock />);

    expect(screen.getByText('Message Queue (RabbitMQ)')).toBeDefined();
    expect(screen.getByText('Worker Pool (Async Consumer)')).toBeDefined();

    // Check pricing: Queue is $40/m, Worker is $30/m
    expect(screen.getAllByText('$40/m').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('$30/m')).toBeDefined();
  });

  it('renders Message Queue (FIFO) and Async Consumer badges in Inspector', () => {
    // 1. Select Message Queue node
    useGraphStore.setState({
      nodes: [
        {
          id: 'test-queue-1',
          type: 'custom',
          position: { x: 0, y: 0 },
          data: {
            name: 'Message Queue (RabbitMQ)',
            category: 'messaging',
            cost: 40,
            capacityRps: 30000,
            addedLatencyMs: 5,
            icon: 'Layers',
            status: 'healthy',
            currentRps: 13500,
          },
        },
      ],
      selectedNodeId: 'test-queue-1',
    });

    const { unmount } = render(<Inspector />);
    expect(screen.getByText('Message Queue (FIFO)')).toBeDefined();
    expect(screen.getByText(/30000 RPS/i)).toBeDefined();
    unmount();

    // 2. Select Worker Pool node
    useGraphStore.setState({
      nodes: [
        {
          id: 'test-worker-1',
          type: 'custom',
          position: { x: 0, y: 0 },
          data: {
            name: 'Worker Pool (Async Consumer)',
            category: 'compute',
            cost: 30,
            capacityRps: 2000,
            addedLatencyMs: 15,
            icon: 'Cpu',
            status: 'healthy',
            currentRps: 2000,
          },
        },
      ],
      selectedNodeId: 'test-worker-1',
    });

    render(<Inspector />);
    expect(screen.getByText('Async Consumer')).toBeDefined();
    expect(screen.getByText(/2000 RPS/i)).toBeDefined();
  });

  it('buffers 13,500 write requests in Message Queue without drops and levels traffic to Worker Pools', () => {
    // Write spike: 15,000 RPS, 90% Write (13,500 writes, 1,500 reads)
    const nodes: CustomNodeType[] = [
      {
        id: 'user-client-1',
        type: 'custom',
        position: { x: 0, y: 0 },
        data: {
          name: 'User Traffic',
          category: 'routing',
          cost: 0,
          capacityRps: 20000,
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
          cost: 90,
          capacityRps: 20000,
          addedLatencyMs: 20,
          icon: 'Cpu',
          status: 'healthy',
        },
      },
      {
        id: 'queue-1',
        type: 'custom',
        position: { x: 400, y: 0 },
        data: {
          name: 'Message Queue (RabbitMQ)',
          category: 'messaging',
          cost: 40,
          capacityRps: 30000,
          addedLatencyMs: 5,
          icon: 'Layers',
          status: 'healthy',
        },
      },
      {
        id: 'worker-1',
        type: 'custom',
        position: { x: 600, y: -50 },
        data: {
          name: 'Worker Pool (Async Consumer)',
          category: 'compute',
          cost: 30,
          capacityRps: 2000,
          addedLatencyMs: 15,
          icon: 'Cpu',
          status: 'healthy',
        },
      },
      {
        id: 'worker-2',
        type: 'custom',
        position: { x: 600, y: 50 },
        data: {
          name: 'Worker Pool (Async Consumer)',
          category: 'compute',
          cost: 30,
          capacityRps: 2000,
          addedLatencyMs: 15,
          icon: 'Cpu',
          status: 'healthy',
        },
      },
      {
        id: 'db-master',
        type: 'custom',
        position: { x: 800, y: 0 },
        data: {
          name: 'PostgreSQL DB',
          category: 'storage',
          cost: 40,
          capacityRps: 4000,
          addedLatencyMs: 15,
          icon: 'Database',
          status: 'healthy',
        },
      },
    ];

    const edges: Edge[] = [
      { id: 'e1', source: 'user-client-1', target: 'server-1' },
      { id: 'e2', source: 'server-1', target: 'queue-1' },
      { id: 'e3', source: 'queue-1', target: 'worker-1' },
      { id: 'e4', source: 'queue-1', target: 'worker-2' },
      { id: 'e5', source: 'worker-1', target: 'db-master' },
      { id: 'e6', source: 'worker-2', target: 'db-master' },
    ];

    const result = calculateSimulationTick(nodes, edges, 15000, 400, 1.0);

    // Queue absorbs 15,000 write RPS at 30,000 capacity
    expect(result.nodeUpdates['queue-1'].currentRps).toBe(15000);
    expect(result.nodeUpdates['queue-1'].status).toBe('healthy');

    // Worker pools receive leveled traffic (2000 RPS each, matching capacity)
    expect(result.nodeUpdates['worker-1'].currentRps).toBe(2000);
    expect(result.nodeUpdates['worker-2'].currentRps).toBe(2000);
    expect(['healthy', 'warning']).toContain(result.nodeUpdates['worker-1'].status);
    expect(['healthy', 'warning']).toContain(result.nodeUpdates['worker-2'].status);

    // Master DB receives 4000 RPS leveled write traffic (within 4000 capacity)
    expect(result.nodeUpdates['db-master'].currentRps).toBe(4000);
    expect(['healthy', 'warning']).toContain(result.nodeUpdates['db-master'].status);

    // 0 dropped write packets! Zero Data Loss!
    expect(result.metrics.throughputRps).toBe(15000);
    expect(result.metrics.errorRate).toBe(0);
  });

  it('drops over 11,000 writes and overloads database when Message Queue is missing', () => {
    // Architecture without Message Queue: Server connects directly to Master DB
    const directNodes: CustomNodeType[] = [
      {
        id: 'user-client-1',
        type: 'custom',
        position: { x: 0, y: 0 },
        data: {
          name: 'User Traffic',
          category: 'routing',
          cost: 0,
          capacityRps: 20000,
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
          cost: 90,
          capacityRps: 20000,
          addedLatencyMs: 20,
          icon: 'Cpu',
          status: 'healthy',
        },
      },
      {
        id: 'db-master',
        type: 'custom',
        position: { x: 400, y: 0 },
        data: {
          name: 'PostgreSQL DB',
          category: 'storage',
          cost: 40,
          capacityRps: 2000,
          addedLatencyMs: 15,
          icon: 'Database',
          status: 'healthy',
        },
      },
    ];

    const directEdges: Edge[] = [
      { id: 'e1', source: 'user-client-1', target: 'server-1' },
      { id: 'e2', source: 'server-1', target: 'db-master' },
    ];

    // 15,000 RPS, 90% Write = 13,500 writes directly hitting DB with 2,000 capacity
    const result = calculateSimulationTick(directNodes, directEdges, 15000, 400, 0.90);

    // Database is heavily overloaded
    expect(result.nodeUpdates['db-master'].status).toBe('overloaded');
    // Drops 13,500 - 2,000 = 11,500 RPS!
    expect(result.metrics.errorRate).toBeGreaterThan(0.70);
    expect(result.metrics.throughputRps).toBeLessThan(4000);
  });
});
