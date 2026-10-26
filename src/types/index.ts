export type ComponentCategory = 'routing' | 'compute' | 'storage' | 'messaging';

export interface ComponentItem {
  id: string;
  name: string;
  category: ComponentCategory;
  cost: number; // $/month
  capacityRps: number;
  addedLatencyMs: number;
  icon: string;
  description: string;
}

export interface LiveMetrics {
  throughputRps: number;
  p95LatencyMs: number;
  costPerMonth: number;
  budgetLimit: number;
  errorRate: number;
  activeRequests: number;
}

export interface SimulationState {
  isRunning: boolean;
  speed: 1 | 2 | 5;
  elapsedSeconds: number;
}
