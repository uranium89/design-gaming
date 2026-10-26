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
  isSimulationRunning: boolean;
  simulationSpeed: 1 | 2 | 5;
  onNodesChange: OnNodesChange<CustomNodeType>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: CustomNodeType) => void;
  removeNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  updateNodeData: (id: string, partialData: Partial<NodeData>) => void;
  setSimulationRunning: (running: boolean) => void;
  setSimulationSpeed: (speed: 1 | 2 | 5) => void;
  resetGraph: () => void;
  loadArchitecture: (nodes: CustomNodeType[], edges: Edge[]) => void;
}

const INITIAL_NODES: CustomNodeType[] = [
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
      currentRps: 50,
    },
  },
];

const INITIAL_EDGES: Edge[] = [];

export const useGraphStore = create<GraphStore>((set, get) => ({
  nodes: INITIAL_NODES,
  edges: INITIAL_EDGES,
  selectedNodeId: null,
  isSimulationRunning: false,
  simulationSpeed: 1,

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
          type: 'particle',
        },
        get().edges
      ),
    });
  },

  setSimulationRunning: (running) => set({ isSimulationRunning: running }),
  setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),

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

  loadArchitecture: (nodes, edges) => {
    set({
      nodes,
      edges,
      selectedNodeId: null,
    });
  },
}));
