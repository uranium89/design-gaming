# S-020: Khắc Phục Lỗi Mở Khóa Màn Chơi Chặt Chẽ (Strict Sequential Level Unlocking & Stale Progress Invalidation)

Status: Done

## User Story
As a player,  
I want higher levels (such as Level 5) to be strictly locked unless all preceding levels have actually been completed with at least 1 star,  
So that stale data in browser localStorage from earlier versions cannot bypass the progression sequence and allow jumping directly to late-game levels.

## Acceptance Criteria
- [x] Quy tắc mở khóa tuần tự nghiêm ngặt (Strict Sequential Dependency):
  - Màn $N$ chỉ được phép mở khóa (`unlocked: true`) KHI VÀ CHỈ KHI TẤT CẢ các Màn tiền nhiệm từ $1$ đến $N-1$ trước đó đã đạt tối thiểu 1 sao ($\ge 1★$) hoặc có trạng thái `passed: true`.
  - Loại bỏ hoàn toàn lỗ hổng tin tưởng mù quáng cờ `progress[levelId]?.unlocked` độc lập mà không kiểm tra màn tiền nhiệm.
- [x] Xử lý an toàn dữ liệu cũ (Stale Data Invalidation in `loadProgress`):
  - Khi nạp dữ liệu từ `localStorage`, nếu cờ `unlocked` không tồn tại trong bản ghi, mặc định `unlocked: false` (chỉ Màn 1 và Sandbox mặc định `true`).
  - Tự động chuẩn hóa trạng thái mở khóa theo chuỗi tiến trình thực tế.
- [x] Bảo đảm các màn từ 2 đến 5 bị khóa chặt chẽ đối với người chơi mới hoặc người chơi chưa hoàn thành màn trước đó.

## Out of Scope
- Thay đổi logic tính điểm các màn chơi.

## Assumptions
- Trình duyệt lưu tiến trình trong key `sysarchitect_progress_v1`.

## Acceptance
- **Accepted by**: product-owner
- **Evidence**: Vitest unit test suite (99/99 passed), build passed, security scanners passed.
- **Date**: 2026-10-27
- **Verdict**: PASS / Done
