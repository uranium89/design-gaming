# Sprint 02 Plan: Flow Visualization & Playable Level 1

- **Sprint Goal**: Hoàn thiện trực quan hóa dòng hạt lưu lượng (packet flow) 60 FPS di chuyển trên dây nối và phát hành màn chơi hoàn chỉnh đầu tiên (Level 01: The Bakery) với đầy đủ kịch bản sự cố và chấm điểm 1-3 sao.
- **Trạng thái**: In Progress (Approved)

## Danh sách User Stories trong Sprint 02

| Thứ tự | Mã Story | Tiêu đề | Trạng thái | Điểm cốt lõi |
|---|---|---|---|---|
| 1 | S-004 | [Particle Visualizer](../stories/S-004-packet-particle-visualizer/story.md) | Ready | Dòng hạt packet màu sắc (xanh/vàng/đỏ) bay trên dây nối ở 60 FPS |
| 2 | S-005 | [Level 01: The Bakery](../stories/S-005-level-01-the-bakery/story.md) | Ready | Đề bài, ràng buộc tải, sự cố spike 120 RPS, tính điểm và trao 1-3 sao |

## Những gì Stakeholder có thể trải nghiệm sau Sprint 02
1. Tận mắt nhìn thấy dòng hạt request bay liên tục từ User Traffic qua Load Balancer, App Server và Database. Khi quá tải hoặc có lỗi, các hạt sẽ đổi sang màu đỏ rực hoặc rơi rụng.
2. Trải nghiệm trọn vẹn màn chơi đầu tiên: Đọc đề bài, tìm cách dựng kiến trúc tối ưu ngân sách $35, bấm chạy, đối mặt với sự cố khách ập vào đột biến lúc tiệm bánh lên mạng xã hội, và nhận tổng kết xếp hạng 1-3 sao.
