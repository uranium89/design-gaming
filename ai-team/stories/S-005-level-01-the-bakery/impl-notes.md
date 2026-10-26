# Implementation Notes: S-005 Màn 1 Hoàn chỉnh - Tiệm Bánh Ngọt (Level 01: The Local Bakery)

- **Author**: Coder / Frontend Dev
- **Date**: 2026-10-26
- **Loop**: 1

## Summary of Changes
1. **Level 01 Metadata & Reference Architecture (`src/levels/level01.ts`)**:
   - Định nghĩa `LEVEL_01` bám sát GDD Section 4 (Màn 1: The Local Bakery).
   - Ràng buộc: Base 50 RPS, Spike 120 RPS (15s), Budget trần $35, P95 < 200ms, SLA 99.0%.
   - Cung cấp kiến trúc mẫu 1 VM gộp ($20/tháng, 500 RPS capacity) đáp ứng ngân sách và chịu được tải đột biến.
2. **Scoring Engine (`src/simulation/scoring.ts`)**:
   - Hiện thực hóa đầy đủ công thức tính điểm 4 trụ cột từ GDD Section 3.2:
     - $S_{Throughput}$ (tối đa 350đ).
     - $S_{Latency}$ (tối đa 250đ).
     - $S_{Cost}$ (tối đa 250đ).
     - $S_{Reliability}$ (tối đa 150đ).
     - Trừ điểm phạt (SLA breach, data loss, DB crash).
     - Trao 1–3 sao dựa trên tổng điểm, SLA, ngân sách và độ ổn định.
3. **UI Modals**:
   - `src/components/BriefingModal/`: Hộp thoại mở đầu màn chơi với icon bánh ngọt 🧁, lưới thông số kỹ thuật (RPS, Budget, P95, SLA), cảnh báo sự cố Spike, nút "Bắt đầu thiết kế kiến trúc".
   - `src/components/ScoreModal/`: Hộp thoại tổng kết hiển thị 3 sao vàng ánh kim (glow), tổng điểm trên 1000, 4 thanh tiến trình từng trụ cột, thông báo phạt, nhận xét kiến trúc, cùng hai nút "Thử lại" và "Nạp kiến trúc mẫu (3★)".
4. **Simulation & TopBar Updates**:
   - `simulationWorker.ts`: Đo đếm thời gian thực hiện, tự động kích hoạt Spike ở giây thứ 30 (15 giây) hoặc hỗ trợ kích hoạt thủ công, tích lũy số lượng request thành công/thất bại cho việc chấm điểm.
   - `TopBar.tsx`: Thêm nút "Đề bài", "Chấm điểm", "Thử Spike ⚡" và đồng hồ hiển thị thời gian mô phỏng `MM:SS`.
   - `App.tsx`: Kết nối toàn bộ vòng đời Màn 1 và quản lý đóng/mở các Modal.

## Verification
- `npm test`: 23/23 tests pass across 6 test suites (`scoring.test.ts`, `modals.test.tsx`, `particleEdge.test.tsx`, `simulationMath.test.ts`, `graph.test.tsx`, `foundation.test.tsx`).
- `npm run build`: Build thành công (157ms), bundle sạch, không có lỗi TypeScript.
- `npm audit`: 0 vulnerabilities.
