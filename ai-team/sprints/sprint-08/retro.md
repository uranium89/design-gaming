# Sprint 08 Retrospective

## What Went Well
1. **Giải quyết triệt để 2 vấn đề tồn đọng từ Sprint 07**:
   - Hệ thống mở khóa tuần tự mang lại tính game hóa (gamification) rõ nét, tạo động lực người chơi vượt từng màn trước khi tiếp cận các màn phân tán phức tạp hơn.
   - Cơ chế chia sẻ kiến trúc bằng URL Hash hoạt động hoàn toàn ở phía client ($0 chi phí máy chủ), nén gọn gàng và tự động khôi phục bản vẽ khi mở link.
2. **Bảo mật và an toàn dữ liệu cao**:
   - Dù nhận dữ liệu ngoại lai từ URL hash và file JSON người dùng tải lên, dịch vụ `blueprintService.ts` đã chặn đứng nguy cơ XSS, bẫy Prototype Pollution và chống DoS payload lớn với 100% tests kiểm chứng.
3. **Chất lượng kiểm thử & Tốc độ chuyển giao**:
   - Thêm 2 test suites mới (`campaignProgression.test.tsx` và `blueprintSharing.test.tsx`), nâng tổng số test lên **96 tests** (tăng 21 tests) với tỷ lệ pass 100%.
   - Build production hoàn tất siêu nhanh (155ms).

## What Could Be Improved
1. **Âm thanh và hiệu ứng phản hồi (Audio & Micro-interactions)**:
   - Khi mở khóa màn chơi mới hoặc sao chép thành công link kiến trúc, việc bổ sung hiệu ứng âm thanh nhỏ (chime sound / click sound) theo GDD Mục 7.3 sẽ làm tăng thêm trải nghiệm thỏa mãn cho người chơi.
2. **Xem trước (Preview) bản vẽ trước khi Nạp**:
   - Trong `BlueprintModal`, khi người chơi chọn một file JSON, có thể hiển thị trước một thumbnail hoặc thông tin tóm tắt (số node, tên màn, đế chế) trước khi họ bấm nút xác nhận nạp đè lên Canvas hiện tại.

## Proposed Rule Changes
- Không cần thay đổi rule. Quy trình Scrum tiếp tục vận hành chuẩn xác và kỷ luật.
