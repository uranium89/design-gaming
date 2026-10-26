# Sprint 07 Retrospective

## What Went Well
1. **Hoàn thiện trọn vẹn tầm nhìn Game Design Document**:
   - Hệ thống 4 Đế Chế Đám Mây (Freestyle, AWS, Azure, GCP) được triển khai đầy đủ với nhận diện màu sắc, công suất và chi phí chuẩn xác.
   - Chế độ Sandbox mở ra sân chơi không giới hạn cho người chơi tự do thử nghiệm các kiến trúc cao cấp.
   - Hệ thống Star Tracking qua `localStorage` giúp trò chơi có tính lưu giữ và khích lệ người chơi chinh phục lại các màn chơi để đạt 3 sao.
2. **Khả năng tương thích ngược tuyệt đối**:
   - Mặc dù thay đổi cấu trúc danh mục linh kiện theo 4 tabs đám mây, toàn bộ 13 test suite trước đó vẫn tiếp tục pass 100% không phát sinh lỗi hồi quy.
3. **Hiệu năng & Trải nghiệm**:
   - Web Worker xử lý mượt mà cả khi đẩy tải Sandbox lên 50,000 RPS.
   - Giao diện Clean Dark Console giữ được độ tinh tế, hiện đại và tính thẩm mỹ cao.

## What Could Be Improved
1. **Tự động mở khóa màn chơi (Level Unlocking Progression)**:
   - Hiện tại tất cả 5 màn chơi đều mở sẵn để người chơi tự do chọn. Ở các sprint tiếp theo có thể cân nhắc thêm cơ chế khóa màn chơi (cần đạt ít nhất 1 sao ở màn trước để mở khóa màn sau) nhằm tăng tính thử thách cho game.
2. **Chia sẻ kiến trúc (Architecture Share URL)**:
   - Trong chế độ Sandbox, người chơi có thể muốn chia sẻ bản vẽ kiến trúc của mình với người khác qua URL mã hóa Base64 hoặc xuất file JSON.

## Proposed Rule Changes
- Không cần thay đổi rule. Quy trình Scrum và pipeline User Story tiếp tục vận hành cực kỳ hiệu quả.
