# Threat Model - S-022: Blueprint Preview Modal & Overwrite Safety

Status: Complete
Author: devsecops

## 1. Assets & Surface
- **Canvas State**: Sơ đồ mạng và các cấu hình do người dùng thiết kế.
- **External Untrusted Input**: File `.json` tải lên từ máy tính của người dùng hoặc payload trong URL hash.

## 2. Threat Analysis (STRIDE)
- **Accidental Data Loss (Denial of Service / Tampering)**:
  - *Threat*: Người chơi đang thiết kế một kiến trúc phức tạp nhiều node nhưng vô tình click chọn một file JSON khác trong modal, làm toàn bộ bản vẽ hiện tại bị xóa đè ngay lập tức mà không có cơ hội phục hồi.
  - *Mitigation*: Bổ sung bước đệm xem trước (Preview Stage) và cảnh báo ghi đè khi Canvas có linh kiện (`currentNodesCount > 0`). Yêu cầu xác nhận rõ ràng trước khi `onImport` được kích hoạt.
- **Cross-Site Scripting (XSS) & Injection via Preview**:
  - *Threat*: Kẻ tấn công đặt tên bản vẽ hoặc tên linh kiện chứa mã HTML/Script độc hại (`<img src=x onerror=alert(1)>`) để tấn công XSS khi hiển thị Preview Card.
  - *Mitigation*: Tiếp tục kế thừa bộ lọc `sanitizeString` đã xây dựng ở S-018 trong `blueprintService.ts`. Không sử dụng `dangerouslySetInnerHTML`.

## 3. Security Acceptance Criteria
- [x] Mọi chuỗi hiển thị trong Preview Card đều được escape an toàn bằng React text binding.
- [x] Không tự động ghi đè Canvas mà không qua bước xác nhận người dùng.
