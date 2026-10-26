import React from 'react';
import { Network, Cpu, Database, Mail, Users } from 'lucide-react';
import styles from './SidebarDock.module.css';
import { ComponentItem } from '../../types';

const INITIAL_COMPONENTS: ComponentItem[] = [
  {
    id: 'user-client',
    name: 'User Traffic',
    category: 'routing',
    cost: 0,
    capacityRps: 10000,
    addedLatencyMs: 0,
    icon: 'Users',
    description: 'Nguồn phát sinh request của người dùng',
  },
  {
    id: 'load-balancer',
    name: 'Load Balancer',
    category: 'routing',
    cost: 25,
    capacityRps: 15000,
    addedLatencyMs: 4,
    icon: 'Network',
    description: 'Phân phối tải L7 Least-Connections',
  },
  {
    id: 'app-server',
    name: 'App Server (VM)',
    category: 'compute',
    cost: 20,
    capacityRps: 500,
    addedLatencyMs: 25,
    icon: 'Cpu',
    description: 'Máy chủ xử lý nghiệp vụ ứng dụng',
  },
  {
    id: 'db-postgres',
    name: 'PostgreSQL DB',
    category: 'storage',
    cost: 40,
    capacityRps: 600,
    addedLatencyMs: 15,
    icon: 'Database',
    description: 'Cơ sở dữ liệu quan hệ ACID Master',
  },
  {
    id: 'msg-queue',
    name: 'Message Queue',
    category: 'messaging',
    cost: 15,
    capacityRps: 8000,
    addedLatencyMs: 5,
    icon: 'Mail',
    description: 'Hàng đợi đệm bất đồng bộ',
  },
];

export const SidebarDock: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users': return <Users size={18} className={styles.itemIcon} />;
      case 'Network': return <Network size={18} className={styles.itemIcon} />;
      case 'Cpu': return <Cpu size={18} className={styles.itemIcon} />;
      case 'Database': return <Database size={18} className={styles.itemIcon} />;
      case 'Mail': return <Mail size={18} className={styles.itemIcon} />;
      default: return <Cpu size={18} className={styles.itemIcon} />;
    }
  };

  const categories = [
    { key: 'routing', label: 'Routing & Traffic' },
    { key: 'compute', label: 'Compute & App' },
    { key: 'storage', label: 'Storage & Database' },
    { key: 'messaging', label: 'Messaging & Queue' },
  ];

  return (
    <aside className={styles.sidebarDock}>
      <div className={styles.dockHeader}>
        <div className={styles.dockTitle}>Infrastructure Toolbox</div>
        <div className={styles.dockSubtitle}>Kéo linh kiện ra bảng vẽ</div>
      </div>

      <div className={styles.categoryList}>
        {categories.map((cat) => {
          const items = INITIAL_COMPONENTS.filter((c) => c.category === cat.key);
          if (items.length === 0) return null;
          return (
            <div key={cat.key} className={styles.categoryGroup}>
              <div className={styles.categoryTitle}>{cat.label}</div>
              <div className={styles.itemList}>
                {items.map((item) => (
                  <div key={item.id} className={styles.itemCard} title={item.description}>
                    <div className={styles.itemLeft}>
                      {getIcon(item.icon)}
                      <div>
                        <div className={styles.itemName}>{item.name}</div>
                        <div className={styles.itemSub}>{item.capacityRps} RPS</div>
                      </div>
                    </div>
                    <div className={styles.itemCost}>${item.cost}/m</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
