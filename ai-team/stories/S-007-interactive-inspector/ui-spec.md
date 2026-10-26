# UI Spec: S-007 Component Inspector Tương tác cao

- **Author**: UI Designer
- **Status**: Ready for Implementation
- **Reference**: [ai-team/DESIGN.md](../../DESIGN.md)

## 1. Inspector Drawer Layout
- **Vị trí**: Cố định ở góc phải màn hình, nằm trên canvas, chiều rộng 320px.
- **Phong cách**: Enterprise Cloud Console Dark (`--bg-surface: #1e293b`), viền `--border-default: #334155`, bo góc 10px, hiệu ứng đổ bóng sâu.
- **Header**:
  - Icon thành phần đại diện (Cpu, Database, Network, Users).
  - Tiêu đề tên linh kiện (`1.0rem`, font-weight 600, trắng sáng).
  - Nút đóng (✕) ở góc phải trên.

## 2. Realtime Utilization Meter (Thanh đo công suất thời gian thực)
- Hiển thị tỷ lệ phần trăm tải: `currentRps / capacityRps * 100%`.
- Thanh tiến trình:
  - Chiều cao: 8px, bo tròn toàn phần (`border-radius: 9999px`).
  - Màu sắc:
    - `< 70%`: Xanh ngọc lục bảo (`#10b981`).
    - `70% - 99%`: Vàng cam hổ phách (`#f59e0b`).
    - `>= 100%`: Đỏ cờ báo động (`#ef4444`) kèm hiệu ứng phát sáng nhẹ.

## 3. Configuration Controls
- **Segmented Control cho Instance Tier (với App Server / Compute)**:
  - 3 tùy chọn: `Small` ($20, 500 RPS) | `Medium` ($45, 1.5k RPS) | `Large` ($90, 4k RPS).
  - Nút đang chọn có nền `--color-primary: #6366f1` với chữ trắng, nút chưa chọn có nền chìm.
- **Dropdown cho Thuật toán Routing (với Load Balancer)**:
  - Các tùy chọn: `Least Connections` (mặc định), `Round Robin`, `IP Hash`.
- **Nút Xóa linh kiện (Remove Component)**:
  - Đặt ở đáy Inspector, viền đỏ mờ, chữ đỏ cảnh báo.
  - Hover: nền chuyển sang `rgba(239, 68, 68, 0.15)`, biểu tượng thùng rác lắc nhẹ.
