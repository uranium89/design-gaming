# Technical Spec: S-005 Màn 1 Hoàn chỉnh - Tiệm Bánh Ngọt (Level 01: The Local Bakery)

- **Status**: Ready for Implementation
- **Risk Level**: 🟢 Low (Logic game loop cấp độ và modal UI)
- **Author**: Architect

## 1. Technical Approach
- Xây dựng module dữ liệu màn chơi tại `src/levels/level01.ts`:
  - Khai báo metadata đề bài Màn 1: The Local Bakery bám sát [GDD Section 4](../../../docs/GAME_DESIGN_DOCUMENT.md).
  - Định nghĩa ràng buộc: Base RPS (20-50), Spike RPS (120), Spike Duration (15s), Budget trần ($35), P95 target (200ms), Uptime SLA (99.0%).
  - Cung cấp kiến trúc mẫu (Reference Monolith Architecture) để người chơi có thể tải và học hỏi.
- Xây dựng module tính điểm `src/simulation/scoring.ts`:
  - Hiện thực chính xác công thức chấm điểm 4 trụ cột từ GDD Section 3.2:
    - $S_{Throughput}$ (tối đa 350đ)
    - $S_{Latency}$ (tối đa 250đ)
    - $S_{Cost}$ (tối đa 250đ)
    - $S_{Reliability}$ (tối đa 150đ)
    - Trừ điểm phạt nếu vi phạm SLA hoặc vượt ngân sách.
  - Phân định số sao: 3 sao ($\ge$ 850đ), 2 sao (700 - 849đ), 1 sao (500 - 699đ), 0 sao (< 500đ).
- Giao diện Modal:
  - `BriefingModal`: Mở tự động khi vào màn, hiển thị yêu cầu bài toán, ràng buộc kỹ thuật.
  - `ScoreModal`: Hiển thị khi người chơi hoàn thành đợt chạy hoặc nhấn "Chấm điểm", kèm biểu đồ điểm và nhận xét.

## 2. File Manifest (Write Zone)
- `src/levels/level01.ts`: Thông số đề bài Màn 1 và kiến trúc mẫu.
- `src/simulation/scoring.ts`: Module tính điểm và phân hạng sao.
- `src/components/BriefingModal/BriefingModal.tsx` & `BriefingModal.module.css`.
- `src/components/ScoreModal/ScoreModal.tsx` & `ScoreModal.module.css`.
- Cập nhật `src/App.tsx` tích hợp vòng đời Level 1 và các Modal.
- `tests/unit/scoring.test.ts`: Test suite kiểm thử công thức tính điểm và điều kiện trao sao.

## 3. Verification Criteria
- `npm run build`: Không có lỗi TypeScript hay build bundle.
- `npm test`: Tất cả scoring tests và existing tests đều PASS.
- Mở web app hiển thị Briefing Màn 1; bấm chạy mô phỏng và bấm Chấm điểm tính toán đúng số sao theo công thức GDD.
