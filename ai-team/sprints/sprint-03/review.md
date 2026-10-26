# Sprint 03 Review: Interactive Inspector & Level 02 (URL Shortener with Redis Cache)

## 1. Sprint Goal Met?
**Yes.** Sprint 03 đã hoàn thành 100% mục tiêu đề ra:
- **S-007 (Interactive Inspector & Instance Scaling)**: Cho phép click chọn linh kiện trên Canvas để mở Inspector drawer, xem đồng hồ đo tải thời gian thực (Realtime Utilization Meter), nâng/hạ tier máy chủ (Small $20 / Medium $45 / Large $90), điều chỉnh thuật toán Load Balancer, xóa linh kiện hoặc đóng drawer.
- **S-008 (Level 02: Breaking Tech News / URL Shortener with Redis Cache)**: Bổ sung linh kiện Redis Cache ($25, 20k RPS, 1ms latency), bộ chọn màn chơi Level Switcher trên TopBar, cơ chế mô phỏng Cache Hit/Miss (90% read hit) bảo vệ Database khỏi nghẽn cổ chai khi gặp spike 2,500 RPS, và hệ thống chấm điểm 1–3 sao chuẩn GDD.

## 2. What You Can Try Now (Hướng dẫn trải nghiệm trực tiếp)
Khởi chạy ứng dụng: `npm run dev` và mở trình duyệt tại `http://localhost:5173`.

### Trải nghiệm S-007 (Interactive Inspector):
1. Kéo thả một máy chủ **App Server (VM)** từ Sidebar Dock ra Canvas.
2. Click chuột vào node App Server: Ngăn kéo **Inspector Panel** trượt ra mượt mà từ bên phải.
3. Quan sát **Đồng hồ tải (Utilization Gauge)** với thanh bar đổi màu xanh/vàng/đỏ theo % tải thực tế.
4. Thử bấm đổi giữa **Small (2C/4GB - $20)** $\rightarrow$ **Medium (4C/8GB - $45)** $\rightarrow$ **Large (8C/16GB - $90)**: Quan sát thấy giá tiền tháng và năng lực RPS cập nhật tức thì trên node và thanh TopBar.
5. Kéo thả **Load Balancer**, click chọn và thử đổi thuật toán giữa *Least Connections*, *Round Robin*, và *IP Hash*.
6. Bấm nút **Xóa linh kiện** để gỡ bỏ node hoặc click dấu [X] để đóng ngăn kéo.

### Trải nghiệm S-008 (Màn 2: Breaking Tech News / URL Shortener):
1. Trên thanh TopBar góc trái, click vào menu **Level Switcher** và chọn **Level 2: Tech News**.
2. Đọc đề bài trong **Briefing Modal**: Bối cảnh tin tức nóng (99% Read, 1% Write), tải đỉnh 2,500 RPS, ngân sách trần $100/tháng, P95 < 80ms.
3. **Thử nghiệm không có Cache**:
   - Dựng kiến trúc: `User Traffic` $\rightarrow$ `App Server (Medium $45)` $\rightarrow$ `Postgres DB ($40)`.
   - Bấm **Run** và bấm **Thử Spike** (2,500 RPS).
   - Quan sát: Database chỉ có sức chứa 600 RPS, bị dồn toàn bộ 2,500 RPS nên quá tải nghiêm trọng (Overloaded), drop hơn 1,900 RPS (~76% gói tin bị từ chối). Bấm **Chấm điểm**: Điểm số thấp, rớt hạng sao.
4. **Thử nghiệm với Redis Cache (Kiến trúc 3★)**:
   - Thêm linh kiện **Redis Cache ($25)** vào giữa: `User Traffic` $\rightarrow$ `App Server (Medium $45)` $\rightarrow$ `Redis Cache ($25)` $\rightarrow$ `SQLite / Micro DB ($10)` (tổng chi phí $80 <= $100).
   - Bấm **Run** và **Thử Spike**: Redis Cache hấp thụ 90% lượt đọc, chỉ chuyển tiếp ~272 RPS xuống Database. Toàn bộ hệ thống xanh mướt, P95 < 45ms, 0 gói tin bị drop.
   - Bấm **Chấm điểm**: Đạt điểm tuyệt đối **3 Sao (★★★)**!

## 3. Not Finished
Không có. Cả 2 User Stories (S-007 và S-008) đều đã hoàn thành và vượt qua tất cả các Quality Gates.

## 4. Decisions Waiting For You
Không có quyết định 🔴 High nào đang chờ. Mọi quyết định kiến trúc linh kiện và công thức chấm điểm đều tuân thủ đúng GDD và đã được kiểm chứng bằng 34 tests.

## 5. Top Risks
| Mức độ | Rủi ro | Giải pháp thực hiện |
|---|---|---|
| 🟢 Low | Người chơi có thể nối nhầm Client trực tiếp vào Cache | Đã có cơ chế kiểm tra `hasDirectClientToStorage` ngắt kết nối và phạt lỗi kiến trúc ngay lập tức |
| 🟢 Low | Performance khi số lượng hạt hạt chuyển động tăng cao ở Màn 2 (2,500 RPS) | Đã sử dụng SVG Native GPU-accelerated `<animateMotion>`, duy trì ổn định 60 FPS |

## 6. Metrics
- **Stories Done**: 2/2 (S-007, S-008). 100% hoàn thành.
- **Average Review Loops**: 1.0 vòng/story (cả 2 story đều APPROVED ngay trong Loop 1).
- **Security Findings**: 0 phát hiện ở cổng DevSecOps (`npm audit` 0 lỗ hổng).
- **Defects Reported**: 0 lỗi phát sinh. Toàn bộ 34 unit tests PASS.
