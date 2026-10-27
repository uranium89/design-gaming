import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import {
  exportBlueprintToJson,
  parseAndValidateBlueprint,
  encodeBlueprintToHash,
  decodeBlueprintFromHash,
  ArchitectureBlueprint,
} from '../../src/services/blueprintService';
import { BlueprintModal } from '../../src/components/BlueprintModal/BlueprintModal';
import { CustomNodeType } from '../../src/state/graphStore';
import { Edge } from '@xyflow/react';

const mockNodes: CustomNodeType[] = [
  {
    id: 'user-1',
    type: 'custom',
    position: { x: 100, y: 150 },
    data: {
      name: 'User Traffic',
      category: 'routing',
      cost: 0,
      capacityRps: 5000,
      addedLatencyMs: 0,
      icon: 'Users',
      status: 'healthy',
      provider: 'freestyle',
    },
  },
  {
    id: 'app-1',
    type: 'custom',
    position: { x: 300, y: 150 },
    data: {
      name: 'App Server',
      category: 'compute',
      cost: 20,
      capacityRps: 1000,
      addedLatencyMs: 25,
      icon: 'Server',
      status: 'healthy',
      provider: 'freestyle',
    },
  },
];

const mockEdges: Edge[] = [
  {
    id: 'e1',
    source: 'user-1',
    target: 'app-1',
    animated: true,
    type: 'packetEdge',
  },
];

describe('S-018 Architecture Blueprint Export, Import & Share Unit Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Blueprint Service Serialization & Validation', () => {
    it('exports blueprint to valid JSON with version 1', () => {
      const json = exportBlueprintToJson('sandbox', 'aws', mockNodes, mockEdges);
      const parsed = JSON.parse(json);

      expect(parsed.version).toBe(1);
      expect(parsed.levelId).toBe('sandbox');
      expect(parsed.activeEmpire).toBe('aws');
      expect(parsed.nodes.length).toBe(2);
      expect(parsed.edges.length).toBe(1);
    });

    it('successfully validates and sanitizes a valid JSON blueprint', () => {
      const json = exportBlueprintToJson('sandbox', 'gcp', mockNodes, mockEdges);
      const result = parseAndValidateBlueprint(json);

      expect(result.success).toBe(true);
      expect(result.blueprint).toBeDefined();
      expect(result.blueprint?.nodes[0].data.name).toBe('User Traffic');
      expect(result.blueprint?.edges[0].target).toBe('app-1');
    });

    it('rejects invalid JSON string', () => {
      const result = parseAndValidateBlueprint('not-a-json@@@');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Lỗi định dạng JSON');
    });

    it('rejects incompatible version numbers', () => {
      const invalidVersionJson = JSON.stringify({
        version: 99,
        nodes: [],
        edges: [],
      });
      const result = parseAndValidateBlueprint(invalidVersionJson);
      expect(result.success).toBe(false);
      expect(result.error).toContain('chỉ hỗ trợ version 1');
    });

    it('sanitizes malicious script tags and strips HTML', () => {
      const xssNodes: CustomNodeType[] = [
        {
          id: 'node-<script>alert(1)</script>',
          type: 'custom',
          position: { x: 50, y: 50 },
          data: {
            name: 'Malicious Server<script>evil()</script>',
            category: 'compute',
            cost: 10,
            capacityRps: 1000,
            addedLatencyMs: 5,
            icon: 'Server',
            status: 'healthy',
          },
        },
      ];
      const json = exportBlueprintToJson('sandbox', 'freestyle', xssNodes, []);
      const result = parseAndValidateBlueprint(json);

      expect(result.success).toBe(true);
      expect(result.blueprint?.nodes[0].id).toBe('node-alert(1)');
      expect(result.blueprint?.nodes[0].data.name).toBe('Malicious Serverevil()');
      expect(result.blueprint?.nodes[0].data.name).not.toContain('<script>');
    });

    it('safely handles prototype pollution attempts', () => {
      const maliciousJson = `{"version": 1, "__proto__": {"polluted": true}, "nodes": [], "edges": []}`;
      const result = parseAndValidateBlueprint(maliciousJson);

      expect(result.success).toBe(true);
      expect((Object.prototype as unknown as { polluted?: boolean }).polluted).toBeUndefined();
    });
  });

  describe('URL Hash Encoding & Decoding', () => {
    it('encodes blueprint to URL-safe hash and decodes it back faithfully', () => {
      const blueprint: ArchitectureBlueprint = {
        version: 1,
        timestamp: new Date().toISOString(),
        levelId: 'level-01-bakery',
        activeEmpire: 'azure',
        nodes: mockNodes,
        edges: mockEdges,
      };

      const hash = encodeBlueprintToHash(blueprint);
      expect(hash.startsWith('#blueprint=')).toBe(true);

      const decodedResult = decodeBlueprintFromHash(hash);
      expect(decodedResult.success).toBe(true);
      expect(decodedResult.blueprint).toBeDefined();
      expect(decodedResult.blueprint?.levelId).toBe('level-01-bakery');
      expect(decodedResult.blueprint?.activeEmpire).toBe('azure');
      expect(decodedResult.blueprint?.nodes.length).toBe(2);
      expect(decodedResult.blueprint?.edges.length).toBe(1);
    });

    it('gracefully handles empty or corrupted hash string', () => {
      expect(decodeBlueprintFromHash('')).toEqual({
        success: false,
        error: 'Hash không chứa dữ liệu bản vẽ.',
      });

      expect(decodeBlueprintFromHash('#blueprint=invalid-base-64@@@').success).toBe(false);
    });
  });

  describe('BlueprintModal UI Component', () => {
    it('renders BlueprintModal with Share Link, Export, and Import cards', () => {
      render(
        <BlueprintModal
          isOpen={true}
          onClose={vi.fn()}
          levelId="sandbox"
          activeEmpire="aws"
          nodes={mockNodes}
          edges={mockEdges}
          onImportBlueprint={vi.fn()}
        />
      );

      expect(screen.getByText('Bản Vẽ Kiến Trúc (Blueprint & Share)')).toBeInTheDocument();
      expect(screen.getByText('Sao chép Liên kết Chia sẻ')).toBeInTheDocument();
      expect(screen.getByText('Xuất Bản vẽ (Export JSON)')).toBeInTheDocument();
      expect(screen.getByText('Nhập Bản vẽ (Import JSON)')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sao chép liên kết/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Tải xuống JSON/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Chọn file JSON để nạp/i })).toBeInTheDocument();
    });

    it('copies share link and shows feedback', async () => {
      // Mock clipboard writeText
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });

      render(
        <BlueprintModal
          isOpen={true}
          onClose={vi.fn()}
          levelId="sandbox"
          activeEmpire="aws"
          nodes={mockNodes}
          edges={mockEdges}
          onImportBlueprint={vi.fn()}
        />
      );

      const copyBtn = screen.getByRole('button', { name: /Sao chép liên kết/i });
      fireEvent.click(copyBtn);

      await waitFor(() => {
        expect(writeTextMock).toHaveBeenCalled();
        expect(screen.getByText(/Đã chép!/i)).toBeInTheDocument();
      });
    });

    it('does not render when isOpen is false', () => {
      const { container } = render(
        <BlueprintModal
          isOpen={false}
          onClose={vi.fn()}
          levelId="sandbox"
          nodes={mockNodes}
          edges={mockEdges}
          onImportBlueprint={vi.fn()}
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });
});
