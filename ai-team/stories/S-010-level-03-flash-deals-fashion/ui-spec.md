# UI Spec: S-010 Màn 3 - Săn Sale Thời Trang (Level 03: Flash Deals Fashion)

- **Status**: Ready for Implementation
- **Author**: UI Designer

## 1. Giao diện Màn 3 (Level 3)

### 1.1. Level Switcher Dropdown
- Danh sách bao gồm 3 màn chơi:
  - `Level 1: The Bakery`
  - `Level 2: Tech News`
  - `Level 3: Flash Deals`
- Khi chuyển sang Màn 3:
  - Bảng vẽ hiển thị node khởi đầu `User Traffic ($0)`.
  - Mở Briefing Modal Màn 3.

### 1.2. Briefing Modal Màn 3
- **Badge**: `Level 3: Flash Deals` (màu tím hồng flash sale).
- **Tiêu đề**: *Săn Sale Thời Trang Cuối Tuần (Flash Deals Fashion)*.
- **Bối cảnh**: Ứng dụng mở bán flash sale 0h00, 50,000 khách đồng thời.
- **Thống số mục tiêu**:
  - Tải đỉnh: **4,000 RPS** (70% Read, 30% Write).
  - Ngân sách: **$250/tháng**.
  - P95 Latency: **< 120ms**.
  - SLA Uptime: **99.9%**.
  - Cảnh báo: *Nguy cơ sập máy chủ do rò rỉ bộ nhớ giữa đợt bùng nổ tải! Cần loại bỏ điểm nghẽn đơn lẻ (SPOF).*

### 1.3. Trực quan hóa Sự cố Memory Leak & Failover
- Khi sự cố kích hoạt ở giây thứ 35:
  - Node App Server 1 bốc cháy (viền đỏ chớp tắt, icon status `crashed`).
  - Hạt packet chuyển hướng toàn bộ sang các App Server lành lặn.
  - Sau khi hết sự cố (giây 45), hệ thống tự hồi phục.

## 2. Tiêu chuẩn Thẩm mỹ
- Bảng màu Enterprise Dark Console, hiệu ứng glow ánh tím/hồng neon cho flash deals.
