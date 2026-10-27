# UI Specification - S-021: Web Audio Synth Sound Effects & Mute Control

Status: Ready
Author: ui-designer

## 1. TopBar Mute Control Button
- **Vị trí**: Nằm trong cụm công cụ bên phải của TopBar, kế bên nút Đặt lại tiến trình (`RotateCcw`).
- **Hình thức**:
  - Nút tròn đồng bộ với nút Reset (`topbar-icon-button`), kích thước 36px x 36px.
  - Nền trong suốt hoặc viền nhẹ màu xám tối (`rgba(255, 255, 255, 0.08)`).
  - Hover: Sáng nhẹ viền cyan/accent (`rgba(56, 189, 248, 0.25)`), hiệu ứng micro-bounce nhẹ.
  - Active: Nhỏ lại 5% (`transform: scale(0.95)`).
- **Icon**:
  - Khi Unmuted (Đang bật âm thanh): Icon `Volume2` (Lucide React) màu cyan/sky nhạt (`#38bdf8`).
  - Khi Muted (Đang tắt âm thanh): Icon `VolumeX` màu xám trung tính (`#94a3b8`) kèm gạch chéo đỏ nhẹ hoặc xám mờ.
- **Tooltip**:
  - `title="Âm thanh: Đang bật (Nhấn để tắt)"` khi unmuted.
  - `title="Âm thanh: Đang tắt (Nhấn để bật)"` khi muted.

## 2. Responsive Behavior
- Desktop & Tablet ($> 768\text{px}$): Hiển thị đầy đủ icon button.
- Mobile ($\le 768\text{px}$): Giữ nguyên icon button tròn 36px cạnh menu công cụ, không bị tràn hay ép méo layout.

## 3. UI Acceptance Criteria
- [ ] Nút icon Loa có kích thước 36x36px, căn giữa icon 16x16px.
- [ ] Bấm nút đổi tức thì giữa icon `Volume2` và `VolumeX`.
- [ ] Không gây layout shift trên TopBar.
