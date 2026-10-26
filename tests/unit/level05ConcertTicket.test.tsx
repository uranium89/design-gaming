import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { calculateSimulationTick } from '../../src/simulation/engineMath';
import { calculateScore } from '../../src/simulation/scoring';
import { LEVEL_05, ALL_LEVELS } from '../../src/levels';
import { TopBar } from '../../src/components/TopBar/TopBar';

describe('S-014 Level 05 Concert Ticket Rush Simulation Tests', () => {
  it('correctly exports LEVEL_05 in ALL_LEVELS with 15,000 RPS peak, 90% Write, $400 budget', () => {
    expect(ALL_LEVELS.length).toBeGreaterThanOrEqual(5);
    expect(LEVEL_05.id).toBe('level-05-ticket-rush');
    expect(LEVEL_05.badge).toBe('Level 5: Ticket Rush');
    expect(LEVEL_05.budgetMax).toBe(400);
    expect(LEVEL_05.baseRps).toBe(500);
    expect(LEVEL_05.spikeRps).toBe(15000);
    expect(LEVEL_05.writeRatio).toBe(0.90); // 90% Write, 10% Read
    expect(LEVEL_05.latencyTargetMs).toBe(100);
    expect(LEVEL_05.slaTarget).toBe(99.9);
  });

  it('handles 15,000 RPS write burst without dropped requests in Reference Architecture', () => {
    const result = calculateSimulationTick(
      LEVEL_05.referenceNodes,
      LEVEL_05.referenceEdges,
      15000,
      LEVEL_05.budgetMax,
      LEVEL_05.writeRatio
    );

    // Load Balancer distributes 15,000 RPS evenly to 2 App Servers (7,500 RPS each, within 8,000 capacity)
    expect(result.nodeUpdates['ref-server-1'].currentRps).toBe(7500);
    expect(result.nodeUpdates['ref-server-2'].currentRps).toBe(7500);
    expect(['healthy', 'warning']).toContain(result.nodeUpdates['ref-server-1'].status);
    expect(['healthy', 'warning']).toContain(result.nodeUpdates['ref-server-2'].status);

    // Redis Cache receives 10% read traffic (1,500 RPS)
    expect(result.nodeUpdates['ref-cache-1'].currentRps).toBe(1500);
    expect(result.nodeUpdates['ref-cache-1'].status).toBe('healthy');

    // Message Queue receives 90% write traffic (13,500 RPS)
    expect(result.nodeUpdates['ref-queue-1'].currentRps).toBe(13500);
    expect(result.nodeUpdates['ref-queue-1'].status).toBe('healthy');

    // 2 Worker Pools receive leveled traffic (2,000 RPS each, matching capacity)
    expect(result.nodeUpdates['ref-worker-1'].currentRps).toBe(2000);
    expect(result.nodeUpdates['ref-worker-2'].currentRps).toBe(2000);
    expect(['healthy', 'warning']).toContain(result.nodeUpdates['ref-worker-1'].status);
    expect(['healthy', 'warning']).toContain(result.nodeUpdates['ref-worker-2'].status);

    // Master DB receives 4,000 leveled writes + 150 read misses from cache = 4,150 RPS (capacity 6,000)
    expect(result.nodeUpdates['ref-db-master'].currentRps).toBe(4150);
    expect(['healthy', 'warning']).toContain(result.nodeUpdates['ref-db-master'].status);

    // Zero data loss!
    expect(result.metrics.throughputRps).toBe(15000);
    expect(result.metrics.errorRate).toBe(0);
    expect(result.metrics.p95LatencyMs).toBeLessThan(130);
    expect(result.metrics.costPerMonth).toBe(280); // $280 <= $320 (80% of $400)
  });

  it('earns 3 stars on Level 05 with the reference architecture', () => {
    const simResult = calculateSimulationTick(
      LEVEL_05.referenceNodes,
      LEVEL_05.referenceEdges,
      15000,
      LEVEL_05.budgetMax,
      LEVEL_05.writeRatio
    );

    const score = calculateScore({
      totalRequests: 15000,
      successfulRequests: simResult.metrics.throughputRps,
      p95LatencyMs: simResult.metrics.p95LatencyMs,
      targetLatencyMs: LEVEL_05.latencyTargetMs,
      actualCost: simResult.metrics.costPerMonth,
      budgetMax: LEVEL_05.budgetMax,
      incidentUptimeSeconds: 15,
      totalIncidentSeconds: 15,
      dataLossCount: 0,
      slaTarget: LEVEL_05.slaTarget,
    });

    expect(score.throughputScore).toBe(350);
    expect(score.latencyScore).toBeGreaterThanOrEqual(200);
    expect(score.costScore).toBeGreaterThanOrEqual(100);
    expect(score.reliabilityScore).toBe(150);
    expect(score.penalties).toBe(0);
    expect(score.totalScore).toBeGreaterThanOrEqual(850);
    expect(score.stars).toBe(3);
  });

  it('drops over 7,000 writes and crashes database when Message Queue is missing', () => {
    // Architecture without Message Queue: App Servers write directly to Master DB
    const noQueueNodes = LEVEL_05.referenceNodes.filter(
      (n) => n.id !== 'ref-queue-1' && n.id !== 'ref-worker-1' && n.id !== 'ref-worker-2'
    );
    const noQueueEdges = [
      { id: 'e-client-lb', source: 'user-client-1', target: 'ref-lb-1', type: 'particle' },
      { id: 'e-lb-s1', source: 'ref-lb-1', target: 'ref-server-1', type: 'particle' },
      { id: 'e-lb-s2', source: 'ref-lb-1', target: 'ref-server-2', type: 'particle' },
      // Direct connection to cache for reads
      { id: 'e-s1-cache', source: 'ref-server-1', target: 'ref-cache-1', type: 'particle' },
      { id: 'e-s2-cache', source: 'ref-server-2', target: 'ref-cache-1', type: 'particle' },
      { id: 'e-cache-db', source: 'ref-cache-1', target: 'ref-db-master', type: 'particle' },
      // DIRECT WRITE to Master DB without Queue
      { id: 'e-s1-db', source: 'ref-server-1', target: 'ref-db-master', type: 'particle' },
      { id: 'e-s2-db', source: 'ref-server-2', target: 'ref-db-master', type: 'particle' },
    ];

    const result = calculateSimulationTick(
      noQueueNodes,
      noQueueEdges,
      15000,
      LEVEL_05.budgetMax,
      LEVEL_05.writeRatio
    );

    // Direct writes hit DB Master (13,500 write RPS + 150 read misses = 13,650 RPS against 6,000 capacity)
    expect(result.nodeUpdates['ref-db-master'].currentRps).toBe(13650);
    expect(result.nodeUpdates['ref-db-master'].status).toBe('overloaded');

    // Massive drop of 7,650 write requests!
    expect(result.metrics.errorRate).toBeGreaterThan(0.40);
    expect(result.metrics.throughputRps).toBeLessThan(8000);

    const score = calculateScore({
      totalRequests: 15000,
      successfulRequests: result.metrics.throughputRps,
      p95LatencyMs: result.metrics.p95LatencyMs,
      targetLatencyMs: LEVEL_05.latencyTargetMs,
      actualCost: result.metrics.costPerMonth,
      budgetMax: LEVEL_05.budgetMax,
      incidentUptimeSeconds: 5,
      totalIncidentSeconds: 15,
      dataLossCount: 7650,
      slaTarget: LEVEL_05.slaTarget,
    });
    expect(score.stars).toBeLessThanOrEqual(1);
  });

  it('renders Level 5 in TopBar level dropdown selector', () => {
    const onSelectLevel = vi.fn();
    render(
      <TopBar
        metrics={{
          throughputRps: 500,
          p95LatencyMs: 25,
          costPerMonth: 280,
          budgetLimit: 400,
          errorRate: 0,
          activeRequests: 0,
        }}
        simulation={{ isRunning: false, speed: 1, elapsedSeconds: 0 }}
        levels={ALL_LEVELS}
        currentLevelId="level-05-ticket-rush"
        onSelectLevel={onSelectLevel}
        onToggleSimulation={vi.fn()}
        onSetSpeed={vi.fn()}
        onOpenBriefing={vi.fn()}
        onOpenScoring={vi.fn()}
      />
    );

    const levelSelect = screen.getByRole('combobox');
    expect(levelSelect).toBeDefined();

    // Verify option for Level 5 exists
    const level5Option = screen.getByRole('option', {
      name: /Level 5: Ticket Rush/i,
    });
    expect(level5Option).toBeDefined();

    // Select Level 5
    fireEvent.change(levelSelect, { target: { value: 'level-05-ticket-rush' } });
    expect(onSelectLevel).toHaveBeenCalledWith('level-05-ticket-rush');
  });
});
