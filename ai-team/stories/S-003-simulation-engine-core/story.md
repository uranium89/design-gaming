# S-003: Bộ Mô phỏng Dòng tải Cốt lõi qua Web Worker (Simulation Engine Core)

Status: Done

## User Story
As a player,  
I want the system to simulate realistic user traffic and calculate latency, queue depth, throughput, and error rates,  
So that I can see whether my architecture satisfies non-functional requirements.

## Acceptance Criteria
- [x] Web Worker nhận cấu hình đồ thị từ Main Thread và chạy vòng lặp mô phỏng Discrete Event Simulation (DES) theo nhịp tick 50ms.
- [x] Tính toán hàng đợi M/M/c/K: Tăng độ trễ phi tuyến khi lưu lượng vượt quá 80% công suất node.
- [x] Tự động drop request (HTTP 504 / 503) khi hàng đợi vượt ngưỡng tối đa.
- [x] Hỗ trợ điều khiển mô phỏng: Start, Pause, Resume, Reset, và điều chỉnh tốc độ (1x, 2x, 5x).
- [x] Gửi snapshot metrics định kỳ (20 FPS) về UI Thread (Current RPS, Errors, P95 Latency, Cumulative Cost).

## Out of Scope
- Render đồ họa hạt packet (thuộc S-004).
- Các kịch bản sự cố phức tạp đa vùng (Multi-Region / Partition) - dành cho các màn nâng cao.

## Assumptions
- Mô hình hàng đợi bám sát công thức toán học trong GDD Section 3.

## Acceptance
- **Accepted by**: Product Owner (Loop 1)
- **Evidence**:
  - Criterion 1: Met - [test-result.md](test-result.md#acceptance-criteria-verification), `src/simulation/simulationWorker.ts`
  - Criterion 2: Met - [test-result.md](test-result.md#acceptance-criteria-verification), `tests/unit/simulationMath.test.ts:L66-L75`
  - Criterion 3: Met - [test-result.md](test-result.md#acceptance-criteria-verification), `tests/unit/simulationMath.test.ts:L77-L86`
  - Criterion 4: Met - [test-result.md](test-result.md#acceptance-criteria-verification), `src/simulation/useSimulation.ts:L78-L98`
  - Criterion 5: Met - [test-result.md](test-result.md#acceptance-criteria-verification), `src/simulation/engineMath.ts:L114-L125`
  - Security Gate: PASS - [security.md](security.md)
  - Reviewer Verdict: APPROVED - [review.md](review.md)

