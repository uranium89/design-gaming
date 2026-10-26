import { useEffect, useRef, useState, useCallback } from 'react';
import { useGraphStore } from '../state/graphStore';
import { LiveMetrics, SimulationState, SimulationStats } from '../types';
import { TickResult } from './engineMath';

import { LevelDefinition } from '../levels/level01';
import { LEVEL_01 } from '../levels/level01';

const DEFAULT_METRICS: LiveMetrics = {
  throughputRps: 0,
  p95LatencyMs: 0,
  costPerMonth: 0,
  budgetLimit: 35,
  errorRate: 0,
  activeRequests: 0,
};

const DEFAULT_STATS: SimulationStats = {
  elapsedSeconds: 0,
  isSpikeActive: false,
  totalRequestsGenerated: 0,
  totalRequestsSucceeded: 0,
  incidentUptimeSeconds: 0,
  totalIncidentSeconds: 0,
  maxP95Observed: 0,
};

export function useSimulation(level: LevelDefinition = LEVEL_01) {
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const updateNodeData = useGraphStore((state) => state.updateNodeData);

  const workerRef = useRef<Worker | null>(null);

  const [metrics, setMetrics] = useState<LiveMetrics>({
    ...DEFAULT_METRICS,
    budgetLimit: level.budgetMax,
  });
  const [stats, setStats] = useState<SimulationStats>(DEFAULT_STATS);
  const [simulation, setSimulation] = useState<SimulationState>({
    isRunning: false,
    speed: 1,
    elapsedSeconds: 0,
  });

  // Initialize Worker
  useEffect(() => {
    // Only in browser environment
    if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
      try {
        const worker = new Worker(
          new URL('./simulationWorker.ts', import.meta.url),
          { type: 'module' }
        );

        worker.onmessage = (event: MessageEvent) => {
          const { type, payload } = event.data;
          if (type === 'TICK_UPDATE') {
            const { metrics: newMetrics, nodeUpdates, stats: workerStats } = payload as TickResult & {
              stats?: SimulationStats;
            };
            setMetrics(newMetrics);

            if (workerStats) {
              setStats(workerStats);
              setSimulation((prev) => ({
                ...prev,
                elapsedSeconds: workerStats.elapsedSeconds,
                stats: workerStats,
              }));
            }

            // Update node visual statuses
            Object.entries(nodeUpdates).forEach(([nodeId, update]) => {
              updateNodeData(nodeId, {
                status: update.status,
                currentRps: update.currentRps,
              });
            });
          }
        };

        workerRef.current = worker;
      } catch (err) {
        console.warn('Web Worker initialization skipped (test/fallback mode):', err);
      }
    }

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, [updateNodeData]);

  // Sync graph and level parameters with worker when nodes, edges, or level change
  useEffect(() => {
    setMetrics((prev) => ({ ...prev, budgetLimit: level.budgetMax }));
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: 'SYNC_GRAPH',
        payload: {
          nodes,
          edges,
          baseRps: level.baseRps,
          spikeRps: level.spikeRps,
          budgetLimit: level.budgetMax,
          writeRatio: level.writeRatio ?? 0.20,
          hasChaosCrashEvent: !!level.hasChaosCrashEvent,
        },
      });
    }
  }, [nodes, edges, level]);

  const setSimulationRunning = useGraphStore((state) => state.setSimulationRunning);
  const setGraphSimulationSpeed = useGraphStore((state) => state.setSimulationSpeed);

  const toggleSimulation = useCallback(() => {
    setSimulation((prev) => {
      const nextRunning = !prev.isRunning;
      setSimulationRunning(nextRunning);
      workerRef.current?.postMessage({
        type: nextRunning ? 'START' : 'PAUSE',
      });
      return { ...prev, isRunning: nextRunning };
    });
  }, [setSimulationRunning]);

  const setSpeed = useCallback((speed: 1 | 2 | 5) => {
    setGraphSimulationSpeed(speed);
    setSimulation((prev) => {
      workerRef.current?.postMessage({
        type: 'SET_SPEED',
        payload: { speed },
      });
      return { ...prev, speed };
    });
  }, [setGraphSimulationSpeed]);

  const triggerSpike = useCallback(() => {
    workerRef.current?.postMessage({
      type: 'TRIGGER_SPIKE',
    });
  }, []);

  const resetSimulation = useCallback(() => {
    workerRef.current?.postMessage({
      type: 'RESET',
    });
    setSimulationRunning(false);
    setSimulation({
      isRunning: false,
      speed: 1,
      elapsedSeconds: 0,
      stats: DEFAULT_STATS,
    });
    setStats(DEFAULT_STATS);
  }, [setSimulationRunning]);

  return {
    metrics,
    simulation,
    stats,
    toggleSimulation,
    setSpeed,
    triggerSpike,
    resetSimulation,
  };
}
