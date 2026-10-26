import React from 'react';
import { X, Trash2 } from 'lucide-react';
import styles from './Inspector.module.css';
import { useGraphStore } from '../../state/graphStore';

export const Inspector: React.FC = () => {
  const selectedNodeId = useGraphStore((state) => state.selectedNodeId);
  const nodes = useGraphStore((state) => state.nodes);
  const selectNode = useGraphStore((state) => state.selectNode);
  const removeNode = useGraphStore((state) => state.removeNode);
  const updateNodeData = useGraphStore((state) => state.updateNodeData);

  if (!selectedNodeId) return null;

  const node = nodes.find((n) => n.id === selectedNodeId);
  if (!node) return null;

  const isUserTraffic = node.data.name === 'User Traffic';

  return (
    <aside className={styles.inspectorPanel} aria-label="Component Inspector">
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>{node.data.name}</span>
        <button
          className={styles.closeBtn}
          onClick={() => selectNode(null)}
          aria-label="Close Inspector"
        >
          <X size={16} />
        </button>
      </div>

      <div className={styles.infoRow}>
        <span>Danh mục:</span>
        <span className={styles.infoValue} style={{ textTransform: 'capitalize' }}>
          {node.data.category}
        </span>
      </div>

      <div className={styles.infoRow}>
        <span>Chi phí vận hành:</span>
        <span className={styles.infoValue} style={{ color: 'var(--color-warning)' }}>
          ${node.data.cost} /tháng
        </span>
      </div>

      <div className={styles.infoRow}>
        <span>Độ trễ xử lý:</span>
        <span className={styles.infoValue}>+{node.data.addedLatencyMs} ms</span>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel} htmlFor="capacityInput">
          Công suất tối đa (RPS):
        </label>
        <input
          id="capacityInput"
          type="number"
          className={styles.fieldInput}
          value={node.data.capacityRps}
          min={50}
          step={50}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val) && val > 0) {
              updateNodeData(node.id, { capacityRps: val });
            }
          }}
        />
      </div>

      {!isUserTraffic && (
        <button
          className={styles.dangerBtn}
          onClick={() => removeNode(node.id)}
          aria-label="Remove Component"
        >
          <Trash2 size={15} /> Xóa linh kiện này
        </button>
      )}
    </aside>
  );
};
