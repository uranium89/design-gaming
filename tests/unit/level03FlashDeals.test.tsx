import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { calculateSimulationTick } from '../../src/simulation/engineMath';
import { calculateScore } from '../../src/simulation/scoring';
import { LEVEL_03, ALL_LEVELS } from '../../src/levels';
import { TopBar } from '../../src/components/TopBar/TopBar';

describe('S-010 Level 03 Flash Deals Fashion Simulation', () => {
  it('correctly exports LEVEL_03 in ALL_LEVELS list with valid parameters', () => {
    expect(ALL_LEVELS.length).toBeGreaterThanOrEqual(3);
    expect(LEVEL_03.id).toBe('level-03-flash-deals');
    expect(LEVEL_03.badge).toBe('Level 3: Flash Deals');
    expect(LEVEL_03.budgetMax).toBe(250);
    expect(LEVEL_03.baseRps).toBe(500);
    expect(LEVEL_03.spikeRps).toBe(4000);
    expect(LEVEL_03.writeRatio).toBe(0.30);
    expect(LEVEL_03.latencyTargetMs).toBe(120);
    expect(LEVEL_03.slaTarget).toBe(99.9);
    expect(LEVEL_03.hasChaosCrashEvent).toBe(true);
  });

  it('handles 4,000 RPS spike without drops in Reference Architecture with Load Balancer and Redis', () => {
    // 4000 RPS peak, 70% Read, 30% Write
    const result = calculateSimulationTick(
      LEVEL_03.referenceNodes,
      LEVEL_03.referenceEdges,
      4000,
      LEVEL_03.budgetMax,
      LEVEL_03.writeRatio
    );

    // Each App Server (Medium 3000 RPS) receives 4000 / 2 = 2000 RPS
    expect(result.nodeUpdates['ref-server-1'].currentRps).toBe(2000);
    expect(result.nodeUpdates['ref-server-2'].currentRps).toBe(2000);
    expect(result.nodeUpdates['ref-server-1'].status).toBe('healthy');
    expect(result.nodeUpdates['ref-server-2'].status).toBe('healthy');

    // Redis Cache absorbs 90% of read traffic: 4000 * 0.70 * 0.90 = 2520 hits
    // DB receives 280 miss reads + 1200 writes = 1480 RPS (within 2000 RPS DB capacity)
    expect(result.nodeUpdates['ref-db-1'].currentRps).toBeCloseTo(1480, 0);
    expect(result.nodeUpdates['ref-db-1'].status).toBe('healthy');

    // All 4000 RPS succeed without packet drops
    expect(result.metrics.throughputRps).toBe(4000);
    expect(result.metrics.errorRate).toBe(0);
    expect(result.metrics.p95LatencyMs).toBeLessThan(120);
    expect(result.metrics.costPerMonth).toBe(180); // $180 <= $250
  });

  it('fails completely with SPOF (Single Point of Failure) when sole server crashes', () => {
    // Single server architecture: User -> Server 1 -> Redis -> DB
    const spofNodes = LEVEL_03.referenceNodes
      .filter((n) => n.id !== 'ref-lb-1' && n.id !== 'ref-server-2')
      .map((n) => (n.id === 'ref-server-1' ? { ...n, data: { ...n.data, status: 'crashed' as const } } : n));

    const spofEdges = [
      { id: 'e1', source: 'user-client-1', target: 'ref-server-1', type: 'particle' },
      { id: 'e2', source: 'ref-server-1', target: 'ref-cache-1', type: 'particle' },
      { id: 'e3', source: 'ref-cache-1', target: 'ref-db-1', type: 'particle' },
    ];

    const result = calculateSimulationTick(spofNodes, spofEdges, 4000, 250, 0.3);

    // With single server crashed, 100% traffic is dropped
    expect(result.nodeUpdates['ref-server-1'].status).toBe('crashed');
    expect(result.metrics.throughputRps).toBe(0);
    expect(result.metrics.errorRate).toBe(1);
  });

  it('awards 3 stars for Level 3 reference architecture in $250 budget', () => {
    const score = calculateScore({
      totalRequests: 40000,
      successfulRequests: 40000,
      p95LatencyMs: 48,
      targetLatencyMs: LEVEL_03.latencyTargetMs, // 120ms
      actualCost: 180, // $180 <= 0.80 * $250 ($200)
      budgetMax: LEVEL_03.budgetMax, // $250
      incidentUptimeSeconds: 15,
      totalIncidentSeconds: 15,
      slaTarget: LEVEL_03.slaTarget, // 99.9%
      hasComputeLayer: true,
      hasStorageLayer: true,
      hasDirectClientToStorage: false,
      writeRatio: 0.30,
    });

    expect(score.throughputScore).toBe(350);
    expect(score.latencyScore).toBe(250);
    expect(score.costScore).toBeGreaterThanOrEqual(175);
    expect(score.reliabilityScore).toBe(150);
    expect(score.penalties).toBe(0);
    expect(score.totalScore).toBeGreaterThanOrEqual(850);
    expect(score.stars).toBe(3);
  });

  it('renders Level 3 in TopBar dropdown and allows switching to it', () => {
    const handleSelectLevel = vi.fn();

    render(
      <TopBar
        metrics={{
          throughputRps: 500,
          p95LatencyMs: 40,
          costPerMonth: 180,
          budgetLimit: 250,
          errorRate: 0,
          activeRequests: 20,
        }}
        simulation={{ isRunning: false, speed: 1, elapsedSeconds: 0 }}
        levels={ALL_LEVELS}
        currentLevelId="level-01-bakery"
        onSelectLevel={handleSelectLevel}
        onToggleSimulation={vi.fn()}
        onSetSpeed={vi.fn()}
      />
    );

    const select = screen.getByRole('combobox', { name: /Chọn màn chơi/i });
    expect(screen.getByText(/Level 3: Flash Deals/i)).toBeInTheDocument();

    fireEvent.change(select, { target: { value: 'level-03-flash-deals' } });
    expect(handleSelectLevel).toHaveBeenCalledWith('level-03-flash-deals');
  });
});
