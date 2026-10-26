# UI Spec: S-004 Trực quan hóa Hạt Lưu lượng Thời gian thực (Packet Particle Visualizer)

- **Author**: UI Designer
- **Status**: Ready for Implementation
- **Reference**: [ai-team/DESIGN.md](../../DESIGN.md)

## 1. Edge & Wire Aesthetics
- **Hình dạng dây dẫn**: Đường cong Bezier tự nhiên (`getBezierPath`), bo cong mượt mà giữa các cổng xuất/nhập.
- **Trạng thái dây dẫn**:
  - **Bình thường (Healthy, tải < 80%)**: Dây màu xám xanh `--border-default` (#334155), độ dày 2px. Hạt màu xanh lục phát sáng bay qua.
  - **Cảnh báo (Warning, tải 80% - 99%)**: Dây chuyển màu vàng cam `--color-warning` (#f59e0b), độ dày 3px, hiệu ứng đổ bóng `drop-shadow(0 0 6px rgba(245, 158, 11, 0.4))`.
  - **Quá tải (Overloaded, tải $\ge$ 100%)**: Dây phình to 4.5px, màu đỏ `--color-danger` (#ef4444), nhấp nháy báo động `drop-shadow(0 0 10px rgba(239, 68, 68, 0.6))`.

## 2. Packet Particle Aesthetics
- **Hình dạng hạt**: Hình tròn bán kính `r = 3.5px`, viền trắng mờ `rgba(255, 255, 255, 0.8)` 1px.
- **Màu sắc hạt**:
  - Hạt thành công: Nền `--color-success` (#10b981), vệt sáng xanh phía sau.
  - Hạt lỗi/drop: Nền `--color-danger` (#ef4444), biến mất ở 75% chiều dài dây nối biểu thị bị từ chối / sập kết nối.
- **Tốc độ chuyển động**:
  - Chạy theo nhịp thời gian thực: mất khoảng 1.2s để đi hết dây nối ở tốc độ 1x, 0.6s ở tốc độ 2x, và 0.25s ở tốc độ 5x.
- **Tương tác**: Khi người chơi di chuyển (Pan) hoặc phóng to (Zoom), các hạt bám dính chính xác vào quỹ đạo của dây dẫn mà không bị lệch tọa độ.
