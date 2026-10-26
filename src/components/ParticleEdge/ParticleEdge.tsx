import React from 'react';
import { BaseEdge, EdgeProps, getBezierPath } from '@xyflow/react';
import styles from './ParticleEdge.module.css';
import { useGraphStore } from '../../state/graphStore';

export const ParticleEdge: React.FC<EdgeProps> = ({
  id,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const nodes = useGraphStore((state) => state.nodes);
  const isRunning = useGraphStore((state) => state.isSimulationRunning);
  const speed = useGraphStore((state) => state.simulationSpeed);

  // Target node status determines congestion and particle color
  const targetNode = nodes.find((n) => n.id === target);
  const status = targetNode?.data?.status || 'healthy';

  const edgeClass =
    status === 'overloaded'
      ? `${styles.edgeBase} ${styles.edgeOverloaded}`
      : status === 'warning'
      ? `${styles.edgeBase} ${styles.edgeWarning}`
      : styles.edgeBase;

  const particleClass =
    status === 'overloaded'
      ? styles.particleOverloaded
      : status === 'warning'
      ? styles.particleWarning
      : styles.particleHealthy;

  const baseDurNum = 1.2 / (speed || 1);
  const duration = `${baseDurNum.toFixed(2)}s`;
  const offsets = [0, 0.25, 0.5, 0.75];

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        className={edgeClass}
        markerEnd={markerEnd}
      />
      {isRunning && (
        <g data-testid={`particle-group-${id}`}>
          {offsets.map((offset, idx) => {
            const begin = `${(offset * baseDurNum).toFixed(2)}s`;
            return (
              <circle key={idx} r="3.5" className={particleClass}>
                <animateMotion
                  dur={duration}
                  repeatCount="indefinite"
                  path={edgePath}
                  begin={begin}
                  calcMode="linear"
                />
              </circle>
            );
          })}
        </g>
      )}
    </>
  );
};
