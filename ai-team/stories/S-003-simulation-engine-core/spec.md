# Technical Spec: S-003 Bộ Mô phỏng Dòng tải Cốt lõi qua Web Worker (Simulation Engine Core)

- **Status**: Ready for Implementation
- **Risk Level**: 🟡 Medium (Ảnh hưởng luồng dữ liệu tính toán thời gian thực và IPC)
- **Author**: Architect

## 1. Technical Approach
- Xây dựng Web Worker chuyên trách tại `src/simulation/simulationWorker.ts` bám sát [ADR 0002](../../adr/0002-web-worker-discrete-event-simulation.md).
- **Mô hình hàng đợi M/M/c/K phi tuyến**:
  - Nhịp tick: 50ms ảo.
  - Phân tích luồng từ nguồn `User Traffic`:
    - Duyệt đồ thị theo Breadth-First Search (BFS) từ Client Node xuôi theo Edges.
    - Nếu gặp Load Balancer: Chia đều lưu lượng cho các node đích downstream ($RPS_{each} = RPS_{in} / N$).
  - Tại mỗi node $i$:
    - $\rho_i = \frac{RPS_{in}}{Capacity_i}$
    - Nếu $\rho_i < 0.8$: Trạng thái `healthy`, độ trễ $T_i = AddedLatency_i$.
    - Nếu $0.8 \le \rho_i < 1.0$: Trạng thái `warning`, độ trễ tăng phi tuyến $T_i = AddedLatency_i \times \left(1 + \frac{\rho_i - 0.8}{0.2} \times 2\right)$.
    - Nếu $\rho_i \ge 1.0$: Trạng thái `overloaded`, số request thành công bị chặn ở $Capacity_i$, số request thừa bị drop thành lỗi HTTP 504.
  - Tích lũy độ trễ toàn tuyến: $T_{total} = \sum T_i$.
  - Tích lũy chi phí: $Cost_{total} = \sum Cost_i$.
- **Giao thức tin nhắn IPC**:
  - `Main -> Worker`:
    - `{ type: 'START' | 'PAUSE' | 'RESET' }`
    - `{ type: 'SET_SPEED', speed: 1 | 2 | 5 }`
    - `{ type: 'SYNC_GRAPH', nodes, edges }`
  - `Worker -> Main`:
    - `{ type: 'METRICS_UPDATE', metrics: LiveMetrics, nodeUpdates: Record<string, { status, currentRps }> }`

## 2. File Manifest (Write Zone)
- `src/simulation/engineMath.ts`: Module tính toán toán học thuần túy (thuật toán BFS, tính hàng đợi, tính P95, tính chi phí), phục vụ unit testing không cần Worker runtime.
- `src/simulation/simulationWorker.ts`: Dedicated Web Worker quản lý timer và giao tiếp `self.postMessage`.
- `src/simulation/useSimulation.ts`: React hook quản lý vòng đời Web Worker, kết nối với `useGraphStore` và `TopBar`.
- `src/App.tsx`: Nối hook `useSimulation` với `TopBar` và `CanvasArea`.
- `tests/unit/simulationMath.test.ts`: Test suite kiểm thử toán học (Saturation curve, Queue drop, Load Balancer split).

## 3. Verification Criteria
- `npm run build`: Hoàn tất không lỗi TypeScript hay worker bundler.
- `npm test`: Tất cả simulation math tests đều PASS.
- Bấm "Run" trên TopBar: Metrics RPS, P95, Cost nhảy theo thời gian thực; khi quá tải, status dot của node chuyển sang vàng/đỏ.
