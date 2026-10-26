import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import styles from './CanvasArea.module.css';
import { useGraphStore, CustomNodeType } from '../../state/graphStore';
import { CustomNode } from '../CustomNode/CustomNode';
import { ParticleEdge } from '../ParticleEdge/ParticleEdge';
import { Inspector } from '../Inspector/Inspector';
import { ComponentItem } from '../../types';

const FlowCanvas: React.FC = () => {
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const onNodesChange = useGraphStore((state) => state.onNodesChange);
  const onEdgesChange = useGraphStore((state) => state.onEdgesChange);
  const onConnect = useGraphStore((state) => state.onConnect);
  const addNode = useGraphStore((state) => state.addNode);
  const selectNode = useGraphStore((state) => state.selectNode);

  const { screenToFlowPosition } = useReactFlow();

  const nodeTypes = useMemo(
    () => ({
      custom: CustomNode,
    }),
    []
  );

  const edgeTypes = useMemo(
    () => ({
      particle: ParticleEdge,
    }),
    []
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const rawData = event.dataTransfer.getData('application/reactflow');
      if (!rawData) return;

      try {
        const item: ComponentItem = JSON.parse(rawData);
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode: CustomNodeType = {
          id: `${item.id}-${Date.now().toString().slice(-4)}`,
          type: 'custom',
          position,
          data: {
            name: item.name,
            category: item.category,
            cost: item.cost,
            capacityRps: item.capacityRps,
            addedLatencyMs: item.addedLatencyMs,
            icon: item.icon,
            status: 'healthy',
            currentRps: 0,
            provider: item.provider || 'freestyle',
            description: item.description,
          },
        };

        addNode(newNode);
        selectNode(newNode.id);
      } catch (err) {
        console.error('Failed to parse dropped component data:', err);
      }
    },
    [screenToFlowPosition, addNode, selectNode]
  );

  return (
    <div
      className={styles.canvasInner}
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-testid="react-flow-wrapper"
    >
      <ReactFlow<CustomNodeType>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => selectNode(node.id)}
        onPaneClick={() => selectNode(null)}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.5}
          color="#334155"
        />
        <Controls />
        <MiniMap
          nodeStrokeColor="#6366f1"
          nodeColor="#1e293b"
          maskColor="rgba(11, 17, 32, 0.75)"
          style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 6 }}
        />
      </ReactFlow>

      <Inspector />
    </div>
  );
};

export const CanvasArea: React.FC = () => {
  return (
    <main className={styles.canvasArea} role="main" aria-label="Architecture Canvas Grid">
      <ReactFlowProvider>
        <FlowCanvas />
      </ReactFlowProvider>
    </main>
  );
};
