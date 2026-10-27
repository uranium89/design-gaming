# Sprint 09 Retrospective

## What Went Well
1. **Trải nghiệm cảm xúc & thính giác (Audio UX)**:
   - Web Audio API thuần chứng minh tính hiệu quả vượt bậc: không cần bất kỳ file media ngoài nào, dung lượng 0KB, không lo bản quyền hay trễ mạng.
   - Các hiệu ứng âm thanh tổng hợp mang lại cảm giác chân thực như đang thao tác trên một bảng điều khiển trung tâm thực thụ.
2. **An toàn người dùng khi nạp bản vẽ**:
   - Preview Card và cảnh báo ghi đè giải quyết hoàn toàn lo lắng của người chơi về việc mất mát bản vẽ đang thiết kế dở khi chia sẻ hoặc mở file người khác.
3. **Mở rộng nội dung chiến dịch (Tier 3)**:
   - Màn 6 mở ra một bài toán kinh điển trong System Design (WebSocket Persistent Gateway + Redis Pub/Sub), nâng tầm giá trị giáo dục của game lên một bậc mới.
4. **Chất lượng kiểm thử & Quy trình Scrum**:
   - Tổng số unit test vượt mốc **113 tests** trên 20 test suite, pass 100%.
   - Tuân thủ kỷ luật quy trình Scrum nghiêm ngặt.

## What Could Be Improved
1. **Chế độ Hướng Dẫn Từng Bước (Interactive Tutorial / Walkthrough Mode)**:
   - Đối với người chơi mới tiếp cận lần đầu ở Màn 1, việc có một tooltip hoặc mũi tên hướng dẫn kéo thả node đầu tiên và nối dây cáp đầu tiên sẽ giúp họ làm quen nhanh hơn nữa.
2. **Bảng Xếp Hạng Toàn Cầu (Global Leaderboard / Offline Best Scores)**:
   - Sau khi hoàn thành Màn 6, người chơi có thể muốn xem bảng thành tích điểm số cao nhất của mình ở từng màn (High Score Board) hoặc so sánh với kỷ lục thiết kế tối ưu nhất.

## Proposed Rule Changes
- Không cần thay đổi rule. Quy trình Scrum tiếp tục vận hành chuẩn xác và hiệu quả.
