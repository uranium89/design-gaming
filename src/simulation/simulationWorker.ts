import { calculateSimulationTick } from './engineMath';
import { CustomNodeType } from '../state/graphStore';
import { Edge } from '@xyflow/react';

let currentNodes: CustomNodeType[] = [];
let currentEdges: Edge[] = [];
let isRunning = false;
let speed: 1 | 2 | 5 = 1;
let trafficRps = 50;
let timer: ReturnType<typeof setInterval> | null = null;

function runTick() {
  if (!isRunning || currentNodes.length === 0) return;

  const result = calculateSimulationTick(currentNodes, currentEdges, trafficRps);

  self.postMessage({
    type: 'TICK_UPDATE',
    payload: result,
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
      if (payload.trafficRps !== undefined) trafficRps = payload.trafficRps;
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

    case 'SET_TRAFFIC':
      trafficRps = payload.trafficRps || 50;
      break;

    case 'RESET':
      isRunning = false;
      if (timer) clearInterval(timer);
      trafficRps = 50;
      break;

    default:
      break;
  }
};
