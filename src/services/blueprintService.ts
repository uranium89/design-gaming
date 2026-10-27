import { CustomNodeType } from '../state/graphStore';
import { Edge } from '@xyflow/react';
import { CloudProvider } from '../types';

export interface ArchitectureBlueprint {
  version: 1;
  timestamp: string;
  levelId: string;
  activeEmpire?: CloudProvider;
  nodes: CustomNodeType[];
  edges: Edge[];
}

export interface BlueprintValidationResult {
  success: boolean;
  blueprint?: ArchitectureBlueprint;
  error?: string;
}

const MAX_JSON_SIZE_BYTES = 250 * 1024; // 250 KB
const MAX_NODES_COUNT = 50;
const MAX_EDGES_COUNT = 100;

/**
 * Strips HTML tags and potential script content from strings.
 */
function sanitizeString(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
}

/**
 * Sanitizes and validates a single CustomNodeType object.
 */
function sanitizeNode(rawNode: unknown): CustomNodeType | null {
  if (typeof rawNode !== 'object' || rawNode === null) return null;
  const n = rawNode as Record<string, unknown>;

  const id = sanitizeString(n.id);
  if (!id) return null;

  const pos = n.position as Record<string, unknown> | undefined;
  const x = Number(pos?.x);
  const y = Number(pos?.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

  const data = (n.data || {}) as Record<string, unknown>;
  const name = sanitizeString(data.name);
  if (!name) return null;

  const cost = Number.isFinite(Number(data.cost)) ? Number(data.cost) : 0;
  const capacityRps = Number.isFinite(Number(data.capacityRps)) ? Number(data.capacityRps) : 1000;
  const addedLatencyMs = Number.isFinite(Number(data.addedLatencyMs)) ? Number(data.addedLatencyMs) : 10;

  const sanitizedNode: CustomNodeType = {
    id,
    type: 'custom',
    position: { x, y },
    data: {
      name,
      category: (sanitizeString(data.category) || 'compute') as CustomNodeType['data']['category'],
      cost,
      capacityRps,
      addedLatencyMs,
      icon: sanitizeString(data.icon) || 'Server',
      status: 'healthy',
      provider: data.provider ? (sanitizeString(data.provider) as CloudProvider) : undefined,
      config: typeof data.config === 'object' && data.config !== null ? (data.config as Record<string, unknown>) : undefined,
    },
  };

  return sanitizedNode;
}

/**
 * Sanitizes and validates an Edge object.
 */
function sanitizeEdge(rawEdge: unknown): Edge | null {
  if (typeof rawEdge !== 'object' || rawEdge === null) return null;
  const e = rawEdge as Record<string, unknown>;

  const id = sanitizeString(e.id);
  const source = sanitizeString(e.source);
  const target = sanitizeString(e.target);
  if (!id || !source || !target) return null;

  return {
    id,
    source,
    target,
    animated: Boolean(e.animated),
    type: sanitizeString(e.type) || 'packetEdge',
  };
}

/**
 * Serializes current canvas architecture into a formatted JSON string.
 */
export function exportBlueprintToJson(
  levelId: string,
  activeEmpire: CloudProvider | undefined,
  nodes: CustomNodeType[],
  edges: Edge[]
): string {
  const blueprint: ArchitectureBlueprint = {
    version: 1,
    timestamp: new Date().toISOString(),
    levelId,
    activeEmpire,
    nodes,
    edges,
  };
  return JSON.stringify(blueprint, null, 2);
}

/**
 * Downloads JSON content as a file in the browser.
 */
export function downloadBlueprintFile(
  jsonContent: string,
  filename = 'sysarchitect-blueprint.json'
): void {
  if (typeof window === 'undefined') return;

  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Parses, validates, and sanitizes a raw JSON blueprint string.
 */
export function parseAndValidateBlueprint(raw: string): BlueprintValidationResult {
  if (!raw || typeof raw !== 'string') {
    return { success: false, error: 'Dữ liệu bản vẽ trống hoặc không hợp lệ.' };
  }

  if (raw.length > MAX_JSON_SIZE_BYTES) {
    return { success: false, error: 'File bản vẽ quá lớn (vượt quá 250KB).' };
  }

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return { success: false, error: 'Cấu trúc bản vẽ phải là đối tượng JSON.' };
    }

    if (parsed.version !== 1) {
      return { success: false, error: 'Phiên bản bản vẽ không tương thích (chỉ hỗ trợ version 1).' };
    }

    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
      return { success: false, error: 'Bản vẽ phải chứa danh sách các nodes và edges.' };
    }

    if (parsed.nodes.length > MAX_NODES_COUNT) {
      return { success: false, error: `Số lượng node vượt quá giới hạn tối đa (${MAX_NODES_COUNT} nodes).` };
    }

    if (parsed.edges.length > MAX_EDGES_COUNT) {
      return { success: false, error: `Số lượng dây nối vượt quá giới hạn tối đa (${MAX_EDGES_COUNT} edges).` };
    }

    const sanitizedNodes: CustomNodeType[] = [];
    for (const rawNode of parsed.nodes) {
      const node = sanitizeNode(rawNode);
      if (node) {
        sanitizedNodes.push(node);
      }
    }

    const sanitizedEdges: Edge[] = [];
    for (const rawEdge of parsed.edges) {
      const edge = sanitizeEdge(rawEdge);
      if (edge) {
        sanitizedEdges.push(edge);
      }
    }

    const blueprint: ArchitectureBlueprint = {
      version: 1,
      timestamp: sanitizeString(parsed.timestamp) || new Date().toISOString(),
      levelId: sanitizeString(parsed.levelId) || 'sandbox',
      activeEmpire: (['freestyle', 'aws', 'azure', 'gcp'].includes(parsed.activeEmpire)
        ? parsed.activeEmpire
        : 'freestyle') as CloudProvider,
      nodes: sanitizedNodes,
      edges: sanitizedEdges,
    };

    return { success: true, blueprint };
  } catch (err) {
    return {
      success: false,
      error: `Lỗi định dạng JSON: ${err instanceof Error ? err.message : 'Dữ liệu hỏng'}`,
    };
  }
}

