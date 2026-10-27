# Sprint 09 Plan: Âm Thanh Tương Tác, Xem Trước Bản Vẽ & Màn 6 Trò Chuyện Trực Tuyến (Audio FX, Blueprint Preview & Level 06 Chat)

## Sprint Goal
Nâng tầm trải nghiệm cảm giác chơi game (Sensory & Polish) và mở rộng nội dung chiến dịch kiến trúc sang **Tier 3 (Stateful & Real-time Systems)**:
1. Tích hợp **Hệ thống âm thanh tương tác Web Audio Synth** (không cần tải asset ngoài, 0 latency, 0 chi phí lưu trữ) mang lại phản hồi sống động khi nối dây, kích hoạt mô phỏng, cảnh báo quá tải và ăn mừng chiến thắng đạt sao.
2. Bổ sung **Giao diện xem trước bản vẽ (Blueprint Preview & Safety Confirmation)** trong `BlueprintModal`, giúp người chơi thẩm định chi tiết cấu trúc kiến trúc (tên màn, số lượng linh kiện, nhà cung cấp đám mây, chi phí dự toán) và cảnh báo ghi đè an toàn trước khi nạp lên Canvas.
3. Mở rộng chiến dịch với **Màn 6: Ứng Dụng Nhắn Tin Trực Tuyến Toàn Cầu (Level 06: Global Chat App)**, thử thách người chơi giải bài toán 50,000 kết nối WebSocket đồng thời và sử dụng Redis Pub/Sub làm cầu nối đồng bộ tin nhắn giữa các cụm máy chủ.

## Ordered Stories

1. **[S-021: Hệ Thống Âm Thanh Phản Hồi Web Audio Synth & Nút Bật/Tắt Âm Thanh (Web Audio FX & Mute Control)](../stories/S-021-web-audio-synth-sound-effects/story.md)**:
   - Xây dựng module `audioService.ts` sử dụng chuẩn Web Audio API thuần (tổng hợp âm thanh bằng Oscillator & GainNode, không dùng file .mp3/.wav ngoài để giữ kích thước bundle nhẹ và tốc độ tức thì).
   - Thiết kế 4 profile âm thanh đặc trưng phong cách Cyberpunk / Cloud Console:
     - `cable-connect`: Tiếng "click/snap" điện tử thanh gọn khi nối 2 linh kiện.
     - `simulation-start`: Tiếng "hum/glide" tần số tăng dần khi kích hoạt dòng tải.
     - `node-overload`: Tiếng "buzz/beep" cảnh báo khẩn cấp khi linh kiện vượt ngưỡng 90% tải.
     - `victory-fanfare`: Hợp âm thăng hoa rộn ràng khi hoàn thành màn chơi đạt 1-3 sao.
   - Thêm nút chuyển đổi Bật/Tắt âm thanh (Mute/Unmute icon `Volume2`/`VolumeX`) trên TopBar, tự động lưu trạng thái vào `localStorage`.
   - Risk: 🟢 Low.

2. **[S-022: Giao Diện Xem Trước Bản Vẽ Kiến Trúc Trước Khi Nạp (Blueprint Preview Modal & Overwrite Safety)](../stories/S-022-blueprint-preview-overwrite-safety/story.md)**:
   - Nâng cấp `BlueprintModal`: Khi người chơi mở link chia sẻ hoặc chọn file JSON từ máy, hiển thị Card "Xem trước bản vẽ" (Preview Card) trước khi nạp:
     - Tiêu đề bản vẽ & ghi chú kiến trúc.
     - Tên màn chơi tương thích (Target Level) & Đám mây sử dụng (Freestyle / AWS / Azure / GCP).
     - Thống kê chi tiết: Tổng số node, tổng số dây cáp nối, danh mục linh kiện sử dụng và ước tính chi phí $/tháng.
   - Cảnh báo an toàn (Safe Overwrite Warning): Nếu Canvas hiện tại đang có linh kiện chưa lưu, hiển thị nhắc nhở xác nhận ghi đè rõ ràng, tránh mất bản vẽ đang thiết kế dở.
   - Risk: 🟢 Low.

3. **[S-023: Màn 6 - Ứng Dụng Nhắn Tin Trực Tuyến Toàn Cầu (Level 06: Global Chat App - WebSockets & Redis Pub/Sub)](../stories/S-023-level-06-global-chat-app/story.md)**:
   - Thiết kế nội dung Màn 6 theo Game Design Document (Tier 3: Stateful Connection Mesh):
     - Đề bài: Xây dựng hệ thống chat thời gian thực chịu tải 50,000 người dùng trực tuyến (CCU) và 10,000 tin nhắn/giây với độ trễ < 50ms, ngân sách $500/tháng.
     - Thử thách kiến trúc: Phân tách Stateless REST API (đăng nhập, tải lịch sử chat) và Stateful WebSocket Gateway (duy trì kết nối socket lâu dài).
     - Tích hợp linh kiện **Redis Pub/Sub** làm message bus trung gian đồng bộ tin nhắn giữa các cụm server chat khác nhau.
     - Kịch bản sự cố bất ngờ (Incident Trigger): Đứt cáp mạng nội bộ giữa Cụm Chat Server 1 và Server 2, kiểm tra khả năng định tuyến tin nhắn dự phòng.
   - Bổ sung Màn 6 vào danh mục `CAMPAIGN_LEVEL_SEQUENCE` và chuỗi mở khóa tuần tự (yêu cầu đạt $\ge 1★$ ở Màn 5).
   - Risk: 🟡 Med (Bổ sung kịch bản mô phỏng WebSocket persistent connection trong Web Worker).

## What the Stakeholder Will Be Able to Try
1. **Trải nghiệm âm thanh Cyberpunk sống động**:
   - Nối dây giữa 2 node: Nghe tiếng "click" điện tử giòn giã xác nhận kết nối.
   - Bấm nút Play mô phỏng: Cảm nhận âm thanh khởi động dòng tải.
   - Đạt 3 sao ở bảng tính điểm: Nghe chuông hợp âm chiến thắng đầy thỏa mãn.
   - Bấm nút icon Loa trên TopBar để tắt/bật âm thanh bất cứ lúc nào.
2. **Xem trước bản vẽ trước khi nhập (Blueprint Preview)**:
   - Trong modal "Bản vẽ", khi chọn file JSON hoặc bấm link chia sẻ, bạn sẽ thấy bảng thông số tóm tắt: bản vẽ gồm bao nhiêu server, database nào, tốn bao nhiêu USD/tháng trước khi quyết định nạp đè lên Canvas.
3. **Chinh phục thử thách Màn 6 (Global Chat App)**:
   - Mở khóa Màn 6 sau khi vượt qua Màn 5 (Concert Ticket Rush).
   - Thiết kế hệ sinh thái phòng chat thời gian thực quy mô 50,000 kết nối đồng thời với Redis Pub/Sub.
