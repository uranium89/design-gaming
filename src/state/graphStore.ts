import { create } from 'zustand';
import {
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react';

export interface NodeData extends Record<string, unknown> {
  name: string;
  category: 'routing' | 'compute' | 'storage' | 'messaging';
  cost: number;
  capacityRps: number;
  addedLatencyMs: number;
  icon: string;
  status: 'healthy' | 'warning' | 'overloaded' | 'crashed';
  currentRps?: number;
}

export type CustomNodeType = Node<NodeData, 'custom'>;

interface GraphStore {
  nodes: CustomNodeType[];
  edges: Edge[];
  selectedNodeId: string | null;
  onNodesChange: OnNodesChange<CustomNodeType>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: CustomNodeType) => void;
  removeNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  updateNodeData: (id: string, partialData: Partial<NodeData>) => void;
  resetGraph: () => void;
}

const INITIAL_NODES: CustomNodeType[] = [
  {
    id: 'user-client-1',
    type: 'custom',
    position: { x: 80, y: 160 },
    data: {
      name: 'User Traffic',
      category: 'routing',
      cost: 0,
      capacityRps: 10000,
      addedLatencyMs: 0,
      icon: 'Users',
      status: 'healthy',
      currentRps: 50,
    },
  },
  {
    id: 'app-server-1',
    type: 'custom',
    position: { x: 380, y: 160 },
    data: {
      name: 'App Server (VM)',
      category: 'compute',
      cost: 20,
      capacityRps: 500,
      addedLatencyMs: 25,
      icon: 'Cpu',
      status: 'healthy',
      currentRps: 50,
    },
  },
  {
    id: 'db-postgres-1',
    type: 'custom',
    position: { x: 680, y: 160 },
    data: {
      name: 'PostgreSQL DB',
      category: 'storage',
      cost: 40,
      capacityRps: 600,
      addedLatencyMs: 15,
      icon: 'Database',
      status: 'healthy',
      currentRps: 50,
    },
  },
];

const INITIAL_EDGES: Edge[] = [
  {
    id: 'e1-2',
    source: 'user-client-1',
    target: 'app-server-1',
    animated: true,
    style: { stroke: '#6366f1', strokeWidth: 2 },
  },
  {
    id: 'e2-3',
    source: 'app-server-1',
    target: 'db-postgres-1',
    animated: true,
    style: { stroke: '#6366f1', strokeWidth: 2 },
  },
];

export const useGraphStore = create<GraphStore>((set, get) => ({
  nodes: INITIAL_NODES,
  edges: INITIAL_EDGES,
  selectedNodeId: null,

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 },
        },
        get().edges
      ),
    });
  },

  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },

  removeNode: (id) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
  },

  selectNode: (id) => {
    set({ selectedNodeId: id });
  },

  updateNodeData: (id, partialData) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: { ...node.data, ...partialData },
          };
        }
        return node;
      }),
    });
  },

  resetGraph: () => {
    set({
      nodes: INITIAL_NODES,
      edges: INITIAL_EDGES,
      selectedNodeId: null,
    });
  },
}));
