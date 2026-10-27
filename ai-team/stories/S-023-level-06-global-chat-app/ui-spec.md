# UI Specification - S-023: Level 06 Global Chat App (WebSockets & Redis Pub/Sub)

Status: Ready
Author: ui-designer

## 1. TopBar Level Selector Integration
- Menu chọn màn chơi:
  - Khi chưa hoàn thành Màn 5: Hiển thị mục `🔒 Level 6: Global Chat (Cần 1★ ở Màn 5)` bị `disabled={true}`.
  - Khi Màn 5 hoàn thành: Hiển thị `Level 6: Global Chat` với các ngôi sao đạt được (ví dụ `Level 6: Global Chat ⭐⭐⭐`).
  - Độ rộng select: Tiếp tục tuân thủ quy tắc max-width 175px ellipsis từ S-019, không làm vỡ bố cục TopBar.

## 2. Briefing Modal & Canvas Presentation
- **Briefing Modal**:
  - Tiêu đề: "Phòng Chat Toàn Cầu (Global Chat App)"
  - Mô tả kịch bản: Hướng dẫn người chơi giải bài toán lưu lượng tin nhắn thời gian thực và tầm quan trọng của Message Broker (Redis Pub/Sub) trong kiến trúc stateful mesh.
  - Các chỉ số mục tiêu: Throughput 10,000 RPS, P95 Latency 50ms, Ngân sách $500/tháng, Tỷ lệ ghi 60%.
- **Initial Canvas**:
  - Bắt đầu với Node `User Traffic` ($0/mo, 1,000 RPS cơ bản, spike 10,000 RPS).

## 3. UI Acceptance Criteria
- [ ] Màn 6 hiển thị chuẩn xác trong dropdown TopBar.
- [ ] Briefing modal mở đầy đủ thông tin khi chọn Màn 6.
