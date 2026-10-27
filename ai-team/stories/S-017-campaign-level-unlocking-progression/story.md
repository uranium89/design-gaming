# S-017: Hệ Thống Mở Khóa Màn Chơi Theo Tiến Trình & Quản Lý Dữ Liệu Chơi (Campaign Level Unlocking Progression & Reset)

Status: Done

## User Story
As a player,  
I want levels in Campaign mode to be progressively unlocked as I earn stars on preceding levels, with the ability to reset my progress,  
So that the game offers a structured sense of progression and challenge, rewarding my architectural mastery before tackling more complex distributed systems.

## Acceptance Criteria
- [x] Cơ chế khóa và mở khóa màn chơi (Level Unlocking):
  - Màn 1 (`level-01-bakery`) và `Sandbox Mode` luôn ở trạng thái mở khóa (`unlocked: true`).
  - Các màn tiếp theo (Level 2 đến Level 5) mặc định bị khóa (`unlocked: false`) đối với người chơi mới.
  - Điều kiện mở khóa: Level $N$ tự động mở khóa ngay khi người chơi hoàn thành Level $N-1$ với kết quả đạt ít nhất 1 sao ($\ge 1★$).
- [x] Giao diện Level Selector trên TopBar:
  - Các màn chơi bị khóa hiển thị icon ổ khóa `🔒` (ví dụ: `🔒 Level 2: Tech News (Cần 1★ ở Màn 1)`), text mờ hơn và bị vô hiệu hóa (disabled / không cho phép click chọn).
  - Có nhãn giải thích điều kiện mở khóa rõ ràng trong từng option: *"Cần 1★ ở Màn [N-1]"*.
  - Các màn đã mở khóa hiển thị bình thường kèm số sao đã đạt được (ví dụ: `Level 1: The Bakery ⭐⭐⭐`).
- [x] Lưu trữ và cập nhật trạng thái mở khóa vào `localStorage`:
  - Đồng bộ `unlocked: boolean` vào cấu trúc `sysarchitect_progress_v1`.
  - Khi hoàn thành màn chơi đạt sao tại `ScoreModal`, nếu màn tiếp theo chưa mở khóa thì tự động kích hoạt `unlocked = true` cho màn tiếp theo và lưu ngay vào `localStorage`.
- [x] Nút "Đặt Lại Tiến Trình" (Reset Progress):
  - Cung cấp nút "Đặt lại" (Reset Progress) kèm icon 🔄 `RotateCcw` trên thanh TopBar.
  - Khi bấm, hiển thị hộp thoại xác nhận (Confirm Dialog) để tránh người chơi bấm nhầm: *"Bạn có chắc chắn muốn đặt lại toàn bộ sao và khóa các màn chơi về trạng thái ban đầu không?"*.
  - Nếu xác nhận: Xóa sạch dữ liệu trong `localStorage`, đưa tiến trình về Level 1 với 0 sao, và tự động chuyển về Màn 1.
- [x] Đảm bảo tính tương thích ngược với người chơi cũ đã có dữ liệu sao lưu trước đó (tự động mở khóa các màn tương ứng với số sao đã có).

## Out of Scope
- Đồng bộ đám mây Supabase (dành cho Giai đoạn 4 theo GDD).

## Assumptions
- Dữ liệu tiến trình được quản lý cục bộ an toàn qua service `progressStorage.ts`.

## Acceptance
- **Accepted by**: Product Owner
- **Evidence**: `tests/unit/campaignProgression.test.tsx` (10/10 passed), full test suite (16 suites, 85/85 passed), SAST & gitleaks PASS.
- **Date**: 2026-10-27
- **Verdict**: PASS & ACCEPTED
