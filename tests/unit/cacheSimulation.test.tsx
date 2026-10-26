import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { calculateSimulationTick } from '../../src/simulation/engineMath';
import { calculateScore } from '../../src/simulation/scoring';
import { LEVEL_01, LEVEL_02, ALL_LEVELS } from '../../src/levels';
import { TopBar } from '../../src/components/TopBar/TopBar';
import { CustomNodeType } from '../../src/state/graphStore';
import { Edge } from '@xyflow/react';

describe('S-008 Redis Cache & Level 2 Simulation', () => {
  const baseNodes: CustomNodeType[] = [
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
        currentRps: 2500,
      },
    },
    {
      id: 'app-server-1',
      type: 'custom',
      position: { x: 380, y: 180 },
      data: {
        name: 'App Server (VM)',
        category: 'compute',
        cost: 45,
        capacityRps: 3000,
        addedLatencyMs: 20,
        icon: 'Cpu',
        status: 'healthy',
        currentRps: 2500,
        tier: 'medium',
      },
    },
    {
      id: 'cache-redis-1',
      type: 'custom',
      position: { x: 680, y: 180 },
      data: {
        name: 'Redis Cache',
        category: 'storage',
        cost: 25,
        capacityRps: 20000,
        addedLatencyMs: 1,
        icon: 'Database',
        status: 'healthy',
        currentRps: 2500,
      },
    },
    {
      id: 'db-postgres-1',
      type: 'custom',
      position: { x: 960, y: 180 },
      data: {
        name: 'PostgreSQL DB',
        category: 'storage',
        cost: 40,
        capacityRps: 600,
        addedLatencyMs: 15,
        icon: 'Database',
        status: 'healthy',
        currentRps: 272,
      },
    },
  ];

  const cachedEdges: Edge[] = [
    { id: 'e1-2', source: 'user-client-1', target: 'app-server-1', type: 'particle' },
    { id: 'e2-3', source: 'app-server-1', target: 'cache-redis-1', type: 'particle' },
    { id: 'e3-4', source: 'cache-redis-1', target: 'db-postgres-1', type: 'particle' },
  ];

  it('absorbs 90% read traffic with Redis Cache, preventing DB exhaustion under 2500 RPS peak', () => {
    // 2500 RPS peak with 1% write, 99% read
    const result = calculateSimulationTick(baseNodes, cachedEdges, 2500, 100, 0.01);

    // Redis Cache absorbs 90% read: 2500 * 0.99 * 0.90 = 2227.5 hits
    // Miss & Write downstream to DB: 2500 - 2227.5 = 272.5 RPS
    expect(result.nodeUpdates['db-postgres-1'].currentRps).toBeCloseTo(272.5, 0);
    expect(result.nodeUpdates['db-postgres-1'].status).toBe('healthy');
    expect(result.nodeUpdates['cache-redis-1'].status).toBe('healthy');
    // App Server is at 83.3% capacity (2500/3000), giving warning badge without dropping requests
    expect(result.nodeUpdates['app-server-1'].status).toBe('warning');

    // All 2500 RPS succeed without packet drops
    expect(result.metrics.throughputRps).toBe(2500);
    expect(result.metrics.errorRate).toBe(0);
    // P95 latency is well below Level 2 target (80ms): ~36 * 1.15 = 41ms
    expect(result.metrics.p95LatencyMs).toBeLessThan(80);
    expect(result.hasComputeLayer).toBe(true);
    expect(result.hasStorageLayer).toBe(true);
    expect(result.hasDirectClientToStorage).toBe(false);
  });

  it('crashes Database with severe drops when Redis Cache is omitted during 2500 RPS spike', () => {
    // Architecture without Redis Cache: User -> App Server Medium -> PostgreSQL DB (600 RPS)
    const directNodes = baseNodes.filter((n) => n.id !== 'cache-redis-1');
    const directEdges: Edge[] = [
      { id: 'e1-2', source: 'user-client-1', target: 'app-server-1', type: 'particle' },
      { id: 'e2-4', source: 'app-server-1', target: 'db-postgres-1', type: 'particle' },
    ];

    const result = calculateSimulationTick(directNodes, directEdges, 2500, 100, 0.01);

    // DB receives all 2500 RPS directly, exceeding its 600 RPS capacity by 1900 RPS
    expect(result.nodeUpdates['db-postgres-1'].currentRps).toBe(2500);
    expect(result.nodeUpdates['db-postgres-1'].status).toBe('overloaded');
    expect(result.metrics.throughputRps).toBe(600);
    expect(result.metrics.errorRate).toBeGreaterThan(0.7); // ~76% drops
  });

  it('awards 3 stars for Level 2 reference architecture under $100 budget', () => {
    // Reference: App Server Medium ($45) + Redis ($25) + Micro DB ($10) = $80 ($80 <= 0.80 * $100)
    const score = calculateScore({
      totalRequests: 25000,
      successfulRequests: 25000,
      p95LatencyMs: 42,
      targetLatencyMs: LEVEL_02.latencyTargetMs, // 80ms
      actualCost: 80,
      budgetMax: LEVEL_02.budgetMax, // 100
      incidentUptimeSeconds: 15,
      totalIncidentSeconds: 15,
      slaTarget: LEVEL_02.slaTarget, // 99.5%
      hasComputeLayer: true,
      hasStorageLayer: true,
      hasDirectClientToStorage: false,
      writeRatio: 0.01,
    });

    expect(score.throughputScore).toBe(350);
    expect(score.latencyScore).toBe(250);
    expect(score.costScore).toBeGreaterThanOrEqual(175);
    expect(score.reliabilityScore).toBe(150);
    expect(score.penalties).toBe(0);
    expect(score.totalScore).toBeGreaterThanOrEqual(850);
    expect(score.stars).toBe(3);
  });

  it('renders Level Switcher in TopBar and triggers level change callback', () => {
    const handleSelectLevel = vi.fn();

    render(
      <TopBar
        metrics={{
          throughputRps: 300,
          p95LatencyMs: 35,
          costPerMonth: 80,
          budgetLimit: 100,
          errorRate: 0,
          activeRequests: 10,
        }}
        simulation={{ isRunning: false, speed: 1, elapsedSeconds: 0 }}
        levels={ALL_LEVELS}
        currentLevelId="level-01-bakery"
        onSelectLevel={handleSelectLevel}
        onToggleSimulation={vi.fn()}
        onSetSpeed={vi.fn()}
      />
    );

    // Verify level dropdown is present
    const select = screen.getByRole('combobox', { name: /Chọn màn chơi/i });
    expect(select).toBeInTheDocument();
    expect(screen.getByText('Level 1: The Bakery')).toBeInTheDocument();
    expect(screen.getByText('Level 2: Tech News')).toBeInTheDocument();

    // Select Level 2
    fireEvent.change(select, { target: { value: 'level-02-tech-news' } });
    expect(handleSelectLevel).toHaveBeenCalledWith('level-02-tech-news');
  });
});
