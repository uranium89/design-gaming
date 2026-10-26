import { useEffect, useRef, useState, useCallback } from 'react';
import { useGraphStore } from '../state/graphStore';
import { LiveMetrics, SimulationState } from '../types';
import { TickResult } from './engineMath';

const DEFAULT_METRICS: LiveMetrics = {
  throughputRps: 0,
  p95LatencyMs: 0,
  costPerMonth: 60,
  budgetLimit: 35,
  errorRate: 0,
  activeRequests: 0,
};

export function useSimulation() {
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const updateNodeData = useGraphStore((state) => state.updateNodeData);

  const workerRef = useRef<Worker | null>(null);

  const [metrics, setMetrics] = useState<LiveMetrics>(DEFAULT_METRICS);
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
            const { metrics: newMetrics, nodeUpdates } = payload as TickResult;
            setMetrics(newMetrics);

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

  // Sync graph with worker when nodes or edges change
  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: 'SYNC_GRAPH',
        payload: { nodes, edges },
      });
    }
  }, [nodes, edges]);

  const toggleSimulation = useCallback(() => {
    setSimulation((prev) => {
      const nextRunning = !prev.isRunning;
      workerRef.current?.postMessage({
        type: nextRunning ? 'START' : 'PAUSE',
      });
      return { ...prev, isRunning: nextRunning };
    });
  }, []);

  const setSpeed = useCallback((speed: 1 | 2 | 5) => {
    setSimulation((prev) => {
      workerRef.current?.postMessage({
        type: 'SET_SPEED',
        payload: { speed },
      });
      return { ...prev, speed };
    });
  }, []);

  return {
    metrics,
    simulation,
    toggleSimulation,
    setSpeed,
  };
}
