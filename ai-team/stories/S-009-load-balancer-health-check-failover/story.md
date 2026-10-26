# S-009: Load Balancer Health Check & Failover Event

Status: Done

## User Story
As a player,  
I want the Load Balancer to perform automated health checks on downstream compute nodes and instantly route traffic away from failing or crashed servers,  
So that I learn how high-availability distributed systems eliminate Single Points of Failure (SPOF) and maintain zero downtime during infrastructure outages.

## Acceptance Criteria
- [x] Cơ chế Health Check trong Load Balancer (`engineMath.ts` & `simulationWorker.ts`):
  - Load Balancer chỉ phân bổ lưu lượng (Round Robin / Least Connections) cho các target node có trạng thái sống (`status !== 'crashed'`).
  - Nếu 1 node downstream bị sập (crashed / memory leak): Load Balancer loại bỏ node đó ra khỏi pool định tuyến trong vòng 1-2 ticks, chuyển 100% traffic sang các server còn lại.
  - Nếu tất cả các node downstream đều sập: Load Balancer trả về lỗi `503 Service Unavailable`, 100% request bị drop.
- [x] Tính năng mô phỏng sự cố (Chaos / Failure Injection):
  - Cho phép người chơi kích hoạt sự cố sập một máy chủ thông qua nút bấm "Crash Node (Simulate Failure)" trên Inspector hoặc sự kiện ngẫu nhiên trong kịch bản.
  - Node bị sập chuyển sang trạng thái icon cháy/đỏ `crashed`.
- [x] Phản hồi trực quan trên Canvas & Particle Edge:
  - Cạnh nối (Edge) từ Load Balancer tới node bị sập chuyển sang màu đỏ ngắt quãng / xám, dừng bắn hạt packet sang node đó.
  - Các hạt packet được tăng cường chuyển sang các cạnh dẫn tới những node khỏe mạnh.

## Out of Scope
- Kiểm tra HTTP path tùy chỉnh sâu (`/healthz` endpoint custom logic).

## Assumptions
- Thời gian phát hiện lỗi (Health check latency) là 1 tick mô phỏng (tương đương 100ms - 1s ngoài đời thực).

## Acceptance
- **Accepted by**: Product Owner
- **Date**: 2026-10-26
- **Evidence**:
  - `npm test`: 39/39 unit tests PASS across 8 test suites.
  - `npm run build`: Production bundle built in 143ms.
  - `npm audit`: 0 vulnerabilities.
  - Reviewer: APPROVED.
  - UI Designer: PASS.
  - DevSecOps: PASS.
