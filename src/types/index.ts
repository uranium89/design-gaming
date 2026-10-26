export type ComponentCategory = 'routing' | 'compute' | 'storage' | 'messaging';

export type CloudProvider = 'freestyle' | 'aws' | 'azure' | 'gcp';

export interface ComponentItem {
  id: string;
  name: string;
  category: ComponentCategory;
  cost: number; // $/month
  capacityRps: number;
  addedLatencyMs: number;
  icon: string;
  description: string;
  provider?: CloudProvider;
}

export interface LiveMetrics {
  throughputRps: number;
  p95LatencyMs: number;
  costPerMonth: number;
  budgetLimit: number;
  errorRate: number;
  activeRequests: number;
}

export interface SimulationStats {
  elapsedSeconds: number;
  isSpikeActive: boolean;
  totalRequestsGenerated: number;
  totalRequestsSucceeded: number;
  incidentUptimeSeconds: number;
  totalIncidentSeconds: number;
  maxP95Observed: number;
}

export interface SimulationState {
  isRunning: boolean;
  speed: 1 | 2 | 5;
  elapsedSeconds: number;
  stats?: SimulationStats;
}

