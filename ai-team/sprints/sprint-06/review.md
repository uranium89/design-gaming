# Sprint 06 Review: Kiến Trúc Hàng Đợi Bất Đồng Bộ & Màn 5 (Ticket Rush)

## 1. Sprint Goal Met?
**Yes.**  
Toàn bộ mục tiêu Sprint 06 đã hoàn thành xuất sắc 100%. Game đã trang bị đầy đủ cặp linh kiện kinh điển của kiến trúc hướng sự kiện: **Message Queue (RabbitMQ)** và **Worker Pool (Async Consumer)**, thuật toán DAG được nâng cấp lên **Kahn's Topological Sort**, và bổ sung **Màn 5: Săn Vé Concert Black Friday** giải quyết bài toán chống sập Database khi đối mặt với cơn bão 15,000 RPS ghi (90% Write Traffic) với chuẩn Zero Data Loss.

---

## 2. What You Can Try Now (Trải Nghiệm Thực Tế)
1. **Khởi chạy ứng dụng**:
   - Chạy `npm run dev` trên trình duyệt tại `http://localhost:5173/`.
2. **Khám phá linh kiện mới trên SidebarDock**:
   - Kéo linh kiện **`Message Queue (RabbitMQ)`** ($40/tháng, 30,000 RPS, 5ms, icon `Layers` màu hổ phách/cam).
   - Kéo linh kiện **`Worker Pool (Async Consumer)`** ($30/tháng, 2,000 RPS, 15ms, icon `Cpu` màu tím).
   - Chọn từng linh kiện để xem thông số và badge nhận diện trong **Component Inspector** (`"Message Queue (FIFO)"` và `"Async Consumer"`).
3. **Thử thách Màn 5 - Săn Vé Concert Black Friday (Concert Ticket Rush)**:
   - Trên thanh TopBar, chọn `Level 5: Ticket Rush`.
   - Bấm nút **"Đề bài"** để xem bối cảnh: 50,000 vé mở bán lúc 00:00, 15,000 fan cuồng đồng loạt ấn ĐẶT VÉ (90% Write).
   - **Thử nghiệm sai lầm (Anti-pattern)**: Nối Server trực tiếp vào Master DB. Bấm **"Run"** -> DB bị dội 13,650 RPS và quá tải nghiêm trọng, rớt hơn 7,650 đơn hàng (đánh giá 0-1 sao).
   - **Thử nghiệm chuẩn 3★**: Bấm **"Kiến trúc mẫu"** để nạp hệ thống hướng sự kiện:
     - 1 Load Balancer ($25)
     - 2 App Servers Medium ($90)
     - 1 Redis Cache ($25) phục vụ 10% tra cứu vé
     - 1 Message Queue ($40) đệm 13,500 RPS ghi mà không rớt gói
     - 2 Worker Pools ($60) san phẳng dòng tải thành 4,000 RPS ghi
     - 1 PostgreSQL Master DB ($40) tiếp nhận dòng ghi 4,000 RPS ổn định
     - Tổng chi phí: **$280/tháng** (tiết kiệm hơn mức trần $400/tháng và đạt chuẩn tối đa $320/tháng).
   - Bấm **"Chấm điểm"** -> Đạt **3 Sao tuyệt đối** (Điểm số >= 850, Throughput 15,000 RPS, Zero Data Loss, SLA 100%).

---

## 3. Not Finished
- Không có story nào bị trễ hoặc tồn đọng. Cả 2 stories S-013 và S-014 đều đã hoàn thành và qua toàn bộ Quality Gates.

---

## 4. Decisions Waiting For You
- Không có decision brief nào ở trạng thái `PENDING`.

---

## 5. Top Risks
| Mức độ | Rủi ro | Tác động kinh doanh | Biện pháp xử lý |
|---|---|---|---|
| 🟢 Low | Dung lượng bộ nhớ đệm hàng đợi (RAM/Disk) | Nếu hàng đợi chạy quá lâu mà không có worker tiêu thụ, RAM queue có thể đầy | Đã quy định công suất đệm chuẩn 30,000 RPS và kiểm soát qua Worker Pool rate-limiting |
| 🟢 Low | Phức tạp trong đồ thị DAG nhiều nhánh | Các kết nối song song và phân tách đọc/ghi có thể gây thứ tự duyệt không đúng | Đã thay thế BFS ngây thơ bằng thuật toán sắp xếp topo Kahn (Kahn's Topological Sort) chính xác 100% |

---

## 6. Metrics
- **Stories Done**: 2 / 2 (100% hoàn thành).
- **Average Review Loops**: 1.0 loop/story (Tất cả stories đều đạt APPROVED ngay ở loop 1).
- **Security Findings Blocked**: 0 (Tất cả quét bảo mật đều PASS).
- **Test Suite Coverage**: 13 test suites, **63 tests pass 100%**.
- **Production Build Time**: 168ms.
