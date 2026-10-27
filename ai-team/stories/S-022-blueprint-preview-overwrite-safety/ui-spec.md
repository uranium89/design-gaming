# UI Specification - S-022: Blueprint Preview Modal & Overwrite Safety

Status: Ready
Author: ui-designer

## 1. Blueprint Preview Card Layout
- **Container**:
  - Background: `rgba(15, 23, 42, 0.75)` (Slate 900) với viền `1px solid rgba(56, 189, 248, 0.3)`.
  - Border-radius: 10px.
  - Padding: 16px.
  - Margin: 12px 0.
- **Header**:
  - Tiêu đề bản vẽ: font-weight 600, màu trắng `#f8fafc`.
  - Hàng badge:
    - Target Level: nền xanh dương nhẹ (`rgba(59, 130, 246, 0.2)`), viền `#3b82f6`.
    - Empire: màu thương hiệu đám mây tương ứng (AWS cam `#f97316`, Azure xanh `#0284c7`, GCP đỏ `#ef4444`, Freestyle xanh lá `#10b981`).
- **Thống kê tóm tắt 3 cột (Grid 3 cols)**:
  - Cột 1: `Nodes: X` (icon `Cpu` hoặc `Server`).
  - Cột 2: `Edges: Y` (icon `Share2` hoặc `Cable`).
  - Cột 3: `Est. Cost: $Z/mo` (icon `DollarSign`).
- **Danh sách linh kiện (Component Chips)**:
  - Flex-wrap các thẻ nhỏ: nền `rgba(255, 255, 255, 0.06)`, padding 4px 8px, font-size 12px.
  - Ví dụ: `App Server × 2`, `PostgreSQL × 1`, `Redis Cache × 1`.
- **Khung Cảnh Báo Ghi Đè (Safety Warning Box)**:
  - Hiển thị khi `currentNodesCount > 0`.
  - Nền vàng nhạt trong suốt `rgba(245, 158, 11, 0.12)`, viền `1px solid rgba(245, 158, 11, 0.4)`.
  - Icon `AlertTriangle` màu vàng `#f59e0b`.
  - Text: *"Thao tác này sẽ thay thế ${currentNodesCount} linh kiện hiện tại trên Canvas của bạn."*
- **Hàng Nút Hành Động**:
  - Nút Xác Nhận: Nền Cyan/Sky Gradient rực rỡ, chữ đen đậm, hover sáng nhẹ. Text: "Xác nhận nạp bản vẽ".
  - Nút Hủy: Nền trong suốt viền xám tối, hover nền trắng mờ. Text: "Hủy bỏ".

## 2. UI Acceptance Criteria
- [ ] Giao diện Preview Card sắc nét, không bị xô lệch layout.
- [ ] Responsive tốt trên cả màn hình nhỏ lẫn desktop.
- [ ] Hiển thị đầy đủ thông số bản vẽ và cảnh báo ghi đè.
