import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { TopBar } from '../../src/components/TopBar/TopBar';
import { ALL_LEVELS } from '../../src/levels';

describe('S-019 TopBar Responsive Layout & Action Consolidation Unit Tests', () => {
  it('renders compact TopBar with responsive text spans and accessible icon buttons', () => {
    const onReset = vi.fn();
    const onOpenBriefing = vi.fn();
    const onOpenBlueprint = vi.fn();

    render(
      <TopBar
        metrics={{
          throughputRps: 1500,
          p95LatencyMs: 25,
          costPerMonth: 120,
          budgetLimit: 250,
          errorRate: 0,
          activeRequests: 5,
        }}
        simulation={{ isRunning: false, speed: 1, elapsedSeconds: 0 }}
        levels={ALL_LEVELS}
        currentLevelId="level-01-bakery"
        onResetProgress={onReset}
        onOpenBriefing={onOpenBriefing}
        onOpenBlueprint={onOpenBlueprint}
        onToggleSimulation={() => {}}
        onSetSpeed={() => {}}
      />
    );

    // Verify all primary buttons and labels exist
    expect(screen.getByRole('button', { name: /Xem đề bài/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Bản vẽ kiến trúc và chia sẻ/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Đặt lại tiến trình chơi/i })).toBeInTheDocument();

    // Verify metrics are displayed
    expect(screen.getByText('1,500 RPS')).toBeInTheDocument();
    expect(screen.getByText('25 ms')).toBeInTheDocument();
    expect(screen.getByText('$120 /mo')).toBeInTheDocument();
    expect(screen.getByText('$250 /mo')).toBeInTheDocument();
  });
});
