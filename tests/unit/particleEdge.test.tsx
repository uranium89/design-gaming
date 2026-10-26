import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ParticleEdge } from '../../src/components/ParticleEdge/ParticleEdge';
import { useGraphStore } from '../../src/state/graphStore';
import { Position } from '@xyflow/react';

describe('ParticleEdge Unit Tests', () => {
  beforeEach(() => {
    useGraphStore.getState().resetGraph();
    useGraphStore.getState().setSimulationRunning(false);
  });

  const defaultProps = {
    id: 'edge-test-1',
    source: 'user-client-1',
    target: 'app-server-1',
    sourceX: 100,
    sourceY: 100,
    targetX: 300,
    targetY: 100,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  };

  it('renders SVG path with default healthy styling when simulation is paused', () => {
    const { container } = render(
      <svg>
        <ParticleEdge {...defaultProps} />
      </svg>
    );

    const path = container.querySelector('path');
    expect(path).toBeInTheDocument();
    // Particles should not be rendered when simulation is not running
    expect(screen.queryByTestId('particle-group-edge-test-1')).not.toBeInTheDocument();
  });

  it('renders moving particles with animateMotion when simulation is active', () => {
    useGraphStore.getState().setSimulationRunning(true);

    const { container } = render(
      <svg>
        <ParticleEdge {...defaultProps} />
      </svg>
    );

    const particleGroup = screen.getByTestId('particle-group-edge-test-1');
    expect(particleGroup).toBeInTheDocument();

    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(4);

    const animMotions = container.querySelectorAll('animateMotion');
    expect(animMotions.length).toBe(4);
  });

  it('applies warning styling when target node status is warning', () => {
    useGraphStore.getState().setSimulationRunning(true);
    useGraphStore.getState().updateNodeData('app-server-1', { status: 'warning' });

    const { container } = render(
      <svg>
        <ParticleEdge {...defaultProps} />
      </svg>
    );

    const path = container.querySelector('path');
    expect(path?.getAttribute('class')).toContain('edgeWarning');

    const circles = container.querySelectorAll('circle');
    expect(circles[0].getAttribute('class')).toContain('particleWarning');
  });

  it('applies overloaded styling when target node status is overloaded', () => {
    useGraphStore.getState().setSimulationRunning(true);
    useGraphStore.getState().updateNodeData('app-server-1', { status: 'overloaded' });

    const { container } = render(
      <svg>
        <ParticleEdge {...defaultProps} />
      </svg>
    );

    const path = container.querySelector('path');
    expect(path?.getAttribute('class')).toContain('edgeOverloaded');

    const circles = container.querySelectorAll('circle');
    expect(circles[0].getAttribute('class')).toContain('particleOverloaded');
  });
});
