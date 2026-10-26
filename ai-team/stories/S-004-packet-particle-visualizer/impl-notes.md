# Implementation Notes: S-004 Trực quan hóa Hạt Lưu lượng Thời gian thực (Packet Particle Visualizer)

## Loop 1
- **Developer**: Coder
- **Changes**:
  1. Tạo Custom Edge `ParticleEdge` (`src/components/ParticleEdge/ParticleEdge.tsx`) kế thừa `BaseEdge` của `@xyflow/react`.
  2. Sử dụng SVG `<animateMotion>` chuẩn phần cứng để di chuyển các hạt packet hình tròn (`r=3.5px`) dọc theo đường cong Bezier của dây nối với tốc độ 60 FPS mà không tiêu tốn tài nguyên CPU của Main Thread.
  3. Tích hợp chuyển đổi trạng thái màu sắc dây dẫn và hạt packet tự động theo mức độ tải của Node đích:
     - Tải bình thường (<80%): Dây `#334155`, hạt màu xanh lục `#10b981`.
     - Tải cảnh báo (80%-99%): Dây phình to 3.5px, màu vàng cam `#f59e0b`, hạt màu vàng cam.
     - Quá tải ($\ge$100%): Dây phình to 4.5px, màu đỏ `#ef4444`, hạt màu đỏ rực.
  4. Đăng ký `edgeTypes = { particle: ParticleEdge }` trong `CanvasArea.tsx` và cấu hình các dây kết nối mặc định cũng như dây kết nối mới tạo đều có type `particle`.
  5. Đồng bộ trạng thái chạy mô phỏng (`isSimulationRunning`) và tốc độ (`simulationSpeed: 1 | 2 | 5`) từ `useSimulation` vào `useGraphStore`.
  6. Xây dựng test suite `tests/unit/particleEdge.test.tsx` (4 unit tests) kiểm thử toàn diện khả năng render SVG path, kích hoạt dòng hạt khi Play và đổi màu theo trạng thái Healthy/Warning/Overloaded.

- **Verification Command & Output**:
  - `npm run build`: Hoàn thành xuất sắc trong 147ms (0 lỗi).
  - `npm test`: 16/16 tests PASS trên 4 test suites.
