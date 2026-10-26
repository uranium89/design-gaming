# Sprint 01 Review: Engine Prototype & Foundation

Báo cáo nghiệm thu Sprint 01 dành cho Stakeholder (người dùng).

## 1. Mục tiêu Sprint (Sprint Goal Met?)
**CÓ (YES - 100%)**. Đội ngũ AI Scrum đã hoàn thành toàn bộ 3 User Stories trong kế hoạch Sprint 01 đúng tiến độ và vượt qua tất cả các cổng chất lượng (Build, Unit Tests, Security Audit, Code Review).

## 2. Những gì bạn có thể tự mình trải nghiệm ngay bây giờ
Bạn có thể khởi chạy ứng dụng trực tiếp trên máy bằng lệnh:
```bash
npm run dev
```
Sau đó mở trình duyệt tại: **http://localhost:5173**

### Các bước trải nghiệm tính năng:
1. **Chiêm ngưỡng giao diện Modern Cloud Console**: Nền đen xám than chì lịch lãm, viền sắc nét, thanh TopBar phía trên hiển thị tên game "SysArchitect", Level 1 Badge và 4 thẻ số liệu (Throughput RPS, P95 Latency, Cost, Budget).
2. **Kéo-thả linh kiện (Drag & Drop)**:
   - Từ thanh Toolbox bên trái, giữ chuột và kéo thả linh kiện (Load Balancer, App Server, PostgreSQL DB, Message Queue) ra bất kỳ vị trí nào trên vùng lưới Canvas.
   - Thao tác di chuyển (Pan) và phóng to/thu nhỏ (Zoom) vùng vẽ mượt mà.
3. **Nối dây mạng kiến trúc (Connect Edges)**:
   - Kéo chuột từ chấm tròn xanh lá (Output bên phải node) sang chấm tròn tím (Input bên trái node khác) để thiết lập luồng xử lý dữ liệu.
4. **Bảng điều khiển Inspector**:
   - Click chọn bất kỳ node nào trên Canvas: Bảng Inspector ở góc phải dưới sẽ hiện lên, cho phép bạn tăng/giảm công suất tối đa (RPS) hoặc bấm "Xóa linh kiện này" nếu muốn thay đổi thiết kế.
5. **Kích hoạt mô phỏng tải thực tế (Simulation Engine)**:
   - Bấm nút **"Run"** màu xanh lá trên TopBar: Web Worker sẽ tính toán lưu lượng tức thời.
   - Các chỉ số RPS và chi phí $/tháng sẽ tự động nhảy số theo thời gian thực dựa trên cấu hình mạng bạn đã thiết kế.
   - Bạn có thể thử nghiệm tăng tốc độ mô phỏng với các nút **1x, 2x, 5x** hoặc bấm **"Pause"** để tạm dừng.

## 3. Các công việc chưa hoàn thành
*Không có*. Cả 3 stories (S-001, S-002, S-003) đều đã hoàn thành và nghiệm thu.

## 4. Quyết định đang chờ bạn (Decisions Waiting For You)
*Hiện không có*. Quyết định [DEC-001 (Visual Style)](../../decisions/DEC-001-visual-direction.md) đã được bạn chốt với Option B và đã triển khai vào sản phẩm.

## 5. Rủi ro hàng đầu (Top Risks)
- 🟡 **R-001: Hiệu năng hạt packet khi lượng request lớn**: Đã thiết kế kiến trúc cô lập luồng tính toán vào Web Worker độc lập, Main Thread giữ nguyên 60 FPS mượt mà.
- 🟢 **R-002: Cân bằng độ khó giữa các màn**: Đã thiết lập test suite `simulationMath.test.ts` kiểm thử chuẩn xác các ngưỡng suy giảm hiệu năng trước khi đưa vào màn chơi.

## 6. Chỉ số chất lượng Sprint 01 (Sprint Metrics)
- **Số câu chuyện hoàn thành**: 3 / 3 (100% Done, 0 Blocked).
- **Số vòng Review bình quân mỗi Story (Review Loops)**: 1.0 vòng/story (toàn bộ đạt ngay từ vòng đầu).
- **Lỗ hổng bảo mật bị chặn lại tại cổng Security Gate**: 0 lỗ hổng tồn đọng (`npm audit`: 0 vulnerabilities).
- **Tổng số Unit Tests tự động**: 12/12 PASS (Tốc độ chạy toàn bộ test suite: 0.6 giây).
