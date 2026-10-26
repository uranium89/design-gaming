# Sprint 05 Review: Database Read Replicas, Read/Write Splitting & Level 04 (Global TinyURL)

## 1. Sprint Goal Met?
**Yes.** Sprint 05 đã hoàn thành 100% mục tiêu đề ra:
- **S-011 (Phân tách Đọc/Ghi & Linh kiện Database Read Replica)**: 
  - Bổ sung linh kiện **Database Read Replica** ($25/tháng, công suất 1,500 RPS, độ trễ 10ms, nhận diện màu xanh lam cyan) vào danh mục Storage.
  - Xây dựng thuật toán phân tách luồng dữ liệu Đọc/Ghi (Read/Write Splitting) tự động trong bộ mô phỏng: 100% lưu lượng Ghi (`writeTraffic`) được định tuyến độc quyền vào PostgreSQL Master DB; toàn bộ lưu lượng Đọc (`readTraffic`) được chia đều cho các Read Replicas.
  - Hỗ trợ cơ chế tự phục hồi suy giảm nhẹ nhàng (Graceful Degradation): Khi toàn bộ Read Replicas bị sự cố, luồng đọc tự động chuyển tiếp ngược về Master DB để giữ hệ thống không bị gián đoạn.
  - Component Inspector tích hợp nhãn nhận diện `"Read-Only Replica"` và đo đạc tải thực tế của từng replica.
- **S-012 (Màn 4: Dịch Vụ Rút Gọn Link Toàn Cầu & Xử lý Hot Key)**:
  - Bổ sung Màn 4 hoàn chỉnh với bối cảnh hệ thống URL Shortener toàn cầu chịu tải đỉnh 8,000 RPS (tỉ lệ 20:1, 95% Read, 5% Write), ngân sách $350/tháng, P95 < 70ms và SLA 99.9%.
  - Tích hợp sự cố bùng nổ bất ngờ **Chaos Hot Key Event** (10,000 RPS dồn vào một liên kết viral): Minh chứng tầm quan trọng sống còn của tầng đệm In-Memory Redis Caching kết hợp với Database Read Replicas để triệt tiêu bài toán cạn kiệt connection pool cơ sở dữ liệu.
  - Kiến trúc tham khảo đạt điểm tuyệt đối **3 Sao (★★★)** với chi phí chỉ **$275/tháng** (tiết kiệm hơn 20% so với trần ngân sách $350).
- **Cải tiến nền tảng (DAG Path Latency Engine)**:
  - Nâng cấp cơ chế tính toán độ trễ P95 sang mô hình đường đi đồ thị vật lý (Physical DAG Path Latency) thay vì cộng dồn tuần tự tất cả các node được duyệt. Nhờ đó, các cụm máy chủ và replica chạy song song phản ánh chính xác độ trễ thực tế của hệ thống phân tán.

## 2. What You Can Try Now (Hướng dẫn trải nghiệm trực tiếp)
Khởi chạy ứng dụng: `npm run dev` và mở trình duyệt tại `http://localhost:5173`.

### Trải nghiệm S-011 (Linh kiện Database Read Replica & Read/Write Splitting):
1. Kéo thả `User Traffic` $\rightarrow$ `App Server (VM)` $\rightarrow$ Nối tới `PostgreSQL DB` (Master) và kéo thêm 2 node `Database Read Replica` nối từ App Server.
2. Bấm **Run**: Quan sát các cạnh nối:
   - Cạnh nối tới `PostgreSQL DB` chỉ gánh lưu lượng Ghi (Write traffic).
   - Cạnh nối tới 2 node `Database Read Replica` chia đều 50/50 lưu lượng Đọc (Read traffic).
3. Click vào 1 node `Database Read Replica` để mở Inspector: Thấy nhãn xanh `"Read-Only Replica"` và công suất 1,500 RPS.
4. Bấm nút **"🚨 Đánh sập node"** trên cả 2 Read Replicas: Quan sát thấy lưu lượng đọc tự động fallback dồn về Master DB!

