# Sprint 04 Retrospective

- **Date**: 2026-10-26
- **Facilitator**: Reviewer
- **Sprint**: Sprint 04 (S-009, S-010)

## 1. What Went Well
- **Kỷ luật Scrum nhất quán**:
  - Mỗi thay đổi đều bắt đầu từ User Story, Acceptance Criteria, Spec, UI Spec, Impl Notes, Test Result, UI Review, Security Scan, và Review.
  - Không có tình trạng sửa code tự do hay bỏ qua kiểm thử.
- **Tính năng Chaos Engineering độc đáo**:
  - Nút "Mô phỏng sự cố (Chaos Engineering)" trên Inspector mang lại giá trị trải nghiệm rất cao cho người học System Design, cho phép "thử lửa" hệ thống bất kỳ lúc nào để xem Load Balancer phản ứng ra sao.
- **Mở rộng Màn chơi mượt mà**:
  - Việc tích hợp Level 3 vào cấu trúc `ALL_LEVELS` diễn ra trơn tru, không làm gãy vỡ Level 1 và Level 2.
  - Tổng số unit tests tăng lên 44/44 tests với tốc độ thực thi chỉ 1.05s.
  - Build production đạt tốc độ ấn tượng: 147ms.

## 2. What Went Wrong / Areas for Improvement
- Khi chạy kịch bản nhiều máy chủ đằng sau Load Balancer hội tụ về một Database, cần luôn tính toán tổng lưu lượng gộp (aggregated downstream traffic) so với công suất của Database để tránh DB bị nghẽn bất ngờ ngoài dự kiến.

## 3. Proposed Adjustments for Future Sprints
- **Sprint 05 Planning**:
  - Tiếp tục với **Màn 4: Dịch vụ Rút gọn Link Toàn cầu (Global TinyURL - Database Scaling, Read Replica & Sharding)** hoặc **Màn 5: Săn Vé Concert Black Friday (Message Queue & Async Processing)** để đào sâu về tầng lưu trữ phân tán và hàng đợi bất đồng bộ.
