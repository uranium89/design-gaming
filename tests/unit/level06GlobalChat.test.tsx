import { describe, it, expect } from 'vitest';
import { LEVEL_06 } from '../../src/levels/level06';
import { calculateScore } from '../../src/simulation/scoring';
import { isLevelUnlocked } from '../../src/services/progressStorage';

describe('S-023 Level 06 Global Chat App Unit Tests', () => {
  it('verifies Level 06 parameters and constraints', () => {
    expect(LEVEL_06.id).toBe('level-06-global-chat');
    expect(LEVEL_06.badge).toBe('Level 6: Global Chat');
    expect(LEVEL_06.budgetMax).toBe(500);
    expect(LEVEL_06.latencyTargetMs).toBe(50);
    expect(LEVEL_06.slaTarget).toBe(99.9);
    expect(LEVEL_06.baseRps).toBe(1000);
    expect(LEVEL_06.spikeRps).toBe(10000);
    expect(LEVEL_06.writeRatio).toBe(0.60);
    expect(LEVEL_06.targetUsers).toContain('50,000 CCU');
  });

  it('validates reference architecture satisfies capacity, cost, and component criteria', () => {
    const totalCost = LEVEL_06.referenceNodes.reduce((sum, n) => sum + (n.data.cost || 0), 0);
    expect(totalCost).toBeLessThanOrEqual(LEVEL_06.budgetMax * 0.8); // <= $400 for 3-star margin
    expect(totalCost).toBe(250); // 0 + 25 + 45 + 45 + 25 + 40 + 30 + 40 = 250

    // Verify key architectural components exist
    const nodeNames = LEVEL_06.referenceNodes.map((n) => n.data.name);
    expect(nodeNames.some((n) => n.includes('Load Balancer'))).toBe(true);
    expect(nodeNames.some((n) => n.includes('Chat Gateway'))).toBe(true);
    expect(nodeNames.some((n) => n.includes('Redis Cache (Pub/Sub Broker)'))).toBe(true);
    expect(nodeNames.some((n) => n.includes('Message Queue (RabbitMQ)'))).toBe(true);
    expect(nodeNames.some((n) => n.includes('Worker Pool'))).toBe(true);
    expect(nodeNames.some((n) => n.includes('PostgreSQL DB'))).toBe(true);

    // Verify connections connect LB to both Chat Gateways, and Gateways to PubSub & Queue
    const edgeTargets = LEVEL_06.referenceEdges.map((e) => e.target);
    expect(edgeTargets).toContain('ref-app-1');
    expect(edgeTargets).toContain('ref-app-2');
    expect(edgeTargets).toContain('ref-redis-pubsub-1');
    expect(edgeTargets).toContain('ref-queue-1');
  });

  it('verifies strict sequential locking for Level 06', () => {
    // Empty progress: Level 6 must be locked
    expect(isLevelUnlocked({}, 'level-06-global-chat')).toBe(false);

    // Only levels 1-4 completed: Level 6 must still be locked
    const progressLvl4 = {
      'level-01-bakery': { stars: 3, totalScore: 90, passed: true, unlocked: true },
      'level-02-tech-news': { stars: 3, totalScore: 90, passed: true, unlocked: true },
      'level-03-flash-deals': { stars: 3, totalScore: 90, passed: true, unlocked: true },
      'level-04-tinyurl': { stars: 3, totalScore: 90, passed: true, unlocked: true },
    };
    expect(isLevelUnlocked(progressLvl4, 'level-06-global-chat')).toBe(false);

    // Level 5 completed with 1 star: Level 6 unlocks!
    const progressLvl5 = {
      ...progressLvl4,
      'level-05-ticket-rush': { stars: 1, totalScore: 75, passed: true, unlocked: true },
    };
    expect(isLevelUnlocked(progressLvl5, 'level-06-global-chat')).toBe(true);
  });

  it('evaluates passing score and 3 stars on reference architecture', () => {
    const totalCost = LEVEL_06.referenceNodes.reduce((sum, n) => sum + (n.data.cost || 0), 0);

    const score = calculateScore({
      totalRequests: 10000,
      successfulRequests: 10000,
      p95LatencyMs: 35, // Below 50ms target
      targetLatencyMs: LEVEL_06.latencyTargetMs,
      actualCost: totalCost,
      budgetMax: LEVEL_06.budgetMax,
      incidentUptimeSeconds: 15,
      totalIncidentSeconds: 15,
      slaTarget: LEVEL_06.slaTarget,
      hasDirectClientToStorage: false,
      hasComputeLayer: true,
      hasStorageLayer: true,
      writeRatio: LEVEL_06.writeRatio,
    });

    expect(score.stars).toBe(3);
    expect(score.totalScore).toBeGreaterThanOrEqual(750);
  });
});
