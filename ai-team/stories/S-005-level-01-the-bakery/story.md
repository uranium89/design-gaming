# S-005: Màn 1 Hoàn chỉnh - Tiệm Bánh Ngọt (Level 01: The Local Bakery)

Status: Done

## User Story
As a player,  
I want to play through Level 1 with full briefing, goal constraints, live simulation, incident spike, and star scoring,  
So that I experience the complete game loop from problem to solution.

## Acceptance Criteria
- [x] Modal Briefing hiển thị đề bài Màn 1: The Local Bakery (Target RPS 20-50, Budget $35, P95 < 200ms).
- [x] Cho phép người chơi dựng kiến trúc Monolith tối ưu (1 VM hoặc 1 VM + DB).
- [x] Kích hoạt sự kiện bất ngờ (Incident Spike 120 RPS trong 15s) vào giây thứ 30 của quá trình mô phỏng.
- [x] Tính toán điểm số chính xác theo 4 trụ cột và hiển thị Modal Tổng kết: Điểm tổng, số sao đạt được (1-3 sao) và phân tích nguyên nhân.
- [x] Có nút "Thử lại" (Retry) và "Xem giải pháp mẫu" (Reference Architecture).

## Out of Scope
- Các màn chơi nâng cao từ Màn 2 đến Màn 10.
- Bảng xếp hạng trực tuyến toàn cầu (Cloud Leaderboard).

## Assumptions
- Sử dụng công thức tính điểm và thông số Màn 1 đã chuẩn hóa trong GDD.

## Acceptance
- **Accepted by**: product-owner
- **Date**: 2026-10-26
- **Evidence**:
  - Unit test suite: [test-result.md](file:///Users/vinhpham/Documents/GitHub/design-gaming/ai-team/stories/S-005-level-01-the-bakery/test-result.md) (23/23 tests pass).
  - UI conformance: [ui-review.md](file:///Users/vinhpham/Documents/GitHub/design-gaming/ai-team/stories/S-005-level-01-the-bakery/ui-review.md) (PASS).
  - Security scanner: [security.md](file:///Users/vinhpham/Documents/GitHub/design-gaming/ai-team/stories/S-005-level-01-the-bakery/security.md) (0 vulnerabilities).
  - Code review: [review.md](file:///Users/vinhpham/Documents/GitHub/design-gaming/ai-team/stories/S-005-level-01-the-bakery/review.md) (APPROVED).