/**
 * Encodes a blueprint into a URL-safe Base64 string for link sharing.
 */
export function encodeBlueprintToHash(blueprint: ArchitectureBlueprint): string {
  try {
    const minified = JSON.stringify({
      v: blueprint.version,
      l: blueprint.levelId,
      e: blueprint.activeEmpire,
      n: blueprint.nodes.map((n) => ({
        i: n.id,
        t: n.type,
        x: Math.round(n.position.x),
        y: Math.round(n.position.y),
        d: {
          n: n.data.name,
          c: n.data.category,
          p: n.data.provider,
          $ : n.data.cost,
          r: n.data.capacityRps,
          l: n.data.addedLatencyMs,
          ic: n.data.icon,
          cfg: n.data.config,
        },
      })),
      g: blueprint.edges.map((e) => ({
        i: e.id,
        s: e.source,
        t: e.target,
        a: e.animated ? 1 : 0,
      })),
    });

    // Unicode safe base64 encoding
    const encoded = btoa(encodeURIComponent(minified));
    return `#blueprint=${encodeURIComponent(encoded)}`;
  } catch (err) {
    console.warn('Failed to encode blueprint to hash:', err);
    return '';
  }
}

/**
 * Decodes and restores a blueprint from a URL hash string.
 */
export function decodeBlueprintFromHash(hashString: string): BlueprintValidationResult {
  if (!hashString || !hashString.includes('#blueprint=')) {
    return { success: false, error: 'Hash không chứa dữ liệu bản vẽ.' };
  }

  try {
    const rawEncoded = hashString.split('#blueprint=')[1];
    if (!rawEncoded) {
      return { success: false, error: 'Chuỗi mã hóa bản vẽ trống.' };
    }

    const decodedBase64 = decodeURIComponent(rawEncoded);
    const jsonString = decodeURIComponent(atob(decodedBase64));
    const parsed = JSON.parse(jsonString);

    // If minified format
    if (parsed.v === 1 && Array.isArray(parsed.n) && Array.isArray(parsed.g)) {
      const nodes: CustomNodeType[] = (parsed.n as Array<Record<string, unknown>>).map((item) => {
        const d = (item.d || {}) as Record<string, unknown>;
        return {
          id: String(item.i),
          type: 'custom',
          position: { x: Number(item.x) || 0, y: Number(item.y) || 0 },
          data: {
            name: String(d.n || 'Node'),
            category: (d.c as CustomNodeType['data']['category']) || 'compute',
            cost: Number(d.$) || 0,
            capacityRps: Number(d.r) || 1000,
            addedLatencyMs: Number(d.l) || 10,
            icon: String(d.ic || 'Server'),
            status: 'healthy',
            provider: d.p as CloudProvider,
            config: d.cfg as Record<string, unknown>,
          },
        };
      });

      const edges: Edge[] = (parsed.g as Array<Record<string, unknown>>).map((item) => ({
        id: String(item.i),
        source: String(item.s),
        target: String(item.t),
        animated: Boolean(item.a),
        type: 'packetEdge',
      }));

      const blueprint: ArchitectureBlueprint = {
        version: 1,
        timestamp: new Date().toISOString(),
        levelId: String(parsed.l || 'sandbox'),
        activeEmpire: parsed.e as CloudProvider,
        nodes,
        edges,
      };

      return { success: true, blueprint };
    }

    // Otherwise standard format
    return parseAndValidateBlueprint(jsonString);
  } catch (err) {
    return {
      success: false,
      error: `Lỗi giải mã liên kết: ${err instanceof Error ? err.message : 'Định dạng không hợp lệ'}`,
    };
  }
}

export interface BlueprintSummary {
  levelId: string;
  activeEmpire?: CloudProvider;
  nodesCount: number;
  edgesCount: number;
  totalCost: number;
  componentBreakdown: { name: string; count: number }[];
}

/**
 * Computes summary metrics, component counts, and cost for blueprint preview.
 */
export function summarizeBlueprint(blueprint: ArchitectureBlueprint): BlueprintSummary {
  const componentCounts = new Map<string, number>();
  let totalCost = 0;

  for (const node of blueprint.nodes) {
    const name = node.data.name || 'Component';
    componentCounts.set(name, (componentCounts.get(name) || 0) + 1);
    totalCost += Number(node.data.cost) || 0;
  }

  const componentBreakdown = Array.from(componentCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    levelId: blueprint.levelId,
    activeEmpire: blueprint.activeEmpire,
    nodesCount: blueprint.nodes.length,
    edgesCount: blueprint.edges.length,
    totalCost,
    componentBreakdown,
  };
}

