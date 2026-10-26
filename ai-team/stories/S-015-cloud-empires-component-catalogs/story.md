# S-015: Hệ Thống 4 Đế Chế Đám Mây (Cloud Empires: Freestyle, AWS, Azure, GCP) & Kho Linh Kiện Nhà Cung Cấp

Status: Ready

## User Story
As a player,  
I want to select between 4 Cloud Empires (Freestyle, AWS, Azure, GCP) on the sidebar and deploy provider-specific components with distinctive branding, cost, and capacity characteristics,  
So that I experience the real-world trade-offs between Open-Source self-hosting and managed Hyperscaler cloud ecosystems as defined in GDD Section 2 and Section 5.

## Acceptance Criteria
- [ ] Bổ sung thanh chọn tab Đế chế (Empire Selector Tabs) trên `SidebarDock`:
  - 4 Tabs: 🌐 `Freestyle`, 🟧 `AWS`, 🟦 `Azure`, 🟥 `GCP`.
  - Tab đang chọn có hiệu ứng viền sáng và màu sắc nhận diện đặc trưng:
    - Freestyle: Xanh lục `#10b981`.
    - AWS: Cam `#ff9900`.
    - Azure: Xanh lam `#0078d4`.
    - GCP: Xanh dương Google `#4285f4`.
- [ ] Cung cấp danh mục linh kiện theo từng Đế chế (chuẩn theo GDD Mục 2.1 & 2.2):
  - **Freestyle (Tự host / FOSS)**:
    - Load Balancer: `Nginx / HAProxy LB` ($15/m, 8,000 RPS, 2ms).
    - Compute: `Linux Server VM` (2C/4GB) ($20/m, 500 RPS, 25ms, medium/large tier).
    - Cache: `Redis Standalone` ($25/m, 20,000 RPS, 1ms).
    - Database: `PostgreSQL Master` ($40/m, 2,000 RPS, 15ms) & `PostgreSQL Read Replica` ($25/m, 2,500 RPS, 12ms).
    - Queue & Worker: `RabbitMQ Queue` ($30/m, 8,000 RPS, 3ms) & `Worker Pool` ($30/m, 2,000 RPS, 15ms).
  - **AWS Ecosystem**:
    - Load Balancer: `AWS ALB` ($25/m, 15,000 RPS, 4ms).
    - Compute: `AWS EC2 (t4g.large)` ($48/m, 1,200 RPS, 18ms).
    - Cache: `AWS ElastiCache (Redis)` ($85/m, 45,000 RPS, 1.5ms).
    - Database: `Amazon RDS / Aurora PG` ($120/m, 6,000 RPS, 8ms) & `AWS DynamoDB (NoSQL)` ($30/m, 10,000 RPS, 4ms).
    - Queue & Worker: `AWS SQS (Standard)` ($5/m, 40,000 RPS, 15ms) & `AWS Lambda / Worker` ($35/m, 3,000 RPS, 15ms).
  - **Azure Ecosystem**:
    - Load Balancer: `Azure App Gateway` ($35/m, 12,000 RPS, 5ms).
    - Compute: `Azure VM (B2ms)` ($45/m, 1,000 RPS, 20ms).
    - Cache: `Azure Cache for Redis` ($60/m, 30,000 RPS, 2ms).
    - Database: `Azure Database for PostgreSQL` ($90/m, 5,000 RPS, 10ms) & `Azure Cosmos DB` ($60/m, 8,000 RPS, 3ms).
    - Queue & Worker: `Azure Service Bus` ($20/m, 20,000 RPS, 10ms) & `Azure Container App Worker` ($35/m, 2,500 RPS, 15ms).
  - **GCP Ecosystem**:
    - Load Balancer: `GCP Cloud Load Balancer` ($22/m, 25,000 RPS, 2ms).
    - Compute: `GCP Cloud Run / GCE` ($40/m, 3,000 RPS, 15ms).
    - Cache: `GCP Cloud Memorystore` ($50/m, 35,000 RPS, 2ms).
    - Database: `GCP Cloud SQL` ($80/m, 5,000 RPS, 10ms) & `GCP Cloud Spanner` ($200/m, 15,000 RPS, 6ms).
    - Queue & Worker: `GCP Cloud Pub/Sub` ($15/m, 30,000 RPS, 8ms) & `GCP Cloud Functions Worker` ($30/m, 2,500 RPS, 15ms).
- [ ] Gắn thuộc tính `provider: 'freestyle' | 'aws' | 'azure' | 'gcp'` cho từng linh kiện:
  - Trên Canvas Node: Hiển thị tag/badge nhà cung cấp góc trên của card node.
  - Trên Inspector Panel: Hiển thị logo/badge đế chế và thông số chi tiết của nhà cung cấp.
- [ ] Tích hợp tính toán mô phỏng trong `engineMath.ts`:
  - Nhận diện đúng vai trò kiến trúc của các linh kiện tương đương (ALB/App Gateway/Cloud LB tương đương Load Balancer; ElastiCache/Memorystore tương đương Cache; SQS/Service Bus/PubSub tương đương Queue; Aurora/Spanner/CosmosDB tương đương Database).
  - Tính toán tổng chi phí chính xác theo giá niêm yết của từng linh kiện.

## Out of Scope
- Thuật toán định giá động theo giây tính toán micro-billing (giữ mô hình chuẩn hóa $/tháng theo GDD).

## Assumptions
- Người chơi có thể tự do kết hợp linh kiện của nhiều đế chế trong cùng một kiến trúc (Hybrid Multi-cloud) hoặc xây dựng 100% thuần một đế chế.

## Acceptance
_Filled by the product-owner after testing and visual review._
