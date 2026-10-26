import { LevelDefinition } from './level01';

export const SANDBOX_LEVEL: LevelDefinition = {
  id: 'sandbox',
  title: 'Chế Độ Sandbox (Tự Do Thiết Kế)',
  badge: 'Sandbox Mode',
  description:
    'Chế độ tự do không giới hạn ngân sách. Tự do điều chỉnh tải từ 100 đến 50,000 RPS và thử nghiệm bất kỳ kiến trúc nào từ 4 Đế Chế Đám Mây (Freestyle, AWS, Azure, GCP)!',
  targetUsers: 'Tùy chỉnh (100 - 50,000 RPS)',
  baseRps: 1000,
  spikeRps: 1000,
  spikeDurationSeconds: 0,
  budgetMax: 999999, // Render as Unlimited (∞)
  latencyTargetMs: 100,
  slaTarget: 99.9,
  writeRatio: 0.20,
  initialNodes: [
    {
      id: 'node-sandbox-traffic',
      type: 'custom',
      position: { x: 80, y: 220 },
      data: {
        name: 'User Traffic',
        category: 'routing',
        cost: 0,
        capacityRps: 50000,
        addedLatencyMs: 0,
        icon: 'Users',
        status: 'healthy',
        currentRps: 1000,
        provider: 'freestyle',
      },
    },
  ],
  initialEdges: [],
  referenceNodes: [],
  referenceEdges: [],
};
