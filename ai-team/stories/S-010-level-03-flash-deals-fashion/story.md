# S-010: Màn 3 - Săn Sale Thời Trang Cuối Tuần (Level 03: Flash Deals Fashion)

Status: Ready

## User Story
As a player,  
I want to design a fault-tolerant, horizontal scale-out architecture for a high-traffic fashion flash sale (4,000 RPS peak, 70% Read, 30% Write, $250 budget) with automatic server failover,  
So that I learn how to build stateless applications behind a Load Balancer and earn 3 stars even when an unexpected server crash occurs during peak traffic.

## Acceptance Criteria
- [ ] Bổ sung Màn 3 vào danh sách các màn chơi (`src/levels/level03.ts` và `src/levels/index.ts`):
  - Tiêu đề: *Săn Sale Thời Trang Cuối Tuần (Flash Deals Fashion)*.
  - Badge: `Level 3: Flash Deals`.
  - Tải: Base 500 RPS, Peak Spike 4,000 RPS (diễn ra trong 15s).
  - Tỉ lệ: 70% Read, 30% Write (`writeRatio: 0.30`).
  - Ràng buộc: Ngân sách tối đa $250/tháng, P95 < 120ms, SLA Uptime 99.9%.
- [ ] Sự kiện Chaos Event trong Màn 3:
  - Giữa đợt spike (giây thứ 35), 1 máy chủ App Server bất kỳ bị kích hoạt sự cố sập (Memory Leak / Crash).
  - Nếu người chơi dùng 1 máy chủ duy nhất (SPOF): Toàn bộ hệ thống sụp đổ, 100% traffic bị drop, nhận 0 sao.
  - Nếu người chơi dùng từ 2 máy chủ trở lên đằng sau Load Balancer: Load Balancer tự động failover sang các máy chủ còn lại, hệ thống duy trì hoạt động với SLA >= 99.9%.
- [ ] Cung cấp kiến trúc mẫu 3★ trong ngân sách $250:
  - 1 Load Balancer ($25) + 2 App Servers Medium ($45 x 2 = $90) + 1 Redis Cache/Session ($25) + 1 PostgreSQL DB ($40) = $180/tháng (<= $250).
- [ ] Tích hợp vào Level Switcher trên TopBar cho phép chọn và chuyển mượt mà giữa Level 1, Level 2 và Level 3.
- [ ] Chấm điểm theo đúng ràng buộc ngân sách $250, P95 < 120ms và SLA 99.9%.

## Out of Scope
- Tự động co giãn đám mây Auto-scaling group nâng cao dựa trên CloudWatch CPU metric (dành cho các màn sau).

## Assumptions
- Dữ liệu giỏ hàng và session được lưu tập trung trên Redis Cache ($25) để các App Server hoàn toàn là Stateless.

## Acceptance
_Filled by the product-owner after testing and visual review._
