# Sprint 02 Review: Flow Visualization & Playable Level 1

- **Sprint Goal Met?**: **Yes (100% hoàn thành)**.
- **Sprint Goal**: Hoàn thiện trực quan hóa dòng hạt lưu lượng (packet flow) 60 FPS di chuyển trên dây nối và phát hành màn chơi hoàn chỉnh đầu tiên (Level 01: The Bakery) với đầy đủ kịch bản sự cố và chấm điểm 1-3 sao.

---

## 1. Những gì Stakeholder có thể trải nghiệm ngay bây giờ

Để trải nghiệm màn chơi Màn 1: The Bakery và dòng hạt lưu lượng thời gian thực:

1. Chạy lệnh phát triển cục bộ:
   ```bash
   npm run dev
   ```
2. Mở trình duyệt tại `http://localhost:5173`:
   - **Hộp thoại Đề bài (Briefing Modal)** tự động mở ra: Bạn sẽ thấy mục tiêu Màn 1: *Tiệm Bánh Ngọt Gia Đình*, yêu cầu phục vụ 50 RPS với ngân sách dưới $35/tháng, độ trễ P95 < 200ms và cảnh báo sự cố Spike 120 RPS.
   - Nhấn **"Bắt đầu thiết kế kiến trúc"** để vào bàn làm việc.
3. Thử nghiệm dòng hạt chuyển động:
   - Bấm nút **"Run"** trên TopBar: Bạn sẽ thấy ngay các hạt màu xanh lục (`#10b981`) bay nhịp nhàng 60 FPS theo đường cong Bezier của các dây nối giữa User Traffic -> App Server -> Database.
   - Thay đổi tốc độ 1x / 2x / 5x: Tốc độ di chuyển của các hạt sẽ tăng tốc tương ứng.
4. Thử nghiệm sự cố đột biến tải (Traffic Spike):
   - Đợi đến giây thứ 30 (hoặc bấm nút **"Thử Spike"** trên thanh TopBar): Lưu lượng lập tức tăng vọt lên 120 RPS. Bạn sẽ thấy các hạt chuyển dần sang màu cam/đỏ khi hàng đợi nghẽn hoặc drop.
5. Thử nghiệm Chấm điểm kiến trúc:
   - Bấm nút **"Chấm điểm"** (icon cúp vàng 🏆 trên TopBar): Modal Tổng kết hiện ra với 3 ngôi sao vàng ánh kim, tổng điểm chuẩn hóa trên 1,000, 4 thanh tiến trình cho từng trụ cột (Throughput, Latency, Cost, Reliability) và nhận xét kỹ thuật.
   - Bấm **"Nạp kiến trúc mẫu (3★)"**: Hệ thống tự động chuyển đổi sang mô hình 1 VM Monolith tối ưu ngân sách $20/tháng (dưới $35), đạt điểm tối đa 3 sao!
   - Bấm **"Thử lại"**: Đặt lại bài toán và thử nghiệm phương án riêng của bạn.

---

## 2. Các User Stories chưa hoàn thành
- Không có story nào bị trễ (S-004 và S-005 đều đã Done 100%).

---

## 3. Quyết định đang chờ bạn (Pending Decisions)
- Không có quyết định PENDING nào. (Quyết định [DEC-001: Visual Direction](../decisions/DEC-001-visual-direction.md) đã được duyệt và áp dụng hoàn hảo).

---

## 4. Báo cáo Rủi ro Hàng đầu (Top Risks)
- 🟢 **R-001: Hiệu năng hạt khi số lượng dây lớn**: Đã giải quyết triệt để ở S-004 bằng Native SVG `<animateMotion>` với biến đổi GPU, không dùng requestAnimationFrame DOM loop, duy trì mượt mà 60 FPS.
- 🟢 **R-002: Cân bằng độ khó màn chơi (Level Balancing)**: Công thức chấm điểm 4 trụ cột đã được kiểm chứng bằng test case tự động bám sát GDD Section 3.3.

---

## 5. Số liệu chất lượng Sprint (Metrics)
- **Số story hoàn thành**: 2/2 (100% cam kết).
- **Số vòng lặp review trung bình (Average review loops)**: 1.0 vòng/story.
- **Lỗ hổng bảo mật bị chặn ở Security Gate**: 0 lỗ hổng (`npm audit` 0 vulnerabilities).
- **Bộ kiểm thử tự động (Unit Tests)**: 23/23 tests PASS (thời gian chạy < 850ms).
- **Tốc độ build bundle**: 157ms (`tsc && vite build`).
