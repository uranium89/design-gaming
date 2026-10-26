# Sprint 06 Retrospective: Cải Tiến Thuật Toán Đồ Thị DAG & Kiến Trúc Bất Đồng Bộ

## 1. What Went Well (Điểm Sáng)
- **Kahn's Topological Sort**: Việc chuyển đổi từ BFS truyền thống sang giải thuật sắp xếp topo Kahn trong `engineMath.ts` là một bước đột phá quan trọng. Nó giải quyết triệt để vấn đề phụ thuộc nhiều nhánh (diamond dependency) khi một nút (như Database) vừa nhận lưu lượng trực tiếp từ App Server, vừa nhận lưu lượng từ các Worker Pools bất đồng bộ.
- **Tách biệt Cache và Queue rõ ràng**: Tầng ứng dụng giờ đây phân tách dòng tải hoàn hảo: 90% ghi đi vào Message Queue, 10% đọc đi vào Redis Cache. Không còn hiện tượng tính toán chồng lấn hay sai lệch hit rate.
- **Zero Data Loss Simulation**: Mô phỏng thành công cơ chế đệm tin nhắn thực tế (Traffic Buffering & Leveling) — biến đỉnh nhọn 15,000 RPS tức thời thành dòng chảy êm dịu 4,000 RPS xuống cơ sở dữ liệu.
- **Chất lượng kiểm thử**: Toàn bộ 63 tests chạy trong 1.3 giây, độ ổn định tuyệt đối.

---

## 2. What Went Wrong & Lessons Learned (Bài Học Kinh Nghiệm)
- **Bài học về Cache hit rate khi nhận lưu lượng đã lọc**:
  - *Vấn đề*: Khi App Server đã tách riêng `readPart` gửi cho Cache, Cache không nên nhân lại với `(1 - writeRatio)` một lần nữa.
  - *Giải pháp*: Lưu vết `writeRpsMap` để Cache biết chính xác lượng lưu lượng ghi xuyên thấu (nếu có) và lượng lưu lượng đọc thực sự, từ đó áp dụng 90% hit rate chính xác cho mọi mô hình kiến trúc.
- **Bài học về thứ tự duyệt DAG**:
  - Trong các bài toán mô phỏng hệ thống phân tán, các nút đích có in-degree > 1 (nhận luồng từ nhiều nguồn khác nhau) bắt buộc chỉ được tính toán trạng thái sau khi TẤT CẢ các nút nguồn thượng nguồn đã hoàn thành phát tải. Kahn's Topological Sort là tiêu chuẩn vàng cho đồ thị có hướng không chu trình.

---

## 3. Action Items for Sprint 07 (Đề Xuất Cho Sprint Tiếp Theo)
1. **Màn 6 & Kỹ Thuật Sharding / Database Partitioning**:
   - Khi lưu lượng ghi vượt quá ngưỡng mà một cụm DB Master đơn lẻ có thể lưu trữ hoặc chịu tải bền vững, mở rộng sang kiến trúc phân mảnh dữ liệu (Sharding by User ID / Hash Ring).
2. **Circuit Breaker Pattern (Ngắt Mạch Bảo Vệ)**:
   - Nghiên cứu linh kiện Circuit Breaker hoặc Rate Limiter Gateway để chặn bot và bảo vệ API trước các đợt tấn công từ chối dịch vụ.
