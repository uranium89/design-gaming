import type { LevelDefinition } from './level01';

export const LEVEL_02: LevelDefinition = {
  id: 'level-02-tech-news',
  title: 'Trang Tin Công Nghệ Nóng (Breaking Tech News)',
  badge: 'Level 2: Tech News',
  description:
    'Trang tin công nghệ vừa đăng tin độc quyền gây bão mạng. Lưu lượng đọc tăng vọt lên 300 RPS và có thể đạt đỉnh 2,500 RPS khi cao điểm (99% Read, 1% Write). Bạn cần lắp đặt bộ nhớ đệm Redis Cache để hấp thụ 90% tải đọc, bảo vệ Database không bị quá tải và giữ P95 < 80ms trong ngân sách $100/tháng!',
  targetUsers: '200,000 DAU / 2,500 Peak Concurrent',
  baseRps: 300,
  spikeRps: 2500,
  spikeDurationSeconds: 15,
  budgetMax: 100,
  latencyTargetMs: 80,
  slaTarget: 99.5,
  writeRatio: 0.01,

  // Bảng vẽ khởi đầu: Chỉ có User Traffic ($0)
  initialNodes: [
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
        currentRps: 300,
      },
    },
  ],
  initialEdges: [],

  // Kiến trúc mẫu 3★ tối ưu ngân sách $100: App Server Medium ($45) + Redis Cache ($25) + Micro DB ($10) = $80/m (<= $100)
  referenceNodes: [
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
        currentRps: 300,
      },
    },
    {
      id: 'ref-server-1',
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
        currentRps: 300,
        tier: 'medium',
      },
    },
    {
      id: 'ref-cache-1',
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
        currentRps: 300,
      },
    },
    {
      id: 'ref-db-1',
      type: 'custom',
      position: { x: 960, y: 180 },
      data: {
        name: 'SQLite / Micro DB',
        category: 'storage',
        cost: 10,
        capacityRps: 150,
        addedLatencyMs: 8,
        icon: 'Database',
        status: 'healthy',
        currentRps: 30, // Chỉ 10% miss tới DB
      },
    },
  ],
  referenceEdges: [
    {
      id: 'ref-e1-2',
      source: 'user-client-1',
      target: 'ref-server-1',
      type: 'particle',
    },
    {
      id: 'ref-e2-3',
      source: 'ref-server-1',
      target: 'ref-cache-1',
      type: 'particle',
    },
    {
      id: 'ref-e3-4',
      source: 'ref-cache-1',
      target: 'ref-db-1',
      type: 'particle',
    },
  ],
};
