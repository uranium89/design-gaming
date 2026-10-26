# Implementation Notes: S-003 Bộ Mô phỏng Dòng tải Cốt lõi qua Web Worker (Simulation Engine Core)

## Loop 1
- **Developer**: Coder
- **Changes**:
  1. Tạo `src/simulation/engineMath.ts` chứa thuật toán toán học mô phỏng hàng đợi M/M/c/K phi tuyến:
     - Duyệt luồng dữ liệu theo thuật toán BFS từ nguồn phát (User Traffic).
     - Phân phối lưu lượng đồng đều khi gặp Load Balancer.
     - Mô phỏng suy giảm hiệu năng: tăng độ trễ phi tuyến khi $\rho \ge 0.8$ (Warning) và drop request vượt ngưỡng khi $\rho \ge 1.0$ (Overloaded).
     - Tính toán tổng Throughput thành công, P95 Latency, Error Rate và tổng chi phí vận hành $/tháng.
  2. Tạo `src/simulation/simulationWorker.ts` là Dedicated Web Worker chạy nhịp tick 50ms (điều chỉnh theo tốc độ 1x, 2x, 5x), trao đổi dữ liệu với Main Thread qua `postMessage`.
  3. Tạo hook `src/simulation/useSimulation.ts` kết nối Web Worker với `useGraphStore` và `TopBar`:
     - Tự động đồng bộ topology đồ thị mạng khi người chơi thêm/bớt/nối dây node.
     - Cập nhật live metrics lên TopBar và cập nhật trạng thái màu sắc status dot của từng node.
  4. Cập nhật `src/App.tsx` liên kết điều khiển mô phỏng (Run/Pause, 1x/2x/5x).
  5. Xây dựng test suite `tests/unit/simulationMath.test.ts` (4 unit tests) kiểm thử toàn diện kịch bản tải bình thường, tiệm cận ngưỡng warning, quá tải drop request và chia tải qua Load Balancer.

- **Verification Command & Output**:
  - `npm run build`: Hoàn thành thành công (0 errors, build worker và bundle chính tối ưu).
  - `npm test`: 12/12 tests PASS trên cả 3 test suites.
