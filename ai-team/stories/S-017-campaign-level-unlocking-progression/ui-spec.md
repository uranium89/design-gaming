# UI Specification: S-017 Hệ Thống Mở Khóa Màn Chơi Theo Tiến Trình & Quản Lý Dữ Liệu Chơi (Campaign Level Unlocking Progression & Reset)

Status: UI Spec Complete

## 1. TopBar Level Selector & Lock Badges
- In the Level Selector dropdown:
  - **Unlocked levels**:
    - Display normal text with stars if earned, e.g. `Level 1: The Bakery ⭐⭐⭐` or `Level 2: URL Shortener ⭐`.
  - **Locked levels**:
    - Prefix with `🔒` icon, e.g. `🔒 Level 3: Flash Deals Fashion (Khóa: Cần 1★ ở Màn 2)`.
    - Rendered with `disabled` attribute in HTML `<select>` so clicking is prevented natively.
  - **Sandbox Mode**:
    - Always unlocked, displayed as `🛠️ Sandbox: Tự Do Thiết Kế`.

## 2. Reset Progress Control & Confirm Modal
- Placed cleanly in the TopBar left/actions area next to the Level Selector or Ghost button area:
  - Icon: `RotateCcw` or `RefreshCw` (13px).
  - Button text or tooltip: `"Đặt lại tiến trình"`.
  - Styling: Ghost button matching existing style (`styles.ghostBtn`), subtle hover effect.
- Confirmation dialog:
  - Browser confirm dialog or accessible modal: *"Bạn có chắc chắn muốn đặt lại toàn bộ tiến trình chơi và khóa các màn về ban đầu không?"*.
  - On confirm: Immediate visual feedback, all stars cleared, locked states restored, and level navigated back to Level 1.

## 3. Visual Polish & Dark Console Theme Conformance
- Locked options styled with dimmed text (`opacity: 0.6` / color: `var(--color-text-muted)`).
- Clear and encouraging microcopy explaining unlocking requirements.
- Zero layout shift on the TopBar.
