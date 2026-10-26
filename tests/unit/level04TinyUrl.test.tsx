import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { calculateSimulationTick } from '../../src/simulation/engineMath';
import { calculateScore } from '../../src/simulation/scoring';
import { LEVEL_04, ALL_LEVELS } from '../../src/levels';
import { TopBar } from '../../src/components/TopBar/TopBar';

describe('S-012 Level 04 Global TinyURL Simulation & Hot Key Event', () => {
  it('correctly exports LEVEL_04 in ALL_LEVELS with 8,000 RPS peak, 95% Read, $350 budget', () => {
    expect(ALL_LEVELS.length).toBeGreaterThanOrEqual(4);
    expect(LEVEL_04.id).toBe('level-04-tinyurl');
    expect(LEVEL_04.badge).toBe('Level 4: TinyURL');
    expect(LEVEL_04.budgetMax).toBe(350);
    expect(LEVEL_04.baseRps).toBe(1000);
    expect(LEVEL_04.spikeRps).toBe(8000);
    expect(LEVEL_04.writeRatio).toBe(0.05); // 95% Read, 5% Write
    expect(LEVEL_04.latencyTargetMs).toBe(70);
    expect(LEVEL_04.slaTarget).toBe(99.9);
    expect(LEVEL_04.hasHotKeyEvent).toBe(true);
  });

  it('handles 8,000 RPS peak without dropped requests in Reference Architecture', () => {
    const result = calculateSimulationTick(
      LEVEL_04.referenceNodes,
      LEVEL_04.referenceEdges,
      8000,
      LEVEL_04.budgetMax,
      LEVEL_04.writeRatio
    );

    // Load Balancer distributes 8000 RPS evenly to 3 Medium App Servers (2666.67 RPS each)
    expect(result.nodeUpdates['ref-server-1'].currentRps).toBeCloseTo(2666.67, 0);
    expect(result.nodeUpdates['ref-server-2'].currentRps).toBeCloseTo(2666.67, 0);
    expect(result.nodeUpdates['ref-server-3'].currentRps).toBeCloseTo(2666.67, 0);

    // Redis Cache absorbs 90% of read traffic (8000 * 0.95 * 0.90 = 6840 hits)
    // Master DB gets 400 writes (8000 * 0.05)
    expect(result.nodeUpdates['ref-db-master'].currentRps).toBeCloseTo(400, 0);
    expect(result.nodeUpdates['ref-db-master'].status).toBe('healthy');

    // 2 Read Replicas split remaining 760 miss reads (380 RPS each)
    expect(result.nodeUpdates['ref-db-replica-1'].currentRps).toBeCloseTo(380, 0);
    expect(result.nodeUpdates['ref-db-replica-2'].currentRps).toBeCloseTo(380, 0);
    expect(result.nodeUpdates['ref-db-replica-1'].status).toBe('healthy');
    expect(result.nodeUpdates['ref-db-replica-2'].status).toBe('healthy');

    // Zero dropped packets & low latency
    expect(result.metrics.throughputRps).toBe(8000);
    expect(result.metrics.errorRate).toBe(0);
    expect(result.metrics.p95LatencyMs).toBeLessThan(70);
    expect(result.metrics.costPerMonth).toBe(275); // $275 <= $280 (80% of $350)
  });

  it('survives viral 10,000 RPS Hot Key surge with Redis Cache protecting Read Replicas', () => {
    const result = calculateSimulationTick(
      LEVEL_04.referenceNodes,
      LEVEL_04.referenceEdges,
      10000,
      LEVEL_04.budgetMax,
      LEVEL_04.writeRatio
    );

    // 3 Medium Servers output 9,000 RPS total.
    // Master DB gets 5% writes of 9,000 = 450 RPS
    expect(result.nodeUpdates['ref-db-master'].currentRps).toBeCloseTo(450, 0);
    // 2 Read Replicas get 855 RPS misses (427.5 RPS each, well within 1500 RPS capacity)
    expect(result.nodeUpdates['ref-db-replica-1'].currentRps).toBeCloseTo(427.5, 0);
    expect(result.nodeUpdates['ref-db-replica-2'].currentRps).toBeCloseTo(427.5, 0);

    expect(result.metrics.throughputRps).toBe(9000); // 3x3000 compute capacity
    expect(result.metrics.p95LatencyMs).toBeLessThan(120);
  });

  it('fails with heavy packet loss during Hot Key surge if Redis Cache is omitted', () => {
    // Architecture without Redis: Servers connect directly to Master DB and Read Replicas
    const noCacheNodes = LEVEL_04.referenceNodes.filter((n) => n.id !== 'ref-cache-1');
    const noCacheEdges = [
      { id: 'e-client-lb', source: 'user-client-1', target: 'ref-lb-1', type: 'particle' },
      { id: 'e-lb-s1', source: 'ref-lb-1', target: 'ref-server-1', type: 'particle' },
      { id: 'e-lb-s2', source: 'ref-lb-1', target: 'ref-server-2', type: 'particle' },
      { id: 'e-lb-s3', source: 'ref-lb-1', target: 'ref-server-3', type: 'particle' },
      // Direct connections from servers to DB & Replicas
      { id: 'e-s1-master', source: 'ref-server-1', target: 'ref-db-master', type: 'particle' },
      { id: 'e-s1-rep1', source: 'ref-server-1', target: 'ref-db-replica-1', type: 'particle' },
      { id: 'e-s1-rep2', source: 'ref-server-1', target: 'ref-db-replica-2', type: 'particle' },
      { id: 'e-s2-master', source: 'ref-server-2', target: 'ref-db-master', type: 'particle' },
      { id: 'e-s2-rep1', source: 'ref-server-2', target: 'ref-db-replica-1', type: 'particle' },
      { id: 'e-s2-rep2', source: 'ref-server-2', target: 'ref-db-replica-2', type: 'particle' },
      { id: 'e-s3-master', source: 'ref-server-3', target: 'ref-db-master', type: 'particle' },
      { id: 'e-s3-rep1', source: 'ref-server-3', target: 'ref-db-replica-1', type: 'particle' },
      { id: 'e-s3-rep2', source: 'ref-server-3', target: 'ref-db-replica-2', type: 'particle' },
    ];

    const result = calculateSimulationTick(
      noCacheNodes,
      noCacheEdges,
      10000,
      LEVEL_04.budgetMax,
      LEVEL_04.writeRatio
    );

    // Without Redis, 9,500 RPS reads hit 2 Read Replicas (total capacity 3,000 RPS)
    // Overwhelms Replicas, dropping thousands of requests!
    expect(result.nodeUpdates['ref-db-replica-1'].status).toBe('overloaded');
    expect(result.nodeUpdates['ref-db-replica-2'].status).toBe('overloaded');
    expect(result.metrics.errorRate).toBeGreaterThan(0.5);
    expect(result.metrics.throughputRps).toBeLessThan(4000);
  });

  it('awards 3 stars for Level 4 reference architecture within $350 budget', () => {
    const score = calculateScore({
      totalRequests: 80000,
      successfulRequests: 80000,
      p95LatencyMs: 24,
      targetLatencyMs: LEVEL_04.latencyTargetMs, // 50ms
      actualCost: 275, // $275 <= 0.80 * $350 ($280)
      budgetMax: LEVEL_04.budgetMax, // $350
      incidentUptimeSeconds: 15,
      totalIncidentSeconds: 15,
      slaTarget: LEVEL_04.slaTarget, // 99.9%
      hasComputeLayer: true,
      hasStorageLayer: true,
      hasDirectClientToStorage: false,
      writeRatio: LEVEL_04.writeRatio ?? 0.05,
    });

    expect(score.throughputScore).toBe(350);
    expect(score.latencyScore).toBe(250);
    expect(score.costScore).toBeGreaterThanOrEqual(100);
    expect(score.reliabilityScore).toBe(150);
    expect(score.penalties).toBe(0);
    expect(score.totalScore).toBeGreaterThanOrEqual(850);
    expect(score.stars).toBe(3);
  });

  it('renders Level 4 in TopBar dropdown and allows switching to it', () => {
    const handleSelectLevel = vi.fn();

    render(
      <TopBar
        metrics={{
          throughputRps: 1000,
          p95LatencyMs: 20,
          costPerMonth: 320,
          budgetLimit: 350,
          errorRate: 0,
          activeRequests: 0,
        }}
        simulation={{ isRunning: false, speed: 1, elapsedSeconds: 0 }}
        levels={ALL_LEVELS}
        currentLevelId="level-04-tinyurl"
        onSelectLevel={handleSelectLevel}
        onToggleSimulation={vi.fn()}
        onSetSpeed={vi.fn()}
        onOpenBriefing={vi.fn()}
        onOpenScoring={vi.fn()}
      />
    );

    const levelSelect = screen.getByRole('combobox');
    expect(levelSelect).toBeDefined();

    // Verify option for Level 4 exists
    const level04Option = screen.getByText(/Level 4: TinyURL/i);
    expect(level04Option).toBeDefined();

    // Trigger change
    fireEvent.change(levelSelect, { target: { value: 'level-04-tinyurl' } });
    expect(handleSelectLevel).toHaveBeenCalledWith('level-04-tinyurl');
  });
});
