# Sprint 08 Plan: Tiến Trình Mở Khóa Màn Chơi & Chia Sẻ Bản Vẽ Kiến Trúc (Campaign Progression & Blueprint Sharing)

## Sprint Goal
Nâng cấp trải nghiệm game hoàn chỉnh từ phản hồi của Sprint 07: xây dựng **Hệ thống mở khóa màn chơi theo tiến trình (Campaign Level Unlocking Progression)** nhằm tạo tính thử thách và khích lệ người chơi chinh phục từng cấp độ kiến trúc; đồng thời triển khai tính năng **Xuất / Nhập & Chia sẻ bản vẽ kiến trúc (Blueprint Export, Import & Shareable Link)** qua URL hash gọn nhẹ, cho phép lưu trữ và lan tỏa các giải pháp phân tán xuất sắc mà không tốn chi phí máy chủ.

## Ordered Stories
1. **[S-017: Hệ Thống Mở Khóa Màn Chơi Theo Tiến Trình & Quản Lý Dữ Liệu Chơi (Campaign Level Unlocking Progression & Reset)](../stories/S-017-campaign-level-unlocking-progression/story.md)**:
   - Level 1 và Sandbox Mode luôn mở sẵn; Level 2 đến Level 5 tự động mở khóa tuần tự khi người chơi đạt ít nhất 1 sao ($\ge 1★$) ở màn trước.
   - Trực quan hóa ổ khóa `🔒` trên dropdown chọn màn chơi, vô hiệu hóa click chọn các màn chưa mở khóa và hiển thị tooltip hướng dẫn mở khóa.
   - Cơ chế tự động mở khóa màn tiếp theo ngay khi nhận sao tại `ScoreModal`.
   - Cung cấp nút "Đặt lại tiến trình" (Reset Progress) kèm hộp thoại xác nhận an toàn.
   - Risk: 🟢 Low.

2. **[S-018: Xuất, Nhập & Chia Sẻ Bản Vẽ Kiến Trúc (Architecture Blueprint Export, Import & Shareable Link)](../stories/S-018-architecture-blueprint-export-import-share/story.md)**:
   - Menu thao tác Bản vẽ (Blueprint): Export JSON, Import JSON, Copy Share Link.
   - Xuất toàn bộ cấu trúc Canvas (nodes, edges, properties, active empire, level context) ra file `.json` chuẩn hóa.
   - Nhập file `.json` bản vẽ với lớp xác thực & lọc mã độc (Sanitization) nghiêm ngặt trước khi tải lên Canvas.
   - Tạo link chia sẻ nén (Base64 URL Hash `#blueprint=...`), copy vào clipboard và tự động phục hồi bản vẽ khi người dùng mở liên kết.
   - Tương thích 100% với cả 4 Đế Chế (Freestyle, AWS, Azure, GCP) và Chế độ Sandbox.
   - Risk: 🟢 Low.

## What the Stakeholder Will Be Able to Try
1. **Trải nghiệm chiến dịch mở khóa (Campaign Progression)**:
   - Khi vào game với tài khoản mới hoặc sau khi ấn "Reset Progress", chỉ có Level 1 và Sandbox mở sẵn.
   - Thử click vào Level 2, 3, 4, 5: Nhìn thấy biểu tượng ổ khóa `🔒` và thông báo *"Cần đạt ít nhất 1★ ở Màn trước để mở khóa"*.
   - Hoàn thành Level 1 đạt từ 1 đến 3 sao: Quan sát Level 2 lập tức được mở khóa và có thể click chơi ngay!
   - Nút "Reset Progress" (🔄) cho phép xóa sạch thành tích và chơi lại từ đầu một cách dễ dàng.
2. **Xuất, nhập và chia sẻ bản vẽ kiến trúc (Blueprint Sharing)**:
   - Lắp ráp một hệ thống phân tán bất kỳ (ví dụ: cụm AWS Microservices hoặc GCP Spanner).
   - Bấm **"Xuất JSON"**: Tải file blueprint về máy tính để lưu trữ dự phòng.
   - Bấm **"Sao chép liên kết chia sẻ"**: Nhận link URL chứa toàn bộ bản vẽ nén gọn.
   - Mở link đó trên một tab ẩn danh (Incognito) hoặc gửi cho người khác: Trang web tự động nạp chính xác 100% các node, đường dây cáp và cấu hình đã thiết kế!
   - Bấm **"Nhập JSON"**: Tải file blueprint đã lưu trước đó lên lại Canvas mượt mà.
