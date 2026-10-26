# S-015: Hệ Thống 4 Đế Chế Đám Mây (Cloud Empires: Freestyle, AWS, Azure, GCP) & Kho Linh Kiện Nhà Cung Cấp

Status: Done

## User Story
As a player,  
I want to select between 4 Cloud Empires (Freestyle, AWS, Azure, GCP) on the sidebar and deploy provider-specific components with distinctive branding, cost, and capacity characteristics,  
So that I experience the real-world trade-offs between Open-Source self-hosting and managed Hyperscaler cloud ecosystems as defined in GDD Section 2 and Section 5.

## Acceptance Criteria
- [x] Bổ sung thanh chọn tab Đế chế (Empire Selector Tabs) trên `SidebarDock`:
  - 4 Tabs: 🌐 `Freestyle`, 🟧 `AWS`, 🟦 `Azure`, 🟥 `GCP`.
  - Tab đang chọn có hiệu ứng viền sáng và màu sắc nhận diện đặc trưng:
    - Freestyle: Xanh lục `#10b981`.
    - AWS: Cam `#ff9900`.
    - Azure: Xanh lam `#0078d4`.
    - GCP: Xanh dương Google `#4285f4`.
- [x] Cung cấp danh mục linh kiện theo từng Đế chế (chuẩn theo GDD Mục 2.1 & 2.2):
  - **Freestyle (Tự host / FOSS)**: Load Balancer (Nginx), App Server (VM), Redis Cache, PostgreSQL DB, Read Replica, RabbitMQ Queue, Worker Pool.
  - **AWS Ecosystem**: AWS ALB, AWS EC2 (t4g.large), AWS ElastiCache (Redis), Amazon Aurora / RDS PG, AWS DynamoDB, AWS SQS, AWS Lambda / Worker.
  - **Azure Ecosystem**: Azure Application Gateway, Azure VM (B2ms), Azure Cache for Redis, Azure Database for PostgreSQL, Azure Cosmos DB, Azure Service Bus, Azure Container App Worker.
  - **GCP Ecosystem**: GCP Cloud Load Balancer, GCP Cloud Run / Compute, GCP Cloud Memorystore, GCP Cloud SQL, GCP Cloud Spanner, GCP Cloud Pub/Sub, GCP Cloud Functions Worker.
- [x] Gắn thuộc tính `provider: 'freestyle' | 'aws' | 'azure' | 'gcp'` cho từng linh kiện:
  - Trên Canvas Node: Hiển thị tag/badge nhà cung cấp góc trên của card node.
  - Trên Inspector Panel: Hiển thị logo/badge đế chế và thông số chi tiết của nhà cung cấp.
- [x] Tích hợp tính toán mô phỏng trong `engineMath.ts`:
  - Nhận diện đúng vai trò kiến trúc của các linh kiện tương đương (ALB/App Gateway/Cloud LB tương đương Load Balancer; ElastiCache/Memorystore tương đương Cache; SQS/Service Bus/PubSub tương đương Queue; Aurora/Spanner/CosmosDB tương đương Database).
  - Tính toán tổng chi phí chính xác theo giá niêm yết của từng linh kiện.

## Out of Scope
- Thuật toán định giá động theo giây tính toán micro-billing (giữ mô hình chuẩn hóa $/tháng theo GDD).

## Assumptions
- Người chơi có thể tự do kết hợp linh kiện của nhiều đế chế trong cùng một kiến trúc (Hybrid Multi-cloud) hoặc xây dựng 100% thuần một đế chế.

## Acceptance
- **Accepted by**: Product Owner
- **Evidence**: `tests/unit/cloudEmpires.test.tsx` (5/5 tests passing), full regression suite (68/68 passing).
- **Date**: 2026-10-26
- **Verdict**: PASS & ACCEPTED

