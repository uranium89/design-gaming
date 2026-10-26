import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Users, Network, Cpu, Database, Mail } from 'lucide-react';
import styles from './CustomNode.module.css';
import { CustomNodeType } from '../../state/graphStore';

export const CustomNode: React.FC<NodeProps<CustomNodeType>> = ({
  data,
  selected,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users': return <Users size={16} className={styles.nodeIcon} />;
      case 'Network': return <Network size={16} className={styles.nodeIcon} />;
      case 'Cpu': return <Cpu size={16} className={styles.nodeIcon} />;
      case 'Database': return <Database size={16} className={styles.nodeIcon} />;
      case 'Mail': return <Mail size={16} className={styles.nodeIcon} />;
      default: return <Cpu size={16} className={styles.nodeIcon} />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'healthy': return styles.statusHealthy;
      case 'warning': return styles.statusWarning;
      case 'overloaded': return styles.statusOverloaded;
      case 'crashed': return styles.statusCrashed;
      default: return styles.statusHealthy;
    }
  };

  const isUserTraffic = data.category === 'routing' && data.name === 'User Traffic';

  return (
    <div className={`${styles.nodeCard} ${selected ? styles.selected : ''}`}>
      {/* Target handle: nhận request từ upstream (trừ User Traffic) */}
      {!isUserTraffic && (
        <Handle
          type="target"
          position={Position.Left}
          className={styles.handleTarget}
        />
      )}

      <div className={styles.nodeHeader}>
        <div className={styles.headerLeft}>
          {getIcon(data.icon)}
          <span className={styles.nodeName} title={data.name}>
            {data.name}
          </span>
        </div>
        <div className={`${styles.statusDot} ${getStatusClass(data.status)}`} />
      </div>

      <div className={styles.nodeBody}>
        <div className={styles.metricRow}>
          <span>Cap: {data.capacityRps?.toLocaleString()} RPS</span>
          <span className={styles.metricCost}>${data.cost}/m</span>
        </div>
        <div className={styles.metricRow}>
          <span>+Lat: {data.addedLatencyMs}ms</span>
          <span style={{ color: '#c7d2fe' }}>
            {data.currentRps ? `${data.currentRps} RPS` : 'Idle'}
          </span>
        </div>
      </div>

      {/* Source handle: gửi request downstream */}
      <Handle
        type="source"
        position={Position.Right}
        className={styles.handleSource}
      />
    </div>
  );
};
