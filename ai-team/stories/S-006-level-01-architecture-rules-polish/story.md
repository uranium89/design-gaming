# S-006: Hoàn thiện Luật Kiến trúc & Cân bằng Màn 1 (Level 1 Gameplay & Architecture Rules Polish)

Status: Done

## User Story
As a player,  
I want realistic system design rules (tiered architecture validation, data loss penalties, and a clean puzzle canvas),  
So that I cannot cheat by connecting User directly to Database, and I experience genuine architectural puzzle-solving.

## Acceptance Criteria
- [x] **AC 1 (DEC-002)**: Bổ sung linh kiện `SQLite / Micro DB` ($10/tháng, 150 RPS) vào Toolbox để lưu trữ đơn đặt bánh online (20% Write) vừa vặn trong ngân sách trần $35.
- [x] **AC 2 (Puzzle Canvas)**: Trạng thái khởi đầu của màn chơi chỉ xuất hiện duy nhất node `User Traffic` ($0), giữ canvas trống để người chơi tự giải đố kéo thả.
- [x] **AC 3 (Kiểm duyệt Phân tầng Kiến trúc)**:
  - Nếu nối `User Traffic` trực tiếp vào `Database`: DB chuyển sang `crashed`, rớt 100% request, phạt vi phạm kiến trúc/bảo mật và đánh rớt 0 sao.
  - Nếu có `App Server` nhưng thiếu `Database`: 20% đơn hàng ghi bị mất mát dữ liệu (Data Loss), phạt 150đ và không thể đạt 3 sao.
  - Chỉ khi dựng kiến trúc chuẩn 2 tầng (`User` $\rightarrow$ `App Server` $\rightarrow$ `Micro DB`) với chi phí $30 $\le$ $35 mới đạt điểm tuyệt đối 3 sao (⭐⭐⭐).

## Acceptance
- **Accepted by**: product-owner
- **Date**: 2026-10-26
- **Evidence**:
  - Test Results: [test-result.md](file:///Users/vinhpham/Documents/GitHub/design-gaming/ai-team/stories/S-006-level-01-architecture-rules-polish/test-result.md) (28/28 tests pass).
  - Security Gate: [security.md](file:///Users/vinhpham/Documents/GitHub/design-gaming/ai-team/stories/S-006-level-01-architecture-rules-polish/security.md) (PASS, OWASP network segmentation).
  - Code Review: [review.md](file:///Users/vinhpham/Documents/GitHub/design-gaming/ai-team/stories/S-006-level-01-architecture-rules-polish/review.md) (APPROVED).
