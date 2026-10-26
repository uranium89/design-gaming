import { CustomNodeType } from '../state/graphStore';
import { Edge } from '@xyflow/react';

export interface LevelDefinition {
  id: string;
  title: string;
  badge: string;
  description: string;
  targetUsers: string;
  baseRps: number;
  spikeRps: number;
  spikeDurationSeconds: number;
  budgetMax: number;
  latencyTargetMs: number;
  slaTarget: number;
  referenceNodes: CustomNodeType[];
  referenceEdges: Edge[];
}

export const LEVEL_01: LevelDefinition = {
  id: 'level-01-bakery',
  title: 'Tiệm Bánh Ngọt Gia Đình (The Local Bakery)',
  badge: 'Level 1: The Bakery',
  description:
    'Tiệm bánh ngọt gia đình vừa ra mắt website để khách xem menu và đặt bánh online (lưu đơn vào Database). Bạn cần dựng kiến trúc gồm máy chủ xử lý và cơ sở dữ liệu nhỏ gọn tiết kiệm chi phí dưới $35/tháng nhưng vẫn giữ độ trễ mượt mà và không sập khi có lượng truy cập đột biến lúc tiệm bánh lên báo!',
  targetUsers: '5,000 DAU / 50 Concurrent Users',
  baseRps: 50,
  spikeRps: 120,
  spikeDurationSeconds: 15,
  budgetMax: 35,
  latencyTargetMs: 200,
  slaTarget: 99.0,

  // Kiến trúc 2 tầng tối ưu ngân sách $35: 1 VM ($20) + 1 Micro DB ($10) = $30/tháng (<= $35)
  referenceNodes: [
    {
      id: 'ref-client-1',
      type: 'custom',
      position: { x: 80, y: 160 },
      data: {
        name: 'User Traffic',
        category: 'routing',
        cost: 0,
        capacityRps: 10000,
        addedLatencyMs: 0,
        icon: 'Users',
        status: 'healthy',
        currentRps: 50,
      },
    },
    {
      id: 'ref-server-1',
      type: 'custom',
      position: { x: 400, y: 160 },
      data: {
        name: 'App Server (VM)',
        category: 'compute',
        cost: 20,
        capacityRps: 500,
        addedLatencyMs: 25,
        icon: 'Cpu',
        status: 'healthy',
        currentRps: 50,
      },
    },
    {
      id: 'ref-db-1',
      type: 'custom',
      position: { x: 720, y: 160 },
      data: {
        name: 'SQLite / Micro DB',
        category: 'storage',
        cost: 10,
        capacityRps: 150,
        addedLatencyMs: 8,
        icon: 'Database',
        status: 'healthy',
        currentRps: 50,
      },
    },
  ],
  referenceEdges: [
    {
      id: 'ref-e1-2',
      source: 'ref-client-1',
      target: 'ref-server-1',
      type: 'particle',
    },
    {
      id: 'ref-e2-3',
      source: 'ref-server-1',
      target: 'ref-db-1',
      type: 'particle',
    },
  ],
};
