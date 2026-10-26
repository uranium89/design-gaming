# Sprint 04 Plan: Load Balancer Health Check, Failover & Level 03 (Flash Deals Fashion)

- **Sprint Goal**: Xây dựng cơ chế Load Balancer Health Check & Auto Failover (tự động phát hiện và ngắt node lỗi) và phát hành Màn 3 (Flash Deals Fashion - 4,000 RPS peak, $250 budget) giới thiệu kiến trúc Stateless Compute kết hợp cụm máy chủ chịu lỗi cao.
- **Trạng thái**: Draft (Chờ Stakeholder phê duyệt)

## Danh sách User Stories trong Sprint 04

| Thứ tự | Mã Story | Tiêu đề | Trạng thái | Ước lượng rủi ro | Điểm cốt lõi |
|---|---|---|---|---|---|
| 1 | S-009 | [Load Balancer Health Check & Failover Event](../stories/S-009-load-balancer-health-check-failover/story.md) | Ready | 🟡 Med | Load Balancer tự động phát hiện node sập (unhealthy), ngừng gửi traffic đến node hỏng và chuyển hướng sang các node lành |
| 2 | S-010 | [Màn 3: Săn Sale Thời Trang (Level 03: Flash Deals Fashion)](../stories/S-010-level-03-flash-deals-fashion/story.md) | Ready | 🟢 Low | Tải đỉnh 4,000 RPS (70% Read / 30% Write), kiến trúc 1 LB + Multi-App Server Stateless + Redis Session + Postgres DB, sự kiện node crash |

## Những gì Stakeholder có thể trải nghiệm sau Sprint 04
1. **Kiểm thử khả năng chịu lỗi (Fault Tolerance)**:
   - Người chơi có thể kích hoạt sự cố sập máy chủ ngẫu nhiên hoặc có chủ đích trên canvas.
   - Load Balancer hiển thị trạng thái Health Check trực quan (chấm xanh = healthy, chấm đỏ gạch chéo = node bị cách ly). Dòng hạt traffic tự động uốn lượn chỉ đi vào các server đang sống.
2. **Trải nghiệm Màn 3 hoàn chỉnh (Flash Deals Fashion)**:
   - Thử thách điều phối đợt flash sale 4,000 RPS đỉnh với ngân sách $250/tháng.
   - Thấy rõ sự thất bại nếu dùng kiến trúc đơn điểm (Single Point of Failure - SPOF): khi máy chủ duy nhất bị sập, hệ thống sụp đổ hoàn toàn.
   - Thấy rõ sức mạnh của kiến trúc Stateless nhiều server sau Load Balancer: dù 1 máy chủ bốc cháy, dịch vụ vẫn chạy mượt mà đạt chuẩn 99.9% Uptime và nhận 3 sao!
