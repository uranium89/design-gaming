import React, { useState } from 'react';
import { Network, Cpu, Database, Mail, Users, Layers } from 'lucide-react';
import styles from './SidebarDock.module.css';
import { ComponentItem, CloudProvider } from '../../types';

export const EMPIRES: { id: CloudProvider; name: string; tag: string; color: string; desc: string }[] = [
  { id: 'freestyle', name: 'Freestyle', tag: 'FOSS', color: '#10b981', desc: 'Open-Source & Self-Hosted' },
  { id: 'aws', name: 'AWS', tag: 'AWS', color: '#ff9900', desc: 'Amazon Web Services' },
  { id: 'azure', name: 'Azure', tag: 'AZURE', color: '#0078d4', desc: 'Microsoft Azure Cloud' },
  { id: 'gcp', name: 'GCP', tag: 'GCP', color: '#4285f4', desc: 'Google Cloud Platform' },
];

export const EMPIRE_COMPONENTS: Record<CloudProvider, ComponentItem[]> = {
  freestyle: [
    {
      id: 'user-client',
      name: 'User Traffic',
      category: 'routing',
      cost: 0,
      capacityRps: 10000,
      addedLatencyMs: 0,
      icon: 'Users',
      description: 'Nguồn phát sinh request của người dùng',
      provider: 'freestyle',
    },
    {
      id: 'load-balancer',
      name: 'Load Balancer (Nginx)',
      category: 'routing',
      cost: 25,
      capacityRps: 15000,
      addedLatencyMs: 4,
      icon: 'Network',
      description: 'Phân phối tải L7 Least-Connections',
      provider: 'freestyle',
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
      provider: 'freestyle',
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
      provider: 'freestyle',
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
      provider: 'freestyle',
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
      provider: 'freestyle',
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
      provider: 'freestyle',
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
      provider: 'freestyle',
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
      provider: 'freestyle',
    },
  ],
  aws: [
    {
      id: 'user-client-aws',
      name: 'User Traffic',
      category: 'routing',
      cost: 0,
      capacityRps: 20000,
      addedLatencyMs: 0,
      icon: 'Users',
      description: 'Nguồn phát sinh lưu lượng từ internet tới AWS VPC',
      provider: 'aws',
    },
    {
      id: 'aws-alb',
      name: 'AWS Application Load Balancer',
      category: 'routing',
      cost: 25,
      capacityRps: 15000,
      addedLatencyMs: 4,
      icon: 'Network',
      description: 'Managed ALB tự động cân bằng tải HTTP/HTTPS L7 với độ sẵn sàng cao',
      provider: 'aws',
    },
    {
      id: 'aws-ec2',
      name: 'AWS EC2 (t4g.large)',
      category: 'compute',
      cost: 48,
      capacityRps: 1200,
      addedLatencyMs: 18,
      icon: 'Cpu',
      description: 'Máy chủ ảo thế hệ Graviton hiệu năng cao, Auto-scaling group',
      provider: 'aws',
    },
    {
      id: 'aws-lambda-worker',
      name: 'AWS Lambda / Worker',
      category: 'compute',
      cost: 35,
      capacityRps: 3000,
      addedLatencyMs: 15,
      icon: 'Cpu',
      description: 'Serverless compute xử lý song song các sự kiện từ SQS',
      provider: 'aws',
    },
    {
      id: 'aws-elasticache',
      name: 'AWS ElastiCache (Redis)',
      category: 'storage',
      cost: 85,
      capacityRps: 45000,
      addedLatencyMs: 1.5,
      icon: 'Database',
      description: 'Cụm Redis Cluster Multi-AZ tự failover, chịu tải cực lớn 45,000 RPS',
      provider: 'aws',
    },
    {
      id: 'aws-rds-aurora',
      name: 'Amazon Aurora / RDS PG',
      category: 'storage',
      cost: 120,
      capacityRps: 6000,
      addedLatencyMs: 8,
      icon: 'Database',
      description: 'Cơ sở dữ liệu đám mây phân tán tự động nhân bản 6 bản copy qua 3 AZ',
      provider: 'aws',
    },
    {
      id: 'aws-dynamodb',
      name: 'AWS DynamoDB (NoSQL)',
      category: 'storage',
      cost: 30,
      capacityRps: 10000,
      addedLatencyMs: 4,
      icon: 'Database',
      description: 'NoSQL Key-Value siêu tốc single-digit latency, tự mở rộng theo tải',
      provider: 'aws',
    },
    {
      id: 'aws-sqs',
      name: 'AWS SQS (Standard/FIFO)',
      category: 'messaging',
      cost: 5,
      capacityRps: 40000,
      addedLatencyMs: 15,
      icon: 'Layers',
      description: 'Managed Message Queue hầu như vô hạn, đệm an toàn hàng chục nghìn msg/s',
      provider: 'aws',
    },
  ],
  azure: [
    {
      id: 'user-client-azure',
      name: 'User Traffic',
      category: 'routing',
      cost: 0,
      capacityRps: 20000,
      addedLatencyMs: 0,
      icon: 'Users',
      description: 'Lưu lượng người dùng truy cập vào Azure Virtual Network',
      provider: 'azure',
    },
    {
      id: 'azure-app-gateway',
      name: 'Azure Application Gateway',
      category: 'routing',
      cost: 35,
      capacityRps: 12000,
      addedLatencyMs: 5,
      icon: 'Network',
      description: 'L7 Load Balancer tích hợp WAF bảo vệ và cân bằng tải thông minh',
      provider: 'azure',
    },
    {
      id: 'azure-vm',
      name: 'Azure VM (B2ms)',
      category: 'compute',
      cost: 45,
      capacityRps: 1000,
      addedLatencyMs: 20,
      icon: 'Cpu',
      description: 'Máy chủ ảo Azure burstable CPU cho ứng dụng doanh nghiệp',
      provider: 'azure',
    },
    {
      id: 'azure-container-worker',
      name: 'Azure Container App Worker',
      category: 'compute',
      cost: 35,
      capacityRps: 2500,
      addedLatencyMs: 15,
      icon: 'Cpu',
      description: 'Serverless microservice container tiêu thụ thông điệp từ Service Bus',
      provider: 'azure',
    },
    {
      id: 'azure-redis',
      name: 'Azure Cache for Redis',
      category: 'storage',
      cost: 60,
      capacityRps: 30000,
      addedLatencyMs: 2,
      icon: 'Database',
      description: 'Bộ nhớ đệm Redis quản trị hoàn toàn bởi Microsoft Azure',
      provider: 'azure',
    },
    {
      id: 'azure-postgres',
      name: 'Azure Database for PostgreSQL',
      category: 'storage',
      cost: 90,
      capacityRps: 5000,
      addedLatencyMs: 10,
      icon: 'Database',
      description: 'Cơ sở dữ liệu PostgreSQL linh hoạt (Flexible Server) độ sẵn sàng 99.99%',
      provider: 'azure',
    },
    {
      id: 'azure-cosmos',
      name: 'Azure Cosmos DB',
      category: 'storage',
      cost: 60,
      capacityRps: 8000,
      addedLatencyMs: 3,
      icon: 'Database',
      description: 'NoSQL phân tán toàn cầu (Multi-master write) tốc độ mili-giây',
      provider: 'azure',
    },
    {
      id: 'azure-service-bus',
      name: 'Azure Service Bus',
      category: 'messaging',
      cost: 20,
      capacityRps: 20000,
      addedLatencyMs: 10,
      icon: 'Layers',
      description: 'Enterprise Message Broker với độ tin cậy tuyệt đối và transaction support',
      provider: 'azure',
    },
  ],
  gcp: [
    {
      id: 'user-client-gcp',
      name: 'User Traffic',
      category: 'routing',
      cost: 0,
      capacityRps: 25000,
      addedLatencyMs: 0,
      icon: 'Users',
      description: 'Lưu lượng đi vào qua hạ tầng mạng cáp quang toàn cầu của Google',
      provider: 'gcp',
    },
    {
      id: 'gcp-cloud-lb',
      name: 'GCP Cloud Load Balancer',
      category: 'routing',
      cost: 22,
      capacityRps: 25000,
      addedLatencyMs: 2,
      icon: 'Network',
      description: 'Single Anycast IP Global Load Balancer phân phối tải siêu nhanh',
      provider: 'gcp',
    },
    {
      id: 'gcp-cloud-run',
      name: 'GCP Cloud Run / Compute',
      category: 'compute',
      cost: 40,
      capacityRps: 3000,
      addedLatencyMs: 15,
      icon: 'Cpu',
      description: 'Nền tảng container serverless auto-scale cực nhanh chỉ trong 10-20 giây',
      provider: 'gcp',
    },
    {
      id: 'gcp-functions-worker',
      name: 'GCP Cloud Functions Worker',
      category: 'compute',
      cost: 30,
      capacityRps: 2500,
      addedLatencyMs: 15,
      icon: 'Cpu',
      description: 'Event-driven serverless function kích hoạt tự động bởi Cloud Pub/Sub',
      provider: 'gcp',
    },
    {
      id: 'gcp-memorystore',
      name: 'GCP Cloud Memorystore',
      category: 'storage',
      cost: 50,
      capacityRps: 35000,
      addedLatencyMs: 2,
      icon: 'Database',
      description: 'Dịch vụ Redis & Memcached được Google tối ưu trên mạng nội bộ sub-millisecond',
      provider: 'gcp',
    },
    {
      id: 'gcp-cloud-sql',
      name: 'GCP Cloud SQL (PostgreSQL)',
      category: 'storage',
      cost: 80,
      capacityRps: 5000,
      addedLatencyMs: 10,
      icon: 'Database',
      description: 'RDBMS PostgreSQL quản trị hoàn toàn với tính năng tự động sao lưu và HA',
      provider: 'gcp',
    },
    {
      id: 'gcp-cloud-spanner',
      name: 'GCP Cloud Spanner',
      category: 'storage',
      cost: 200,
      capacityRps: 15000,
      addedLatencyMs: 6,
      icon: 'Database',
      description: 'Vũ khí tối thượng: RDBMS phân tán toàn cầu hỗ trợ chuẩn ACID vô hạn',
      provider: 'gcp',
    },
    {
      id: 'gcp-pubsub',
      name: 'GCP Cloud Pub/Sub',
      category: 'messaging',
      cost: 15,
      capacityRps: 30000,
      addedLatencyMs: 8,
      icon: 'Layers',
      description: 'Hệ thống luồng sự kiện phân tán toàn cầu với độ trễ thấp và độ tin cậy cao',
      provider: 'gcp',
    },
  ],
};

