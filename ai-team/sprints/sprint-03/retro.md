# Sprint 03 Retrospective

- **Date**: 2026-10-26
- **Facilitator**: Reviewer
- **Sprint**: Sprint 03 (S-007, S-008)

## 1. What Went Well
- **Kỷ luật Scrum được thực thi triệt để**:
  - Không có bất kỳ thay đổi code nào diễn ra mà thiếu User Story hoặc Acceptance Criteria.
  - Cả S-007 và S-008 đều có bộ hồ sơ Scrum hoàn chỉnh: `story.md`, `spec.md`, `ui-spec.md`, `impl-notes.md`, `test-result.md`, `ui-review.md`, `security.md`, và `review.md`.
- **Độ chính xác của Math Simulation Engine**:
  - Công thức phân bổ Cache Hit/Miss hoạt động hoàn hảo. Mô phỏng đúng nguyên lý bảo vệ Database đằng sau tầng In-Memory Cache (90% hits tại 1ms, 10% miss tới DB).
  - Khả năng kiểm tra kiến trúc tự động nhận diện đúng giữa Database bền vững (persistent) và Cache tạm thời (ephemeral), giúp cảnh báo mất dữ liệu nếu người chơi quên Database cho các yêu cầu Write.
- **Chất lượng kiểm thử & build**:
  - Bộ unit test mở rộng từ 30 lên 34 tests, kiểm tra từ tầng toán học BFS, tính điểm, UI Inspector, đến bộ chọn màn chơi.
  - Tốc độ build production cực nhanh (~157ms), 0 warning linter, 0 lỗ hổng bảo mật.

## 2. What Went Wrong / Areas for Improvement
- Khi định nghĩa `COMPUTE_TIERS`, cần lưu ý đồng bộ giữa thông số test và gameplay: ban đầu tier Medium được đặt 1500 RPS ở S-007, nhưng spike Màn 2 là 2500 RPS nên tier Medium cần nâng lên 3000 RPS để người chơi có giải pháp 1 máy chủ tiết kiệm chi phí. Bài học: luôn đối chiếu dung lượng các tầng phần cứng với thông số tải của các màn chơi kế tiếp.

## 3. Proposed Adjustments for Future Sprints
- **Sprint 04 Planning**:
  - Đề xuất đưa vào **S-009: Màn 3 - Sàn Thương Mại Điện Tử Flash Sale (E-Commerce Flash Sale with Message Queue & Async Processing)** để dạy người chơi cơ chế dùng Message Queue (RabbitMQ / Kafka) đệm đơn hàng, chống sập cơ sở dữ liệu khi có lượng đơn ghi (Write-heavy) ồ ạt lúc 0h00.
