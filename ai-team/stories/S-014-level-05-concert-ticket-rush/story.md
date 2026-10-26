# S-014: Màn 5 - Săn Vé Concert Black Friday (Level 05: Concert Ticket Rush)

Status: Done

## User Story
As a player,  
I want to architect an event-driven ticket reservation platform handling a 15,000 RPS write-heavy flash crowd (90% Write) with zero lost orders under a $400 budget,  
So that I learn how to use Message Queue buffering and Worker Pools to absorb explosive write spikes, protect the primary database from crashing, and earn 3 stars.

## Acceptance Criteria
- [x] Bổ sung Màn 5 vào danh sách các màn chơi (`src/levels/level05.ts` và `src/levels/index.ts`):
  - Tiêu đề: *Săn Vé Concert Black Friday (Concert Ticket Rush)*.
  - Badge: `Level 5: Ticket Rush`.
  - Tải: Base 500 RPS, Peak Spike 15,000 RPS (90% Write, 10% Read, `writeRatio: 0.90`).
  - Ràng buộc: Ngân sách tối đa $400/tháng, P95 < 100ms (xác nhận tiếp nhận đơn), SLA Uptime 99.9%, Zero Data Loss.
- [x] Mô phỏng kịch bản Write Spike & Bảo vệ Database:
  - Nếu kiến trúc KHÔNG có Message Queue (ghi trực tiếp từ App Server vào Database): Cụm Database (2,000 RPS) bị dội 13,500 RPS ghi và sập hoàn toàn (Crashed), rớt hơn 80% đơn hàng, vi phạm Data Loss và nhận 0-1 sao.
  - Nếu kiến trúc CÓ Message Queue và Worker Pool: Message Queue (30,000 RPS) đệm toàn bộ 13,500 RPS ghi an toàn mà không làm mất bất kỳ đơn nào (Zero Data Loss), Worker Pool san phẳng dòng tải và ghi ổn định xuống Database.
- [x] Cung cấp kiến trúc mẫu 3★ trong ngân sách $400:
  - 1 Load Balancer ($25) + 2 App Servers Medium ($90) + 1 Redis Cache ($25) + 1 Message Queue ($40) + 2 Worker Pools ($60) + 1 PostgreSQL Master DB ($40) = $280/tháng (<= 0.80 * $400 ngân sách tối đa).
- [x] Tích hợp vào Level Switcher trên TopBar (Level 1 đến Level 5).
- [x] Chấm điểm theo đúng ràng buộc ngân sách $400, P95 < 100ms, Zero Data Loss và SLA 99.9%.

## Out of Scope
- Mô phỏng logic thanh toán phân tán Two-Phase Commit (2PC) hay Saga (dành cho các màn sau).

## Assumptions
- Mở bán vé concert là bài toán điển hình của hệ thống ghi tức thời khổng lồ (Write-Heavy 9:1).

## Acceptance
- **Accepted by**: product-owner
- **Date**: 2026-10-26
- **Evidence**:
  - `tests/unit/level05ConcertTicket.test.tsx`: 5/5 passing unit tests covering level registration, 15k burst absorption, 3-star scoring, anti-pattern drop verification, and TopBar selector.
  - `npm test`: 63/63 passing tests across all 13 suites.
  - `npm run build`: successful production build.
  - Reviewer verdict: APPROVED in `review.md`.