### Trải nghiệm S-012 (Màn 4: Dịch Vụ Rút Gọn Link Toàn Cầu & Xử lý Hot Key):
1. Trên thanh TopBar góc trái, click vào menu **Level Switcher** và chọn **Level 4: TinyURL**.
2. Đọc đề bài trong **Briefing Modal**: Bối cảnh dịch vụ URL Shortener với 10 triệu link lưu trữ, tải đỉnh 8,000 RPS (95% Read), ngân sách $350/tháng, P95 < 70ms, SLA 99.9%. Cảnh báo sự kiện viral Hot Key 10,000 RPS!
3. **Thử nghiệm sai lầm (Không có Caching - Bắn thẳng vào Replicas)**:
   - Dựng kiến trúc: `Load Balancer` $\rightarrow$ 3x `App Server` $\rightarrow$ Nối thẳng tới `PostgreSQL Master` và 2 `Read Replicas` (không dùng Redis).
   - Bấm **Run** và chờ tới đợt bùng nổ Hot Key (giây 35): 9,500 RPS đọc dồn thẳng vào 2 Read Replicas (vốn chỉ có tổng công suất 3,000 RPS). Cụm Replicas lập tức chuyển trạng thái Đỏ (Overloaded), hàng nghìn request bị drop, độ trễ vọt lên cao, nhận **0-1 Sao**.
4. **Thử nghiệm kiến trúc chuẩn 3★ (Load Balancer + Multi-App Server + Redis Cache + Read/Write Splitting)**:
   - Bấm nút **"Nạp kiến trúc mẫu (Load Reference)"** hoặc tự dựng:
     `User Traffic` $\rightarrow$ `Load Balancer ($25)` $\rightarrow$ 3x `App Server Medium ($135)` $\rightarrow$ `Redis Cache ($25)` $\rightarrow$ Nối tới `PostgreSQL Master ($40)` và 2x `Database Read Replica ($50)`.
   - Tổng chi phí hạ tầng: **$275/tháng** (nằm gọn trong ngân sách $350).
   - Bấm **Run**:
     - Khi tải đạt 8,000 RPS: Redis Cache hấp thụ 90% lượt đọc (6,840 RPS). 400 RPS ghi được chuyển về Master DB, và 760 RPS miss được chia sẻ nhẹ nhàng cho 2 Read Replicas (380 RPS mỗi replica).
     - Khi sự cố Hot Key 10,000 RPS bùng nổ: Redis Cache lập tức gánh 8,550 RPS tại độ trễ 1ms, bảo vệ tuyệt đối cụm Database phía sau, không làm mất bất kỳ gói tin nào!
   - Bấm **Chấm điểm**: Đạt điểm tối đa **3 Sao (★★★)**!

## 3. Not Finished
Không có. Cả 2 User Stories (S-011 và S-012) đều đã hoàn thành 100% Acceptance Criteria và vượt qua mọi Quality Gates.

## 4. Decisions Waiting For You
Không có quyết định 🔴 High nào đang chờ. Mọi thiết kế đều tuân thủ các quy tắc bảo mật và kiến trúc trong GDD Tier 2.

## 5. Top Risks
| Mức độ | Rủi ro | Giải pháp thực hiện |
|---|---|---|
| 🟢 Low | Tải bùng nổ viral Hot Key tập trung vào 1 liên kết | Kiến trúc định hướng Redis In-Memory Cache đặt trước Database Read Replicas để hấp thụ 90%+ lưu lượng đọc tức thời |
| 🟢 Low | Sự cố sập toàn bộ cụm Read Replicas | Thuật toán trong `engineMath.ts` tự động định tuyến dự phòng (graceful fallback) toàn bộ lưu lượng đọc về Master DB |

## 6. Metrics
- **Stories Done**: 2/2 (S-011, S-012). 100% hoàn thành.
- **Average Review Loops**: 1.0 vòng/story.
- **Security Findings**: 0 phát hiện ở cổng DevSecOps (`npm audit` 0 lỗ hổng).
- **Unit Tests**: 54/54 passing (tăng từ 44 lên 54 tests trên 11 test suites).
- **Production Build**: Biên dịch sạch và vượt qua kiểm tra kiểu dữ liệu trong 166ms.
