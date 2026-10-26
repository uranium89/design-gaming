# UI Spec: S-001 Nền tảng Thiết kế Giao diện (Design Foundation)

- **Author**: UI Designer
- **Status**: Ready for Implementation
- **Reference**: [ai-team/DESIGN.md](../../DESIGN.md) (Modern Cloud Console / Enterprise Dark)

## 1. Screens & Layout
- **Màn hình chính**: Toàn màn hình trình duyệt (100vw, 100vh), overflow hidden, nền `--bg-app` (#0b1120).
- **Phân bổ không gian**:
  ```
  +--------------------------------------------------------------------------+
  | TopBar (Chiều cao 56px, nền #1e293b, border-bottom #334155)             |
  +-------------------+------------------------------------------------------+
  | SidebarDock       | CanvasArea (Lưới chấm/ô vuông 20px x 20px)           |
  | (Độ rộng 260px)   | Background: #0f172a                                  |
  | Nền: #1e293b      | Placeholder nodes và không gian kéo-thả              |
  | Border-right:     |                                                      |
  | #334155           |                                                      |
  +-------------------+------------------------------------------------------+
  ```

## 2. Component Specs

### TopBar
- **Logo & Title**: "SysArchitect" (chữ trắng đậm, icon server), bên cạnh có Badge "Level 1: The Bakery" (nền indigo đậm `#312e81`, chữ tím nhạt `#c7d2fe`).
- **Control Deck**: Nút Run/Pause (nút màu xanh lá `#10b981` với icon Play), nút chọn tốc độ 1x, 2x, 5x.
- **Metric Pills**:
  - Throughput: `0 RPS` (Màu xanh lục `--color-success`)
  - P95 Latency: `0 ms` (Màu xanh lục)
  - Cost: `$0 / mo` (Màu vàng cam `--color-warning`)
  - Budget: `$35 max` (Màu xám nhạt `--text-muted`)

### SidebarDock
- **Section Headers**: Chữ hoa 11px, màu `--text-dim` (#64748b), khoảng cách lề 16px.
- **Dock Item Card**:
  - Kích thước: Full width trừ lề 16px, chiều cao ~42px.
  - Nền: `--bg-canvas` (#0f172a), border `--border-default` (#334155), bo góc 6px.
  - Hover: Border chuyển sang `--color-primary` (#6366f1), con trỏ dạng `grab`.
  - Icon: Icon 16px màu trắng/indigo, kèm tên linh kiện và capacity tóm tắt.

### CanvasArea
- **Nền**: `#0f172a` với họa tiết lưới kẻ đường mờ 1px mỗi 20px (`rgba(255, 255, 255, 0.05)`).
- **Watermark/Empty State**: Ở giữa canvas có khung hướng dẫn nhẹ nhàng: *"Kéo linh kiện từ Dock bên trái vào đây để bắt đầu thiết kế"*.

## 3. Responsive & Accessibility Criteria
- Tối ưu chuẩn ở 1440px và co giãn tốt từ 1024px trở lên.
- Tương phản màu sắc (Color Contrast Ratio) giữa text và background đạt tối thiểu 4.5:1 (WCAG AA).
