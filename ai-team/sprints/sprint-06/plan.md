# Sprint 06 Plan: Message Queue, Async Worker Decoupling & Level 05 (Concert Ticket Rush)

- **Sprint Goal**: Cung cấp linh kiện Message Queue (RabbitMQ) và Worker Pool (Async Consumer), hiện thực hóa cơ chế xử lý bất đồng bộ (Traffic Leveling / Buffering) để giải quyết bài toán Write-Heavy cực hạn (90% Write), đồng thời phát hành Màn 5 (Concert Ticket Rush - 15,000 RPS Write Spike, Zero Data Loss, $400 budget).
- **Duration**: Sprint 06
- **Status**: Approved by Stakeholder (`lam sprint 6`)

## Stories in this Sprint

| # | Story ID | Title | Status | Risk | Summary |
|---|---|---|---|---|---|
| 1 | S-013 | [Linh kiện Message Queue (RabbitMQ) & Worker Pool (Async Processing)](../../stories/S-013-message-queue-async-worker/story.md) | Ready | 🟡 Med | Bổ sung linh kiện Message Queue ($40/m, 30,000 RPS) và Worker Pool ($30/m, 2,000 RPS) vào SidebarDock; cơ chế đệm bất đồng bộ (Traffic Leveling / Buffering) trong `engineMath.ts` bảo vệ Database không bị sập và chống mất dữ liệu (Zero Data Loss). |
| 2 | S-014 | [Màn 5: Săn Vé Concert Black Friday (Level 05: Concert Ticket Rush)](../../stories/S-014-level-05-concert-ticket-rush/story.md) | Ready | 🟢 Low | Tải đỉnh bùng nổ 15,000 RPS Write-Heavy (90% Write, 10% Read), ngân sách $400/tháng, SLA 99.9%, yêu cầu tuyệt đối Zero Data Loss; kiến trúc bất đồng bộ với Message Queue + Worker Pool đạt 3★. |

## What the Stakeholder Will Be Able to Try
1. **Kéo thả linh kiện Message Queue & Worker Pool**:
   - Sử dụng Message Queue (RabbitMQ) và Worker Pool để thiết kế luồng xử lý bất đồng bộ Event-Driven.
   - Trực quan hóa dòng chảy tác vụ: App Server chuyển giao tức thời cho Queue (độ trễ 5ms), sau đó Worker Pool tiêu thụ tác vụ với tốc độ ổn định xuống Database.
2. **Trải nghiệm Màn 5 hoàn chỉnh (Concert Ticket Rush)**:
   - Thử nghiệm sai lầm khi ghi đồng bộ trực tiếp 15,000 RPS vào Database: Database sập vĩnh viễn, rớt 80%+ đơn hàng, bị phạt Data Loss nặng nề và nhận 0 Sao.
   - Thử nghiệm kiến trúc chuẩn 3★ với Message Queue: Toàn bộ 15,000 RPS ghi được xếp hàng an toàn, không rớt bất kỳ đơn nào (Zero Data Loss), đạt trọn vẹn 3 Sao trong ngân sách $400/tháng.
