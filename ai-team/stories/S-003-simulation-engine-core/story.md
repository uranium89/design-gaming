# S-003: Bộ Mô phỏng Dòng tải Cốt lõi qua Web Worker (Simulation Engine Core)

Status: Draft

## User Story
As a player,  
I want the system to simulate realistic user traffic and calculate latency, queue depth, throughput, and error rates,  
So that I can see whether my architecture satisfies non-functional requirements.

## Acceptance Criteria
- [ ] Web Worker nhận cấu hình đồ thị từ Main Thread và chạy vòng lặp mô phỏng Discrete Event Simulation (DES) theo nhịp tick 50ms.
- [ ] Tính toán hàng đợi M/M/c/K: Tăng độ trễ phi tuyến khi lưu lượng vượt quá 80% công suất node.
- [ ] Tự động drop request (HTTP 504 / 503) khi hàng đợi vượt ngưỡng tối đa.
- [ ] Hỗ trợ điều khiển mô phỏng: Start, Pause, Resume, Reset, và điều chỉnh tốc độ (1x, 2x, 5x).
- [ ] Gửi snapshot metrics định kỳ (20 FPS) về UI Thread (Current RPS, Errors, P95 Latency, Cumulative Cost).

## Out of Scope
- Render đồ họa hạt packet (thuộc S-004).
- Các kịch bản sự cố phức tạp đa vùng (Multi-Region / Partition) - dành cho các màn nâng cao.

## Assumptions
- Mô hình hàng đợi bám sát công thức toán học trong GDD Section 3.

## Acceptance
_Filled by the product-owner after testing and visual review._
