# Sprint 05 Retrospective

- **Date**: 2026-10-26
- **Facilitator**: Reviewer
- **Sprint**: Sprint 05 (S-011, S-012)

## 1. What Went Well
- **Kỷ luật Scrum & User Story tuyệt đối**:
  - Cả 2 User Stories (S-011 và S-012) được xây dựng đầy đủ theo quy chuẩn: Story -> Spec -> UI Spec -> Threat Model -> Code -> Test -> UI Review -> Security Review -> Code Review -> PO Acceptance.
  - Tuyệt đối không can thiệp code mà không có User Story và Acceptance Criteria được phê duyệt trước.
- **Giải quyết bài toán cốt lõi về Đọc/Ghi quy mô lớn**:
  - Khái niệm Database Read Replica và cơ chế Read/Write Splitting được mô phỏng trực quan, chính xác về mặt toán học.
  - Phân tách rành mạch lưu lượng Ghi dồn vào Master và lưu lượng Đọc chia đều sang các Replicas.
- **Nâng cấp thuật toán DAG Path Latency**:
  - Thay vì cộng dồn tuần tự tất cả các node trong đồ thị (vốn làm sai lệch độ trễ khi có nhiều node song song), việc chuyển sang tính độ trễ theo đường đi dài nhất (Critical Path Latency) giúp mô hình phản ánh sát thực tế các cụm máy chủ và replica phân tán.
- **Chất lượng kiểm thử & Hiệu năng cao**:
  - Số lượng unit tests đạt mốc 54/54 tests passed (11 suites) chỉ trong 1.11s.
  - Thời gian build production `tsc && vite build` chỉ 166ms.

## 2. What Went Wrong / Areas for Improvement
- Ban đầu thuật toán tính latency trong `engineMath.ts` tích lũy tuần tự (cumulative serial sum) qua tất cả các node được duyệt trong BFS, khiến các cụm chạy song song bị cộng dồn độ trễ giả tạo. Đã kịp thời phát hiện và nâng cấp sang mô hình DAG Path Latency.
- Khi thiết kế mức tải 8,000 - 10,000 RPS, cần tính toán kỹ tương quan giữa số lượng server Compute và trần ngân sách 80% (để đạt điều kiện 3 sao trong `scoring.ts`). Cấu hình 3 App Servers Medium ($135) là giải pháp tối ưu chi phí hơn 2 App Servers Large ($180).

## 3. Proposed Adjustments for Future Sprints
- **Sprint 06 Planning**:
  - Tiếp tục với **Màn 5: Săn Vé Concert Black Friday (Ticketmaster / Event-Driven Architecture)**:
    - Bài toán Write-Heavy đột biến cực lớn (50,000 RPS Write).
    - Linh kiện **Message Queue (RabbitMQ / Kafka / AWS SQS)** và tầng Worker Pool xử lý bất đồng bộ (Traffic Leveling / Buffering).
    - Chống bán trùng vé (No Double Booking / Overselling) và Circuit Breaker khi Payment Gateway bị nghẽn.
