# Technical Spec: S-004 Trực quan hóa Hạt Lưu lượng Thời gian thực (Packet Particle Visualizer)

- **Status**: Ready for Implementation
- **Risk Level**: 🟡 Medium (Tối ưu hiệu năng animation mượt mà khi zoom/pan)
- **Author**: Architect

## 1. Technical Approach
- Xây dựng **Custom Edge (`ParticleEdge`)** trong `@xyflow/react` thay thế edge mặc định:
  - Tự động đồng bộ với ma trận Viewport của React Flow khi người chơi Zoom hoặc Pan.
  - Sử dụng hàm `getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })` để tính toán đường cong mượt mà.
- **Trực quan hóa trạng thái dây dẫn (Wire Congestion & Heatmap)**:
  - Dây bình thường: Stroke `#6366f1`, độ dày 2px.
  - Dây cảnh báo (Warning $\rho \ge 0.8$): Stroke `#f59e0b`, độ dày 3.5px, glow vàng.
  - Dây quá tải (Overloaded $\rho \ge 1.0$): Stroke `#ef4444`, độ dày 4.5px, glow đỏ.
- **Trực quan hóa hạt lưu lượng (Particle Flow Animation)**:
  - Khi mô phỏng đang chạy (`isRunning: true`): Kích hoạt dòng hạt chuyển động dọc theo `edgePath`.
  - Phân màu hạt:
    - Xanh lục `#10b981`: Gói tin thành công (200 OK).
    - Vàng cam `#f59e0b`: Gói tin xử lý chậm.
    - Đỏ rực `#ef4444`: Gói tin lỗi hoặc bị drop do quá tải.
  - Tần suất hạt và tốc độ hạt tương ứng với lưu lượng (RPS) và tốc độ mô phỏng (`1x, 2x, 5x`).
- Đăng ký `edgeTypes = { particle: ParticleEdge }` trong `src/components/CanvasArea/CanvasArea.tsx`.

## 2. File Manifest (Write Zone)
- `src/components/ParticleEdge/ParticleEdge.tsx`: Component Custom Edge vẽ SVG path và animation hạt.
- `src/components/ParticleEdge/ParticleEdge.module.css`: CSS keyframes, glow filters và stroke dash animation.
- `src/state/graphStore.ts`: Cập nhật edge type mặc định thành `particle` và truyền traffic data xuống edge.
- `src/components/CanvasArea/CanvasArea.tsx`: Khai báo `edgeTypes` trong ReactFlow.
- `tests/unit/particleEdge.test.tsx`: Test suite kiểm thử render custom edge, tính toán bezier path và màu sắc theo trạng thái.

## 3. Verification Criteria
- `npm run build`: Không có lỗi TypeScript hay build bundle.
- `npm test`: Tất cả tests đều PASS.
- Khi bấm "Run", các hạt phát sáng di chuyển liên tục trên các dây nối; khi máy chủ quá tải, dây nối đổi sang đỏ rực và phát sinh hạt đỏ.
