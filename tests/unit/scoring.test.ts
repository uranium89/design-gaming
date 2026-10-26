import { describe, it, expect } from 'vitest';
import { calculateScore, ScoringInput } from '../../src/simulation/scoring';

describe('Scoring Engine (GDD Section 3.2)', () => {
  it('awards 3 stars for excellent architecture under 75% budget with low latency', () => {
    const input: ScoringInput = {
      totalRequests: 10000,
      successfulRequests: 10000,
      p95LatencyMs: 35,
      targetLatencyMs: 200,
      actualCost: 20,
      budgetMax: 35, // 20 <= 0.75 * 35 (26.25)
      incidentUptimeSeconds: 15,
      totalIncidentSeconds: 15,
      dataLossCount: 0,
      slaTarget: 99.0,
    };

    const result = calculateScore(input);

    expect(result.throughputScore).toBe(350);
    expect(result.latencyScore).toBe(250);
    // Cost: 20 is between 17.5 (50%) and 35
    expect(result.costScore).toBeGreaterThan(200);
    expect(result.reliabilityScore).toBe(150);
    expect(result.penalties).toBe(0);
    expect(result.totalScore).toBeGreaterThanOrEqual(850);
    expect(result.stars).toBe(3);
  });

  it('calculates the exact GDD Section 3.3 scenario producing 2 stars', () => {
    // Scenario in GDD 3.3:
    // Total: 100,000 req, Success: 98,500 (98.5%)
    // P95: 120ms (Target: 100ms)
    // Cost: $140 (Budget: $200)
    // Incident uptime: 18s / 20s (90%)
    // SLA target: 99.0% -> Uptime 98.5% -> 50 penalty
    const input: ScoringInput = {
      totalRequests: 100000,
      successfulRequests: 98500,
      p95LatencyMs: 120,
      targetLatencyMs: 100,
      actualCost: 140,
      budgetMax: 200,
      incidentUptimeSeconds: 18,
      totalIncidentSeconds: 20,
      slaTarget: 99.0,
      uptimePercent: 98.5,
    };

    const result = calculateScore(input);

    expect(result.throughputScore).toBe(344.75);
    expect(result.latencyScore).toBe(200);
    expect(result.costScore).toBe(200);
    expect(result.reliabilityScore).toBe(135);
    expect(result.penalties).toBe(50);
    expect(result.totalScore).toBe(829.75);
    expect(result.stars).toBe(2);
  });

  it('fails with 0 stars when severely over budget (> 1.2 * budget)', () => {
    const input: ScoringInput = {
      totalRequests: 5000,
      successfulRequests: 5000,
      p95LatencyMs: 50,
      targetLatencyMs: 200,
      actualCost: 50,
      budgetMax: 35, // 50 > 1.2 * 35 (42)
      incidentUptimeSeconds: 10,
      totalIncidentSeconds: 10,
    };

    const result = calculateScore(input);
    expect(result.costScore).toBe(0);
    expect(result.stars).toBe(0);
  });

  it('deducts penalties for data loss and database crash', () => {
    const input: ScoringInput = {
      totalRequests: 1000,
      successfulRequests: 900,
      p95LatencyMs: 150,
      targetLatencyMs: 200,
      actualCost: 30,
      budgetMax: 35,
      incidentUptimeSeconds: 5,
      totalIncidentSeconds: 10,
      dataLossCount: 2,
      dbMasterCrashed: true,
      slaTarget: 99.0,
      uptimePercent: 90.0,
    };

    const result = calculateScore(input);
    // dataLoss (2 * 100 = 200) + SLA penalty (<95% = 150) + dbMasterCrash (80) = 430
    expect(result.penalties).toBe(430);
    expect(result.stars).toBe(0);
  });
});
