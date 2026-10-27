# Sprint 08 Review: Tiến Trình Mở Khóa Màn Chơi & Chia Sẻ Bản Vẽ Kiến Trúc (Campaign Progression & Blueprint Sharing)

## 1. Sprint Goal Met?
**Yes.**  
Toàn bộ mục tiêu Sprint 08 đã hoàn thành xuất sắc 100%. Game đã hoàn thiện hai trải nghiệm cốt lõi theo đề xuất cải tiến của Sprint 07:
1. **Chiến Dịch Mở Khóa Màn Chơi (Campaign Level Unlocking Progression)**:
   - Các màn chơi được khóa tuần tự (màn sau yêu cầu đạt tối thiểu 1 sao ở màn trước).
   - Màn 1 và Sandbox Mode luôn mở sẵn cho người chơi tự do sáng tạo.
   - Thêm nút "Đặt lại" (Reset Progress) kèm hộp thoại xác nhận an toàn giúp người chơi có thể chơi lại từ đầu.
2. **Xuất / Nhập & Chia Sẻ Bản Vẽ Kiến Trúc (Architecture Blueprint Sharing)**:
   - Hỗ trợ xuất file bản vẽ JSON (`.json`) để sao lưu cục bộ vào máy tính.
   - Hỗ trợ nhập file JSON bản vẽ với lớp xác thực và lọc mã độc (XSS & prototype pollution) nghiêm ngặt.
   - Nút "Sao chép liên kết" nén bản vẽ vào URL hash (`#blueprint=...`), cho phép chia sẻ thiết kế hệ thống qua link web và tự động khôi phục bản vẽ khi mở link.

---

## 2. What You Can Try Now (Trải Nghiệm Thực Tế)
1. **Khởi chạy ứng dụng**:
   - Chạy `npm run dev` trên terminal và mở `http://localhost:5173/`.
2. **Trải nghiệm Chiến dịch Mở khóa Màn chơi**:
   - Bấm vào menu chọn màn chơi trên TopBar:
     - Quan sát Màn 1 (`Level 1: The Bakery`) và `Sandbox Mode` mở sẵn.
     - Các màn từ 2 đến 5 hiển thị ổ khóa `🔒` kèm điều kiện mở khóa (ví dụ: `🔒 Level 2: Tech News (Cần 1★ ở Màn 1)`).
     - Thử chọn màn bị khóa: Trình duyệt ngăn không cho chọn màn bị khóa.
   - Hoàn thành thiết kế Màn 1, bấm **Chấm điểm** để đạt từ 1★ đến 3★ -> Mở lại dropdown, Màn 2 đã được tự động mở khóa ngay lập tức!
   - Bấm nút **"Đặt lại"** (icon 🔄) trên TopBar -> Xác nhận đặt lại -> Toàn bộ tiến trình được xóa sạch và đưa về Màn 1.
3. **Trải nghiệm Xuất, Nhập & Chia sẻ Bản vẽ (Blueprint Modal)**:
   - Trên thanh TopBar, bấm nút **"Bản vẽ"** (icon 🔗 `Share2` cạnh nút "Đề bài").
   - Hộp thoại Bản Vẽ Kiến Trúc hiện lên với 3 chức năng:
     - **Sao chép liên kết chia sẻ**: Bấm nút "Sao chép" -> Nút chuyển sang "Đã chép! ✓" màu xanh lá. Dán đường link này sang một tab trình duyệt khác để thấy toàn bộ hệ thống được khôi phục ngay lập tức!
     - **Xuất JSON**: Bấm "Tải xuống .json" để lưu file bản vẽ về máy tính.
     - **Nhập JSON**: Bấm "Chọn file JSON" để tải file bản vẽ lên Canvas bất kỳ lúc nào.

---

## 3. Not Finished
- Không có story nào bị trễ hoặc tồn đọng. Cả 2 stories S-017 và S-018 đều đã hoàn thành và vượt qua 100% Quality Gates.

---

## 4. Decisions Waiting For You
- Không có decision brief nào ở trạng thái `PENDING`.

---

## 5. Top Risks
| Mức độ | Rủi ro | Tác động kinh doanh | Biện pháp xử lý |
|---|---|---|---|
| 🟢 Low | Người dùng tải lên file JSON độc hại hoặc chỉnh sửa hash | Gây lỗi crash UI hoặc chèn mã độc | Đã triển khai bộ lọc XSS, kiểm tra cấu trúc schema và giới hạn dung lượng < 250KB |
| 🟢 Low | Người chơi bấm nhầm nút Reset Progress | Mất toàn bộ số sao đã chơi | Đã cài đặt hộp thoại xác nhận trước khi xóa dữ liệu `localStorage` |

---

## 6. Metrics
- **Stories Done**: 2 / 2 (100% hoàn thành).
- **Average Review Loops**: 1.0 loop/story.
- **Security Findings Blocked**: 0 (Tất cả quét SAST, gitleaks, audit đều PASS).
- **Test Suite Coverage**: 17 test suites, **96 tests pass 100%**.
- **Production Build Time**: 155ms.
