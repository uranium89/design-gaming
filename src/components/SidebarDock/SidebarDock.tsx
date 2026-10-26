import React from 'react';
import { Network, Cpu, Database, Mail, Users, Layers } from 'lucide-react';
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
    id: 'worker-pool',
    name: 'Worker Pool (Async Consumer)',
    category: 'compute',
    cost: 30,
    capacityRps: 2000,
    addedLatencyMs: 15,
    icon: 'Cpu',
    description: 'Tiến trình nền kéo tác vụ từ Message Queue để ghi dữ liệu ổn định xuống Database (Traffic Leveling)',
  },
  {
    id: 'db-sqlite',
    name: 'SQLite / Micro DB',
    category: 'storage',
    cost: 10,
    capacityRps: 150,
    addedLatencyMs: 8,
    icon: 'Database',
    description: 'Cơ sở dữ liệu nhúng siêu tiết kiệm, $10/tháng, phù hợp dự án nhỏ dưới 150 RPS',
  },
  {
    id: 'db-postgres',
    name: 'PostgreSQL DB',
    category: 'storage',
    cost: 40,
    capacityRps: 2000,
    addedLatencyMs: 15,
    icon: 'Database',
    description: 'Cơ sở dữ liệu quan hệ ACID Master, sức chứa 2,000 RPS',
  },
  {
    id: 'cache-redis',
    name: 'Redis Cache',
    category: 'storage',
    cost: 25,
    capacityRps: 20000,
    addedLatencyMs: 1,
    icon: 'Database',
    description: 'Bộ nhớ đệm In-Memory 1ms, hấp thụ 90% lưu lượng đọc, bảo vệ Database',
  },
  {
    id: 'db-replica',
    name: 'Database Read Replica',
    category: 'storage',
    cost: 25,
    capacityRps: 1500,
    addedLatencyMs: 10,
    icon: 'Database',
    description: 'Bản sao cơ sở dữ liệu chỉ đọc, đồng bộ từ Master, mở rộng khả năng đọc',
  },
  {
    id: 'msg-queue',
    name: 'Message Queue (RabbitMQ)',
    category: 'messaging',
    cost: 40,
    capacityRps: 30000,
    addedLatencyMs: 5,
    icon: 'Layers',
    description: 'Hàng đợi thông điệp bất đồng bộ (FIFO), đệm lưu lượng tức thời, chống sập hệ thống và đảm bảo Zero Data Loss',
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
      case 'Layers': return <Layers size={18} className={styles.itemIcon} />;
      default: return <Cpu size={18} className={styles.itemIcon} />;
    }
  };

  const categories = [
    { key: 'routing', label: 'Routing & Traffic' },
    { key: 'compute', label: 'Compute & App' },
    { key: 'storage', label: 'Storage & Database' },
    { key: 'messaging', label: 'Messaging & Queue' },
  ];

  const onDragStart = (event: React.DragEvent, item: ComponentItem) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(item));
    event.dataTransfer.effectAllowed = 'move';
  };

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
                  <div
                    key={item.id}
                    className={styles.itemCard}
                    title={item.description}
                    draggable
                    onDragStart={(e) => onDragStart(e, item)}
                  >
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
