# UI Specification: S-016 Chế Độ Sandbox Tự Do & Lưu Trữ Tiến Trình Chơi (LocalStorage Star Tracking)

Status: UI Spec Complete

## 1. TopBar Dropdown Enhancements
- Each option in the Level Select dropdown displays:
  - `Level 1: Tiệm Bánh Ngọt ⭐⭐⭐` (if 3 stars)
  - `Level 2: Dịch Vụ Rút Gọn URL ⭐⭐` (if 2 stars)
  - `Level 3: Săn Sale Thời Trang ⭐` (if 1 star)
  - `Level 4: TinyURL Toàn Cầu` (if 0 stars)
  - `🛠️ Sandbox: Tự Do Thiết Kế` (special sandbox entry with badge)

## 2. Sandbox Traffic Injector Controls
- Rendered in TopBar when `levelId === 'sandbox'`:
  - RPS Slider: range `100` - `50,000`, step `500`. Label: `Tải: {value.toLocaleString()} RPS`.
  - Write Ratio Slider: range `0` - `100%`, step `5%`. Label: `Ghi: {value}%`.
  - Budget badge shows: `Ngân sách: Không giới hạn (∞)`.

## 3. Responsive & Clean Dark Console Design
- Slider inputs styled with `--color-accent` `#6366f1` / `#10b981`.
- Compact layout preserving TopBar height and status metrics.
