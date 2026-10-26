import React from 'react';
import { X, Trash2, Cpu, Database, Network, Mail, Users, Gauge } from 'lucide-react';
import styles from './Inspector.module.css';
import { useGraphStore } from '../../state/graphStore';

const COMPUTE_TIERS = [
  { id: 'small', name: 'Small', vcpu: '2C/4GB', cost: 20, capacityRps: 500, latency: 25 },
  { id: 'medium', name: 'Medium', vcpu: '4C/8GB', cost: 45, capacityRps: 3000, latency: 20 },
  { id: 'large', name: 'Large', vcpu: '8C/16GB', cost: 90, capacityRps: 6000, latency: 15 },
] as const;

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
  const isCompute = node.data.category === 'compute';
  const isLoadBalancer = node.data.name.toLowerCase().includes('load balancer') || node.data.category === 'routing';

  const currentRps = node.data.currentRps || 0;
  const capacityRps = node.data.capacityRps || 100;
  const utilizationRatio = capacityRps > 0 ? currentRps / capacityRps : 0;
  const utilizationPercent = Math.min(100, Math.round(utilizationRatio * 100));

  const getStatusBadge = () => {
    switch (node.data.status) {
      case 'warning':
        return <span className={`${styles.statusBadge} ${styles.statusWarning}`}>Cảnh báo tải</span>;
      case 'overloaded':
      case 'crashed':
        return <span className={`${styles.statusBadge} ${styles.statusOverloaded}`}>Quá tải / Sập</span>;
      default:
        return <span className={`${styles.statusBadge} ${styles.statusHealthy}`}>Hoạt động tốt</span>;
    }
  };

  const getNodeIcon = () => {
    switch (node.data.icon) {
      case 'Users': return <Users size={18} className={styles.nodeIcon} />;
      case 'Network': return <Network size={18} className={styles.nodeIcon} />;
      case 'Cpu': return <Cpu size={18} className={styles.nodeIcon} />;
      case 'Database': return <Database size={18} className={styles.nodeIcon} />;
      case 'Mail': return <Mail size={18} className={styles.nodeIcon} />;
      default: return <Cpu size={18} className={styles.nodeIcon} />;
    }
  };

  const getFillClass = () => {
    if (utilizationRatio < 0.7) return styles.barFillHealthy;
    if (utilizationRatio < 1.0) return styles.barFillWarning;
    return styles.barFillOverloaded;
  };

  const currentTier = node.data.tier || (node.data.cost === 90 ? 'large' : node.data.cost === 45 ? 'medium' : 'small');

  return (
    <aside className={styles.inspectorPanel} aria-label="Component Inspector">
      <div className={styles.panelHeader}>
        <div className={styles.titleGroup}>
          {getNodeIcon()}
          <span className={styles.panelTitle}>{node.data.name}</span>
        </div>
        <button
          className={styles.closeBtn}
          onClick={() => selectNode(null)}
          aria-label="Close Inspector"
          title="Đóng Inspector"
        >
          <X size={16} />
        </button>
      </div>

      <div className={styles.infoRow}>
        <span>Trạng thái:</span>
        {getStatusBadge()}
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

      {/* Realtime Utilization Meter */}
      <div className={styles.utilizationBox}>
        <div className={styles.utilizationHeader}>
          <span className={styles.utilizationLabel}>
            <Gauge size={12} style={{ display: 'inline', marginRight: 4 }} />
            Tải thời gian thực
          </span>
          <span className={styles.utilizationValue}>
            {currentRps} / {capacityRps} RPS ({utilizationPercent}%)
          </span>
        </div>
        <div className={styles.barTrack}>
          <div
            className={getFillClass()}
            style={{ width: `${Math.min(100, (currentRps / capacityRps) * 100)}%` }}
          />
        </div>
      </div>

      {/* Compute Instance Tier Switcher */}
      {isCompute && (
        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>Quy mô cấu hình (Instance Tier):</span>
          <div className={styles.tierGrid}>
            {COMPUTE_TIERS.map((tier) => (
              <button
                key={tier.id}
                className={`${styles.tierBtn} ${currentTier === tier.id ? styles.tierBtnActive : ''}`}
                onClick={() => {
                  updateNodeData(node.id, {
                    tier: tier.id,
                    cost: tier.cost,
                    capacityRps: tier.capacityRps,
                    addedLatencyMs: tier.latency,
                  });
                }}
                title={`${tier.vcpu} | ${tier.capacityRps} RPS`}
              >
                <span className={styles.tierName}>{tier.name}</span>
                <span className={styles.tierCost}>${tier.cost}/m</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Routing Algorithm Selector for Load Balancer */}
      {isLoadBalancer && !isUserTraffic && (
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="algorithmSelect">
            Thuật toán điều phối tải:
          </label>
          <select
            id="algorithmSelect"
            className={styles.selectInput}
            value={node.data.algorithm || 'least-connections'}
            onChange={(e) => {
              updateNodeData(node.id, {
                algorithm: e.target.value as 'round-robin' | 'least-connections' | 'ip-hash',
              });
            }}
          >
            <option value="least-connections">Least Connections</option>
            <option value="round-robin">Round Robin</option>
            <option value="ip-hash">IP Hash (Session Affinity)</option>
          </select>
        </div>
      )}

      {/* Custom Capacity Setting */}
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

      {/* Chaos Simulation (Fault Injection) */}
      {!isUserTraffic && (
        <div className={styles.chaosSection}>
          <div className={styles.chaosTitle}>Mô phỏng sự cố (Chaos Engineering)</div>
          <button
            className={node.data.status === 'crashed' ? styles.recoverBtn : styles.crashBtn}
            onClick={() => {
              const nextStatus = node.data.status === 'crashed' ? 'healthy' : 'crashed';
              updateNodeData(node.id, { status: nextStatus });
            }}
            aria-label={node.data.status === 'crashed' ? 'Khởi động lại node' : 'Đánh sập node'}
          >
            {node.data.status === 'crashed' ? (
              <>🔄 Khởi động lại (Recover Server)</>
            ) : (
              <>🚨 Đánh sập node (Simulate Crash)</>
            )}
          </button>
        </div>
      )}

      {!isUserTraffic && (
        <button
          className={styles.dangerBtn}
          onClick={() => removeNode(node.id)}
          aria-label="Remove Component"
          title="Xóa linh kiện này khỏi kiến trúc"
        >
          <Trash2 size={15} /> Xóa linh kiện này
        </button>
      )}
    </aside>
  );
};
