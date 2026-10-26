# Technical Specification: S-015 Hệ Thống 4 Đế Chế Đám Mây & Kho Linh Kiện Nhà Cung Cấp

## Status: Ready
Risk Level: 🟡 Medium (Refactors SidebarDock component structure and node provider metadata)

## Architecture Overview
This specification details the transition from a single generic component dock to a **Multi-Cloud Empire System** featuring 4 distinct ecosystems:
1. `freestyle` (Open-Source / Self-Hosted)
2. `aws` (Amazon Web Services)
3. `azure` (Microsoft Azure)
4. `gcp` (Google Cloud Platform)

### Data Model Updates
1. **Node Data Type Extension (`src/types/index.ts` / `src/components/CustomNode/CustomNode.tsx`)**:
   Add optional metadata to node data:
   ```ts
   export type CloudProvider = 'freestyle' | 'aws' | 'azure' | 'gcp';

   export interface CustomNodeData {
     name: string;
     category: 'compute' | 'storage' | 'routing' | 'messaging';
     cost: number;
     capacityRps: number;
     addedLatencyMs: number;
     icon: string;
     status: 'healthy' | 'warning' | 'overloaded' | 'crashed';
     currentRps?: number;
     tier?: 'small' | 'medium' | 'large';
     provider?: CloudProvider;
     description?: string;
   }
   ```

2. **Component Catalog Structure (`src/components/SidebarDock/SidebarDock.tsx`)**:
   Refactor component catalog into provider-keyed definitions:
   ```ts
   export const EMPIRE_COMPONENTS: Record<CloudProvider, ComponentItem[]> = {
     freestyle: [...],
     aws: [...],
     azure: [...],
     gcp: [...],
   };
   ```

3. **Provider Component Specs**:
   - **Freestyle**:
     - `Nginx / HAProxy LB`: $15/m, 8,000 RPS, 2ms, `routing`, `Network`
     - `Linux VM`: $20/m, 500 RPS, 25ms, `compute`, `Cpu`
     - `Redis Standalone`: $25/m, 20,000 RPS, 1ms, `storage`, `Database`
     - `PostgreSQL Master`: $40/m, 2,000 RPS, 15ms, `storage`, `Database`
     - `PostgreSQL Read Replica`: $25/m, 2,500 RPS, 12ms, `storage`, `Database`
     - `RabbitMQ Queue`: $30/m, 8,000 RPS, 3ms, `messaging`, `Layers`
     - `Worker Pool (Async Consumer)`: $30/m, 2,000 RPS, 15ms, `compute`, `Cpu`
   - **AWS**:
     - `AWS Application Load Balancer`: $25/m, 15,000 RPS, 4ms, `routing`, `Network`
     - `AWS EC2 (t4g.large)`: $48/m, 1,200 RPS, 18ms, `compute`, `Cpu`
     - `AWS ElastiCache (Redis)`: $85/m, 45,000 RPS, 1.5ms, `storage`, `Database`
     - `Amazon RDS / Aurora PG`: $120/m, 6,000 RPS, 8ms, `storage`, `Database`
     - `AWS DynamoDB (NoSQL)`: $30/m, 10,000 RPS, 4ms, `storage`, `Database`
     - `AWS SQS (Standard)`: $5/m, 40,000 RPS, 15ms, `messaging`, `Layers`
     - `AWS Lambda / Worker`: $35/m, 3,000 RPS, 15ms, `compute`, `Cpu`
   - **Azure**:
     - `Azure Application Gateway`: $35/m, 12,000 RPS, 5ms, `routing`, `Network`
     - `Azure VM (B2ms)`: $45/m, 1,000 RPS, 20ms, `compute`, `Cpu`
     - `Azure Cache for Redis`: $60/m, 30,000 RPS, 2ms, `storage`, `Database`
     - `Azure Database for PostgreSQL`: $90/m, 5,000 RPS, 10ms, `storage`, `Database`
     - `Azure Cosmos DB`: $60/m, 8,000 RPS, 3ms, `storage`, `Database`
     - `Azure Service Bus`: $20/m, 20,000 RPS, 10ms, `messaging`, `Layers`
     - `Azure Container App Worker`: $35/m, 2,500 RPS, 15ms, `compute`, `Cpu`
   - **GCP**:
     - `GCP Cloud Load Balancer`: $22/m, 25,000 RPS, 2ms, `routing`, `Network`
     - `GCP Cloud Run / Compute`: $40/m, 3,000 RPS, 15ms, `compute`, `Cpu`
     - `GCP Cloud Memorystore`: $50/m, 35,000 RPS, 2ms, `storage`, `Database`
     - `GCP Cloud SQL`: $80/m, 5,000 RPS, 10ms, `storage`, `Database`
     - `GCP Cloud Spanner`: $200/m, 15,000 RPS, 6ms, `storage`, `Database`
     - `GCP Cloud Pub/Sub`: $15/m, 30,000 RPS, 8ms, `messaging`, `Layers`
     - `GCP Cloud Functions Worker`: $30/m, 2,500 RPS, 15ms, `compute`, `Cpu`

4. **Simulation Engine Pattern Matching (`src/simulation/engineMath.ts`)**:
   Ensure node matching covers all naming variants across providers:
   - `isLoadBalancer`: includes 'load balancer', 'alb', 'gateway' (if routing), 'app gateway'.
   - `isCache`: includes 'cache', 'redis', 'elasticache', 'memorystore'.
   - `isQueueNode`: includes 'queue', 'rabbitmq', 'sqs', 'service bus', 'pub/sub', or category `messaging`.
   - `isWorkerNode`: includes 'worker', 'lambda', 'functions', 'container app'.
   - `isMasterDbNode`: category `storage` and not cache, not queue, not replica.

## Quality Gates
- `npm test`: all unit tests passing.
- `npm run build`: successful production build.