export const SidebarDock: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider>('freestyle');

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

  const currentComponents = EMPIRE_COMPONENTS[selectedProvider] || EMPIRE_COMPONENTS.freestyle;

  const onDragStart = (event: React.DragEvent, item: ComponentItem) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(item));
    event.dataTransfer.effectAllowed = 'move';
  };

  const activeEmpire = EMPIRES.find((e) => e.id === selectedProvider) || EMPIRES[0];

  return (
    <aside className={styles.sidebarDock} aria-label="Component Toolbox Dock">
      <div className={styles.dockHeader}>
        <div className={styles.dockTitleRow}>
          <span className={styles.dockTitle}>Infrastructure Toolbox</span>
          <span className={styles.providerBadge} style={{ color: activeEmpire.color, borderColor: activeEmpire.color }}>
            {activeEmpire.tag}
          </span>
        </div>
        <div className={styles.dockSubtitle}>Cloud Empires: Freestyle, AWS, Azure, GCP</div>
      </div>

      {/* Empire Tabs Switcher */}
      <div className={styles.empireTabs} role="tablist" aria-label="Cloud Empire Selector">
        {EMPIRES.map((emp) => {
          const isActive = selectedProvider === emp.id;
          return (
            <button
              key={emp.id}
              role="tab"
              aria-selected={isActive}
              className={`${styles.empireTab} ${isActive ? styles.empireTabActive : ''}`}
              style={{
                borderColor: isActive ? emp.color : undefined,
                color: isActive ? emp.color : undefined,
              }}
              onClick={() => setSelectedProvider(emp.id)}
              title={`${emp.name}: ${emp.desc}`}
            >
              <span className={styles.tabDot} style={{ backgroundColor: emp.color }} />
              {emp.name}
            </button>
          );
        })}
      </div>

      <div className={styles.categoryList}>
        {categories.map((cat) => {
          const items = currentComponents.filter((c) => c.category === cat.key);
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
