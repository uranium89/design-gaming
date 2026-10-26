import { calculateSimulationTick } from './engineMath';
import { CustomNodeType } from '../state/graphStore';
import { Edge } from '@xyflow/react';

let currentNodes: CustomNodeType[] = [];
let currentEdges: Edge[] = [];
let isRunning = false;
let speed: 1 | 2 | 5 = 1;

let baseTrafficRps = 50;
let spikeTrafficRps = 120;
let budgetLimit = 35;
let writeRatio = 0.20;
let hasChaosCrashEvent = false;
let manualSpikeActive = false;
let isSpikeActive = false;

let elapsedSeconds = 0;
let totalRequestsGenerated = 0;
let totalRequestsSucceeded = 0;
let incidentUptimeSeconds = 0;
let totalIncidentSeconds = 0;
let maxP95Observed = 0;

let timer: ReturnType<typeof setInterval> | null = null;

function runTick() {
  if (!isRunning || currentNodes.length === 0) return;

  const dt = 0.1; // 100ms simulated time
  elapsedSeconds += dt;

  // Auto spike trigger between second 30 and 45 (or manual toggle)
  const isAutoSpike = elapsedSeconds >= 30 && elapsedSeconds < 45;
  isSpikeActive = isAutoSpike || manualSpikeActive;
  const currentTraffic = isSpikeActive ? spikeTrafficRps : baseTrafficRps;

  // Auto Chaos Crash Event for Level 3 between second 35 and 45
  let tickNodes = currentNodes;
  if (hasChaosCrashEvent && elapsedSeconds >= 35 && elapsedSeconds < 45) {
    const computeNodes = currentNodes.filter((n) => n.data.category === 'compute');
    if (computeNodes.length > 0) {
      const targetCrashId = computeNodes[0].id;
      tickNodes = currentNodes.map((n) =>
        n.id === targetCrashId ? { ...n, data: { ...n.data, status: 'crashed' as const } } : n
      );
    }
  }

  const result = calculateSimulationTick(
    tickNodes,
    currentEdges,
    currentTraffic,
    budgetLimit,
    writeRatio
  );

  totalRequestsGenerated += currentTraffic * dt;
  totalRequestsSucceeded += result.metrics.throughputRps * dt;
  maxP95Observed = Math.max(maxP95Observed, result.metrics.p95LatencyMs);

  if (isSpikeActive) {
    totalIncidentSeconds += dt;
    if (result.metrics.errorRate < 0.05) {
      incidentUptimeSeconds += dt;
    }
  }

  self.postMessage({
    type: 'TICK_UPDATE',
    payload: {
      ...result,
      stats: {
        elapsedSeconds: Math.floor(elapsedSeconds),
        isSpikeActive,
        totalRequestsGenerated: Math.floor(totalRequestsGenerated),
        totalRequestsSucceeded: Math.floor(totalRequestsSucceeded),
        incidentUptimeSeconds: Math.round(incidentUptimeSeconds * 10) / 10,
        totalIncidentSeconds: Math.round(totalIncidentSeconds * 10) / 10,
        maxP95Observed,
      },
    },
  });
}

function startTimer() {
  if (timer) clearInterval(timer);
  const intervalMs = Math.round(100 / speed); // 100ms per tick at 1x
  timer = setInterval(runTick, intervalMs);
}

self.onmessage = (event: MessageEvent) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'SYNC_GRAPH':
      currentNodes = payload.nodes || [];
      currentEdges = payload.edges || [];
      if (payload.baseRps !== undefined) baseTrafficRps = payload.baseRps;
      if (payload.spikeRps !== undefined) spikeTrafficRps = payload.spikeRps;
      if (payload.budgetLimit !== undefined) budgetLimit = payload.budgetLimit;
      if (payload.writeRatio !== undefined) writeRatio = payload.writeRatio;
      if (payload.hasChaosCrashEvent !== undefined) hasChaosCrashEvent = payload.hasChaosCrashEvent;
      break;

    case 'START':
      isRunning = true;
      startTimer();
      break;

    case 'PAUSE':
      isRunning = false;
      if (timer) clearInterval(timer);
      break;

    case 'SET_SPEED':
      speed = payload.speed || 1;
      if (isRunning) startTimer();
      break;

    case 'TRIGGER_SPIKE':
      manualSpikeActive = !manualSpikeActive;
      break;

    case 'RESET':
      isRunning = false;
      if (timer) clearInterval(timer);
      elapsedSeconds = 0;
      totalRequestsGenerated = 0;
      totalRequestsSucceeded = 0;
      incidentUptimeSeconds = 0;
      totalIncidentSeconds = 0;
      maxP95Observed = 0;
      manualSpikeActive = false;
      isSpikeActive = false;
      break;

    default:
      break;
  }
};
