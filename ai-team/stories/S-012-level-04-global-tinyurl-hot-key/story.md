# S-012: Màn 4 - Rút Gọn Link Toàn Cầu & Xử lý Hot Key (Level 04: Global TinyURL)

Status: Ready

## User Story
As a player,  
I want to architect a globally scalable URL Shortener service (8,000 RPS peak, 95% Read, 5% Write, $350 budget) with Read Replicas and Caching,  
So that I learn how to handle read-heavy traffic and withstand a sudden viral "Hot Key" traffic spike (10,000 RPS on a single URL) to earn 3 stars.

## Acceptance Criteria
- [ ] Bổ sung Màn 4 vào danh sách các màn chơi (`src/levels/level04.ts` và `src/levels/index.ts`):
  - Tiêu đề: *Dịch Vụ Rút Gọn Link Toàn Cầu (Global TinyURL Service)*.
  - Badge: `Level 4: TinyURL`.
  - Tải: Base 1,000 RPS, Peak Spike 8,000 RPS (95% Read, 5% Write, `writeRatio: 0.05`).
  - Ràng buộc: Ngân sách tối đa $350/tháng, P95 < 50ms, SLA Uptime 99.9%.
- [ ] Sự kiện Chaos Hot Key Event:
  - Giữa đợt spike (giây thứ 35-45), kích hoạt sự cố Hot Key: 1 liên kết của người nổi tiếng nhận 10,000 RPS đọc tăng đột biến.
  - Nếu kiến trúc KHÔNG có Redis Cache trước Read Replicas: Cụm Read Replicas bị cạn kiệt năng lực, P95 vọt lên > 150ms, drop hàng loạt request, nhận 0-1 sao.
  - Nếu kiến trúc CÓ Redis Cache phía trước: Redis Cache (20,000 RPS, 1ms) hấp thụ 90%+ traffic Hot Key, bảo vệ các Read Replicas và giữ P95 < 30ms!
- [ ] Cung cấp kiến trúc mẫu 3★ trong ngân sách $350:
  - 1 Load Balancer ($25) + 2 App Servers Medium ($45 x 2 = $90) + 1 Redis Cache ($25) + 1 PostgreSQL Master DB ($40) + 2 Read Replicas ($25 x 2 = $50) = $230/tháng (<= $350).
- [ ] Tích hợp vào Level Switcher trên TopBar (Level 1, Level 2, Level 3, Level 4).
- [ ] Chấm điểm theo đúng ràng buộc ngân sách $350, P95 < 50ms và SLA 99.9%.

## Out of Scope
- Tự động sharding Database thành 16 phân mảnh vật lý (dành cho các màn sau).

## Assumptions
- Dịch vụ rút gọn link là điển hình của hệ thống cực kỳ thiên về đọc (20:1 Read/Write ratio).

## Acceptance
_Filled by the product-owner after testing and visual review._
