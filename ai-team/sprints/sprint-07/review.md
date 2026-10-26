# Sprint 07 Review: 4 Đế Chế Đám Mây (Cloud Empires) & Chế Độ Sandbox Lưu Trữ Tiến Trình

## 1. Sprint Goal Met?
**Yes.**  
Toàn bộ mục tiêu Sprint 07 đã hoàn thành xuất sắc 100%. Game đã giải quyết triệt để yêu cầu cốt lõi của Game Design Document:
1. **Hệ thống 4 Đế Chế Đám Mây (Cloud Empires)**: Cho phép chuyển đổi mượt mà giữa 🌐 **Freestyle (Mã nguồn mở/Tự host)**, 🟧 **AWS (Amazon Web Services)**, 🟦 **Azure (Microsoft Azure)**, và 🟥 **GCP (Google Cloud Platform)** với đầy đủ linh kiện, nhận diện thương hiệu, chi phí và công suất đặc trưng.
2. **Chế Độ Sandbox (Tự Do Thiết Kế)**: Mở rộng không giới hạn ngân sách (`∞ /mo`), tích hợp thanh điều khiển lưu lượng ảo (Virtual Traffic Injector) từ 100 đến 50,000 RPS.
3. **Lưu Trữ Tiến Trình Chơi (Star Tracking)**: Tự động lưu sao và điểm số của từng màn chơi vào browser `localStorage`, hiển thị trực quan các sao đạt được (`⭐⭐⭐`) trên dropdown TopBar.

---

## 2. What You Can Try Now (Trải Nghiệm Thực Tế)
1. **Khởi chạy ứng dụng**:
   - Chạy `npm run dev` trên trình duyệt tại `http://localhost:5173/`.
2. **Khám phá 4 Đế Chế Đám Mây trên SidebarDock**:
   - Ở đầu thanh công cụ bên trái, bấm vào 4 tab đế chế:
     - 🌐 **Freestyle**: Nginx LB ($25), Linux VM ($20), Redis Cache ($25), PostgreSQL Master ($40), Read Replica ($25), RabbitMQ ($40), Worker Pool ($30).
     - 🟧 **AWS**: AWS ALB ($25), AWS EC2 t4g.large ($48), AWS ElastiCache ($85), Amazon Aurora / RDS PG ($120), AWS DynamoDB ($30), AWS SQS ($5), AWS Lambda ($35).
     - 🟦 **Azure**: Azure App Gateway ($35), Azure VM B2ms ($45), Azure Cache for Redis ($60), Azure Database for PostgreSQL ($90), Azure Cosmos DB ($60), Azure Service Bus ($20), Azure Container App Worker ($35).
     - 🟥 **GCP**: GCP Cloud LB ($22), GCP Cloud Run ($40), GCP Cloud Memorystore ($50), GCP Cloud SQL ($80), GCP Cloud Spanner ($200), GCP Cloud Pub/Sub ($15), GCP Cloud Functions ($30).
   - Kéo linh kiện của từng đế chế ra Canvas -> Quan sát các badge thương hiệu (`AWS`, `AZURE`, `GCP`, `FOSS`) ở góc trên mỗi card và trong panel Inspector.
   - Bạn có thể xây dựng kiến trúc thuần một đám mây (ví dụ 100% AWS) hoặc tự do kết hợp đa đám mây (Hybrid Multi-cloud)!
3. **Trải nghiệm Chế Độ Sandbox (Tự Do Thiết Kế)**:
   - Trên thanh TopBar, mở menu chọn màn chơi và chọn **`Sandbox Mode`** (icon 🛠️).
   - Quan sát trần ngân sách: **`∞ /mo`** (không giới hạn chi phí).
   - Sử dụng 2 thanh trượt ảo trên TopBar:
     - **Thanh trượt Tải (RPS)**: Kéo từ 100 RPS đến 50,000 RPS.
     - **Thanh trượt Tỉ lệ Ghi (Write %)**: Kéo từ 0% đến 100% Write.
   - Bấm **Run** để kiểm tra khả năng chịu tải của các kiến trúc siêu quy mô.
4. **Kiểm tra Lưu Trữ Sao & Tiến Trình**:
   - Chọn Màn 1 đến Màn 5, thiết kế và bấm **Chấm điểm**.
   - Khi hoàn thành đạt sao (1★, 2★, 3★), điểm số được lưu tự động vào `localStorage` (`sysarchitect_progress_v1`).
   - Mở dropdown Level Selector: Các sao đạt được sẽ xuất hiện ngay cạnh tên từng màn (ví dụ: `Level 1: The Bakery ⭐⭐⭐`).
   - Tải lại trang (F5 / Refresh) -> Toàn bộ sao và thành tích đã đạt được vẫn được giữ nguyên vẹn!

---

## 3. Not Finished
- Không có story nào bị trễ. Cả 2 stories S-015 và S-016 đều đã hoàn thành và qua toàn bộ Quality Gates.

---

## 4. Decisions Waiting For You
- Không có decision brief nào ở trạng thái `PENDING`.

---

## 5. Top Risks
| Mức độ | Rủi ro | Tác động kinh doanh | Biện pháp xử lý |
|---|---|---|---|
| 🟢 Low | Người chơi chỉnh sửa dữ liệu localStorage | Dữ liệu tiến trình không hợp lệ có thể gây crash parser | Đã cài đặt cơ chế tự phục hồi và fallback an toàn trong `loadProgress()` |
| 🟢 Low | Tải cực lớn ở Sandbox (50,000 RPS) | Gây giật lag UI | Toàn bộ phép tính mô phỏng chạy trên Web Worker độc lập, UI đạt 60 FPS mượt mà |

---

## 6. Metrics
- **Stories Done**: 2 / 2 (100% hoàn thành).
- **Average Review Loops**: 1.0 loop/story.
- **Security Findings Blocked**: 0 (Tất cả quét bảo mật đều PASS).
- **Test Suite Coverage**: 15 test suites, **75 tests pass 100%**.
- **Production Build Time**: 175ms.
