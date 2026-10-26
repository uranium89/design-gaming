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
    'Tiệm bánh ngọt gia đình vừa ra mắt website để khách xem menu và đặt bánh online. Bạn cần xây dựng kiến trúc đơn giản, tiết kiệm chi phí dưới $35/tháng nhưng vẫn giữ độ trễ mượt mà và không sập khi có lượng truy cập đột biến lúc tiệm bánh lên báo!',
  targetUsers: '5,000 DAU / 50 Concurrent Users',
  baseRps: 50,
  spikeRps: 120,
  spikeDurationSeconds: 15,
  budgetMax: 35,
  latencyTargetMs: 200,
  slaTarget: 99.0,

  // Kiến trúc Monolith tối ưu ngân sách $35: 1 VM gộp (Cost: $20/m, Cap: 500 RPS)
  referenceNodes: [
    {
      id: 'ref-client-1',
      type: 'custom',
      position: { x: 100, y: 160 },
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
      position: { x: 450, y: 160 },
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
  ],
  referenceEdges: [
    {
      id: 'ref-e1-2',
      source: 'ref-client-1',
      target: 'ref-server-1',
      type: 'particle',
    },
  ],
};
