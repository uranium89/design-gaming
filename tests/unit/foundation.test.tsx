import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../src/App';
import { TopBar } from '../../src/components/TopBar/TopBar';

describe('Design Foundation Unit Tests', () => {
  it('renders the TopBar with game title and initial metrics', () => {
    render(<App />);
    expect(screen.getByText('Design Gaming')).toBeInTheDocument();
    expect(screen.getAllByText(/Level 1: The Bakery/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('0 RPS')).toBeInTheDocument();
    expect(screen.getByText('0 ms')).toBeInTheDocument();
  });

  it('renders SidebarDock with all core component categories', () => {
    render(<App />);
    expect(screen.getByText('Infrastructure Toolbox')).toBeInTheDocument();
    expect(screen.getByText('Routing & Traffic')).toBeInTheDocument();
    expect(screen.getByText('Compute & App')).toBeInTheDocument();
    expect(screen.getByText('Storage & Database')).toBeInTheDocument();
    expect(screen.getByText('Messaging & Queue')).toBeInTheDocument();
  });

  it('toggles simulation run/pause button correctly', () => {
    let isRunning = false;
    const toggle = () => { isRunning = !isRunning; };
    const { rerender } = render(
      <TopBar
        metrics={{
          throughputRps: 0,
          p95LatencyMs: 0,
          costPerMonth: 0,
          budgetLimit: 35,
          errorRate: 0,
          activeRequests: 0,
        }}
        simulation={{ isRunning, speed: 1, elapsedSeconds: 0 }}
        onToggleSimulation={toggle}
        onSetSpeed={() => {}}
      />
    );

    const runBtn = screen.getByRole('button', { name: /run simulation/i });
    expect(runBtn).toBeInTheDocument();
    fireEvent.click(runBtn);
    expect(isRunning).toBe(true);

    rerender(
      <TopBar
        metrics={{
          throughputRps: 0,
          p95LatencyMs: 0,
          costPerMonth: 0,
          budgetLimit: 35,
          errorRate: 0,
          activeRequests: 0,
        }}
        simulation={{ isRunning: true, speed: 1, elapsedSeconds: 0 }}
        onToggleSimulation={toggle}
        onSetSpeed={() => {}}
      />
    );
    expect(screen.getByRole('button', { name: /pause simulation/i })).toBeInTheDocument();
  });
});
