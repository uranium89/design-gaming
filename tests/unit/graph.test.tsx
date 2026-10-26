import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useGraphStore, CustomNodeType } from '../../src/state/graphStore';
import { Inspector } from '../../src/components/Inspector/Inspector';

describe('Graph Store & Inspector Unit Tests', () => {
  beforeEach(() => {
    useGraphStore.getState().resetGraph();
  });

  it('initializes with default traffic source node and empty edges for puzzle solving', () => {
    const { nodes, edges } = useGraphStore.getState();
    expect(nodes.length).toBe(1); // Only User Traffic
    expect(edges.length).toBe(0);
    expect(nodes[0].data.name).toBe('User Traffic');
  });

  it('allows adding a new node to the store', () => {
    const newNode: CustomNodeType = {
      id: 'test-cache-1',
      type: 'custom',
      position: { x: 500, y: 100 },
      data: {
        name: 'Redis In-Memory Cache',
        category: 'storage',
        cost: 25,
        capacityRps: 20000,
        addedLatencyMs: 1,
        icon: 'Database',
        status: 'healthy',
      },
    };

    useGraphStore.getState().addNode(newNode);
    expect(useGraphStore.getState().nodes.length).toBe(2);
    expect(useGraphStore.getState().nodes.some((n) => n.id === 'test-cache-1')).toBe(true);
  });

  it('allows connecting two nodes with an edge', () => {
    const targetNode: CustomNodeType = {
      id: 'db-sqlite-1',
      type: 'custom',
      position: { x: 400, y: 180 },
      data: {
        name: 'SQLite / Micro DB',
        category: 'storage',
        cost: 10,
        capacityRps: 150,
        addedLatencyMs: 8,
        icon: 'Database',
        status: 'healthy',
      },
    };
    useGraphStore.getState().addNode(targetNode);

    useGraphStore.getState().onConnect({
      source: 'user-client-1',
      target: 'db-sqlite-1',
      sourceHandle: null,
      targetHandle: null,
    });

    const edges = useGraphStore.getState().edges;
    expect(edges.length).toBe(1);
    expect(edges.some((e) => e.source === 'user-client-1' && e.target === 'db-sqlite-1')).toBe(true);
  });

  it('Inspector displays selected node details and allows updating capacity', () => {
    const appNode: CustomNodeType = {
      id: 'app-server-1',
      type: 'custom',
      position: { x: 300, y: 180 },
      data: {
        name: 'App Server (VM)',
        category: 'compute',
        cost: 20,
        capacityRps: 500,
        addedLatencyMs: 25,
        icon: 'Cpu',
        status: 'healthy',
      },
    };
    useGraphStore.getState().addNode(appNode);

    // Select app server
    useGraphStore.getState().selectNode('app-server-1');
    render(<Inspector />);

    expect(screen.getByText('App Server (VM)')).toBeInTheDocument();
    expect(screen.getByText('$20 /tháng')).toBeInTheDocument();

    const capacityInput = screen.getByLabelText(/công suất tối đa/i) as HTMLInputElement;
    expect(capacityInput.value).toBe('500');

    fireEvent.change(capacityInput, { target: { value: '800' } });

    const updatedNode = useGraphStore.getState().nodes.find((n) => n.id === 'app-server-1');
    expect(updatedNode?.data.capacityRps).toBe(800);
  });

  it('Inspector allows removing a component', () => {
    const dbNode: CustomNodeType = {
      id: 'db-sqlite-1',
      type: 'custom',
      position: { x: 500, y: 180 },
      data: {
        name: 'SQLite / Micro DB',
        category: 'storage',
        cost: 10,
        capacityRps: 150,
        addedLatencyMs: 8,
        icon: 'Database',
        status: 'healthy',
      },
    };
    useGraphStore.getState().addNode(dbNode);
    useGraphStore.getState().selectNode('db-sqlite-1');
    render(<Inspector />);

    const deleteBtn = screen.getByRole('button', { name: /remove component/i });
    expect(deleteBtn).toBeInTheDocument();
    fireEvent.click(deleteBtn);

    expect(useGraphStore.getState().nodes.some((n) => n.id === 'db-sqlite-1')).toBe(false);
    expect(useGraphStore.getState().selectedNodeId).toBeNull();
  });
});
