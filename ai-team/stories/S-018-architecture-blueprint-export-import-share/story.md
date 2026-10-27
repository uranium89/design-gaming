# S-018: Xuất, Nhập & Chia Sẻ Bản Vẽ Kiến Trúc (Architecture Blueprint Export, Import & Shareable Link)

Status: Ready

## User Story
As an architect/player,  
I want to export my canvas architecture to a JSON blueprint, import previously saved blueprints, and share my design via a web link,  
So that I can backup my best architectures, experiment freely across sessions, and share innovative designs with fellow engineers and friends.

## Acceptance Criteria
- [ ] Tính năng Xuất bản vẽ ra file JSON (Export Blueprint):
  - Bổ sung nút hoặc menu "Bản vẽ / Chia sẻ" (icon 📋 hoặc 📤) trên giao diện TopBar hoặc ControlDeck.
  - Khi bấm "Xuất JSON" (Export JSON): Tải xuống file `sysarchitect-blueprint-<levelId>-<timestamp>.json` chứa toàn bộ cấu trúc:
    - Danh sách các Node (id, type, position, empire, properties/config).
    - Danh sách các Edge (id, source, target, animated).
    - Thông tin màn chơi (`levelId`), đế chế đang kích hoạt (`activeEmpire`) và phiên bản schema (`version: 1`).
- [ ] Tính năng Nhập bản vẽ từ file JSON (Import Blueprint):
  - Khi bấm "Nhập JSON" (Import JSON): Cho phép người chơi chọn file `.json` từ máy tính.
  - Xác thực cấu trúc dữ liệu (Validation & Sanitization):
    - Kiểm tra cấu trúc JSON hợp lệ, có mảng `nodes` và `edges`.
    - Loại bỏ hoặc lọc sạch các trường không an toàn (phòng chống XSS / script injection).
  - Khôi phục chính xác các node, thông số cấu hình và dây nối lên Canvas mà không làm crash ứng dụng hoặc Web Worker.
- [ ] Tính năng Chia sẻ qua liên kết web (Shareable Link via URL Hash):
  - Khi bấm "Sao chép liên kết chia sẻ" (Copy Share Link):
    - Nén và mã hóa trạng thái bản vẽ gọn nhẹ (Base64 URL-safe) vào URL hash (ví dụ: `#blueprint=<encoded_data>`).
    - Tự động copy đường link đầy đủ vào Clipboard của người dùng.
    - Hiển thị Toast thông báo: *"Đã sao chép liên kết kiến trúc vào bộ nhớ tạm!"*.
- [ ] Tự động nạp kiến trúc từ URL Hash:
  - Khi người dùng truy cập trang web có chứa tham số hash `#blueprint=...`:
    - Tự động giải mã chuỗi dữ liệu và khôi phục bản vẽ kiến trúc lên Canvas.
    - Hiển thị thông báo Toast chào mừng: *"Đã tải bản vẽ kiến trúc từ liên kết chia sẻ!"*.
    - Nếu chuỗi hash bị lỗi hoặc hỏng, hiển thị thông báo lỗi lịch sự và giữ nguyên trạng thái mặc định an toàn.
- [ ] Tương thích với tất cả 4 Đế Chế (Freestyle, AWS, Azure, GCP) và Chế độ Sandbox.

## Out of Scope
- Backend lưu trữ database tập trung cho short link (dùng 100% Client-side URL Hash để đảm bảo $0 chi phí vận hành).

## Assumptions
- Dữ liệu bản vẽ đồ thị nén đủ nhỏ gọn để vừa giới hạn độ dài thông thường của URL trình duyệt (dưới 4,000 ký tự).

## Acceptance
- **Accepted by**: PENDING
- **Evidence**: PENDING
- **Date**: PENDING
- **Verdict**: PENDING
