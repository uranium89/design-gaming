# Test Result: S-003 Bộ Mô phỏng Dòng tải Cốt lõi qua Web Worker (Simulation Engine Core)

## Loop 1
- **Tester**: Fast Model
- **Verdict**: PASS

### Automated Test Evidence
Command: `npm test`
```
 ✓ tests/unit/simulationMath.test.ts (4 tests)
   ✓ Simulation Engine Mathematics Unit Tests (4)
     ✓ calculates normal healthy traffic flow correctly
     ✓ detects warning status when traffic approaches 80%-100% capacity
     ✓ drops traffic and sets overloaded status when traffic exceeds 100% capacity
     ✓ splits traffic equally across targets downstream of a Load Balancer
 ✓ tests/unit/graph.test.tsx (5 tests)
 ✓ tests/unit/foundation.test.tsx (3 tests)

 Test Files  3 passed (3)
      Tests  12 passed (12)
   Duration  669ms
```

### Acceptance Criteria Verification
1. **Web Worker DES Tick Loop**: PASS (`src/simulation/simulationWorker.ts:L24-L28` thiết lập timer tick và `src/simulation/useSimulation.ts:L49-L55` đồng bộ đồ thị).
2. **Tính toán hàng đợi M/M/c/K phi tuyến**: PASS (`tests/unit/simulationMath.test.ts:L66-L75` kiểm chứng 90% tải kích hoạt warning status và độ trễ tăng phi tuyến).
3. **Tự động drop request khi vượt 100% capacity**: PASS (`tests/unit/simulationMath.test.ts:L77-L86` kiểm chứng 800 RPS trên máy chủ 500 RPS làm quá tải, chặn 500 RPS thành công và drop 300 RPS, error rate 37.5%).
4. **Hỗ trợ điều khiển mô phỏng (Start/Pause, 1x/2x/5x)**: PASS (`src/simulation/useSimulation.ts:L78-L98` gửi các thông điệp `START`, `PAUSE`, `SET_SPEED` và điều chỉnh chu kỳ tick tương ứng).
5. **Gửi metrics định kỳ về UI Thread**: PASS (`src/simulation/engineMath.ts:L114-L125` sinh snapshot đầy đủ Throughput, P95 Latency, Cost, Error Rate).
