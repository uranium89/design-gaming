# UI Review: S-007 Component Inspector Tương tác cao

- **Author**: UI Designer
- **Verdict**: PASS
- **Loop**: 1

## Visual Conformance
1. **Inspector Panel Drawer**:
   - Tọa độ góc phải dưới (`bottom: 20px, right: 20px`), chiều rộng 320px, hiệu ứng trượt mở mượt mà (`animation: slideIn`).
   - Nền dark surface `#1e293b` với kính mờ `backdrop-filter: blur(12px)` và viền `#334155`.
   - Header hiển thị icon thành phần (Cpu, Database, Network, Users) kèm tiêu đề node trắng sáng và nút đóng (✕).
2. **Thanh đo công suất (Utilization Meter)**:
   - Nằm trong khung bo góc riêng biệt với nền canvas `#0f172a`.
   - Label icon Gauge nhỏ kèm hiển thị thông số mono: `XX / YY RPS (ZZ%)`.
   - Thanh tiến trình mượt mà với 3 gradient màu: Xanh lục (<70%), Vàng cam (70-99%), Đỏ báo động (>=100%).
3. **Bộ chuyển đổi Instance Tier**:
   - Thiết kế dạng Segmented Control 3 cột: `Small`, `Medium`, `Large`.
   - Nút active có màu tím Indigo `--color-primary: #6366f1` với đổ bóng nhẹ, phản hồi click tức thì.
4. **Nút Xóa linh kiện**:
   - Viền đỏ bán trong suốt, hover chuyển sang nền đỏ mờ cảnh báo rõ ràng.
