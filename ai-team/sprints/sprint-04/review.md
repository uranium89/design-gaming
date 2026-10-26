# Sprint 04 Review: Load Balancer Health Check & Level 03 (Flash Deals Fashion)

## 1. Sprint Goal Met?
**Yes.** Sprint 04 đã hoàn thành 100% mục tiêu đề ra:
- **S-009 (Load Balancer Health Check & Failover Event)**: Load Balancer tự động phát hiện node máy chủ bị sập, lập tức cô lập node hỏng và điều hướng 100% traffic sang các máy chủ lành lặn với 0% gói tin bị drop. Người chơi có thể chủ động kích hoạt sự cố sập / khôi phục máy chủ qua nút "Mô phỏng sự cố (Chaos Engineering)" trên Inspector. Cạnh nối trực quan hóa viền nét đứt đỏ mờ và ngắt hạt packet khi node đích bị sập.
- **S-010 (Level 03: Săn Sale Thời Trang Cuối Tuần - Flash Deals Fashion)**: Bổ sung Màn 3 vào danh mục game với tải đỉnh 4,000 RPS (70% Read, 30% Write), ngân sách $250/tháng, P95 < 120ms và SLA 99.9%. Kịch bản sự cố sập server tự động ở giây 35 minh chứng sức mạnh vượt trội của kiến trúc cụm máy chủ Stateless nhiều node sau Load Balancer so với kiến trúc Single Point of Failure (SPOF).

## 2. What You Can Try Now (Hướng dẫn trải nghiệm trực tiếp)
Khởi chạy ứng dụng: `npm run dev` và mở trình duyệt tại `http://localhost:5173`.

### Trải nghiệm S-009 (Chaos Engineering & Load Balancer Auto Failover):
1. Kéo thả `User Traffic` $\rightarrow$ `Load Balancer` $\rightarrow$ Nối tới 2 máy chủ `App Server 1` và `App Server 2` $\rightarrow$ Nối tiếp tới `PostgreSQL DB`.
2. Bấm **Run** để khởi động dòng tải. Quan sát thấy Load Balancer chia đều 50/50 lưu lượng cho cả 2 máy chủ, các hạt packet bay đều sang 2 nhánh.
3. Click chuột vào `App Server 1` để mở Inspector drawer bên phải.
4. Cuộn xuống phần **Mô phỏng sự cố (Chaos Engineering)** và bấm nút **"🚨 Đánh sập node (Simulate Crash)"**.
5. Quan sát hiệu ứng trực quan:
   - `App Server 1` chuyển trạng thái đỏ rực (Crashed).
   - Cạnh nối từ Load Balancer tới `App Server 1` chuyển sang viền nét đứt đỏ mờ và ngắt toàn bộ hạt packet.
   - Load Balancer tự động dồn 100% lưu lượng sang `App Server 2`.
   - **Throughput duy trì 100%, 0% gói tin bị drop!**
6. Bấm nút **"🔄 Khởi động lại (Recover Server)"** trên Inspector: Server hồi sinh và Load Balancer ngay lập tức tái phân bổ tải đều trở lại.

### Trải nghiệm S-010 (Màn 3: Săn Sale Thời Trang Cuối Tuần):
1. Trên thanh TopBar góc trái, click vào menu **Level Switcher** và chọn **Level 3: Flash Deals**.
2. Đọc đề bài trong **Briefing Modal**: Bối cảnh đợt flash sale 0h00 với 500,000 khách truy cập, tải đỉnh 4,000 RPS (30% Write), ngân sách $250/tháng, P95 < 120ms, SLA 99.9%. Cảnh báo nguy cơ máy chủ bị sập giữa giờ cao điểm!
3. **Thử nghiệm sai lầm (SPOF - 1 Server đơn lẻ)**:
   - Dựng kiến trúc chỉ có 1 App Server: `User Traffic` $\rightarrow$ `App Server (Large $90)` $\rightarrow$ `Redis Cache` $\rightarrow$ `Postgres DB`.
   - Bấm **Run** và chờ hoặc bấm **Thử Spike**. Khi sự cố sập máy chủ diễn ra: Website chết đứng hoàn toàn, 100% request bị từ chối, SLA rơi tự do, nhận **0 Sao**.
4. **Thử nghiệm kiến trúc chuẩn 3★ (Load Balancer + Multi-App Server Stateless)**:
   - Dựng kiến trúc: `User Traffic` $\rightarrow$ `Load Balancer ($25)` $\rightarrow$ 2x `App Server Medium ($45 x 2 = $90)` $\rightarrow$ `Redis Cache ($25)` $\rightarrow$ `PostgreSQL DB ($40)`.
   - Tổng chi phí: **$180/tháng** (tiết kiệm đáng kể so với ngân sách $250).
   - Bấm **Run** và **Thử Spike**: Dù 1 server bốc cháy giữa đợt bùng nổ 4,000 RPS, Load Balancer lập tức failover và server còn lại gánh tải, duy trì SLA >= 99.9%, P95 < 50ms.
   - Bấm **Chấm điểm**: Đạt điểm tuyệt đối **3 Sao (★★★)**!

## 3. Not Finished
Không có. Cả 2 User Stories (S-009 và S-010) đều đã hoàn thành và vượt qua 100% Quality Gates.

## 4. Decisions Waiting For You
Không có quyết định 🔴 High nào đang chờ. Mọi thiết kế đều tuân thủ GDD Tier 2 (Stateless compute & Load Balancing).

## 5. Top Risks
| Mức độ | Rủi ro | Giải pháp thực hiện |
|---|---|---|
| 🟢 Low | Nếu cả 2 server đều sập đồng thời | Load Balancer phản hồi mã lỗi 503 Service Unavailable, ghi nhận tỷ lệ lỗi chính xác |
| 🟢 Low | Tải ghi 30% ở Màn 3 (1,200 RPS) có thể vượt quá công suất DB nếu không nâng cấp | Đã nâng cấp PostgreSQL DB lên 2,000 RPS trong Toolbox |

## 6. Metrics
- **Stories Done**: 2/2 (S-009, S-010). 100% hoàn thành.
- **Average Review Loops**: 1.0 vòng/story.
- **Security Findings**: 0 phát hiện ở cổng DevSecOps (`npm audit` 0 lỗ hổng).
- **Unit Tests**: 44/44 passing (tăng từ 34 lên 44 tests).
