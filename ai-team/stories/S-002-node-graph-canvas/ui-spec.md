# UI Spec: S-002 Bảng vẽ Đồ thị Kiến trúc với React Flow (Node Graph Canvas)

- **Author**: UI Designer
- **Status**: Ready for Implementation
- **Reference**: [ai-team/DESIGN.md](../../DESIGN.md)

## 1. Custom Node Card Design
- **Kích thước & Bo góc**: Độ rộng cố định 200px, padding 10px 14px, bo góc 8px.
- **Nền & Viền**:
  - Bình thường: Nền `--bg-surface` (#1e293b), viền `--border-default` (#334155), đổ bóng nhẹ.
  - Được chọn (Selected): Viền `--color-primary` (#6366f1) 2px, box-shadow glow `0 0 12px rgba(99, 102, 241, 0.35)`.
- **Nội dung thẻ Node**:
  - **Header**: Icon đại diện (16px) + Tên linh kiện (13px, font-weight 600) + Chấm tròn trạng thái (Status Dot: Xanh lá = Healthy, Vàng = Warning, Đỏ = Crashed).
  - **Metrics Subtext**: Capacity (ví dụ: `15,000 RPS`) & Chi phí (`$25/mo`).
- **Connection Handles**:
  - Target Handle (Input): Nằm ở cạnh trái/trên, hình tròn 10px, màu viền trắng, ruột `--color-primary`.
  - Source Handle (Output): Nằm ở cạnh phải/dưới, hình tròn 10px, màu viền trắng, ruột `--color-success`.

## 2. Inspector Panel (Góc phải dưới Canvas)
- **Vị trí**: `position: absolute; bottom: 20px; right: 20px; width: 300px;`
- **Phong cách**: Kính mờ (glassmorphism), nền `rgba(30, 41, 59, 0.92)`, viền `--border-default`, bo góc 10px.
- **Thành phần**:
  - Header: Tên node được chọn kèm nút đóng (x).
  - Body: vCPU/Capacity slider hoặc input số, hiển thị độ trễ và chi phí tương ứng.
  - Footer: Nút "Xóa node" màu đỏ nguy hiểm (Danger).

## 3. Visual Edge Connection
- Dây nối giữa các node: Đường cong mượt mà (smoothstep hoặc bezier), màu `--text-dim` (#64748b), độ dày 2px. Khi hover hoặc select: đổi sang màu `--color-primary`.
