# UI Review: S-017 Hệ Thống Mở Khóa Màn Chơi Theo Tiến Trình & Quản Lý Dữ Liệu Chơi (Campaign Level Unlocking Progression & Reset)

## Loop 1

## Status: PASS

## Design Conformance Review
1. **Padlock Icon & Locked Level State**:
   - Locked levels are prefixed with `🔒` and describe the exact unlocking requirement (e.g. `🔒 Level 2: Tech News (Cần 1★ ở Màn 1)`).
   - Natively marked `disabled` in the HTML `<select>`, preventing accidental selection while remaining informative.
   - Unlocked levels display standard styling with earned star badges (e.g. `Level 1: The Bakery ⭐⭐⭐`).
2. **Reset Progress Control**:
   - Ghost button styled with `RotateCcw` icon placed cleanly in the TopBar brand/navigation section.
   - Provides an explicit confirmation dialog before wiping local storage to prevent accidental data loss.
3. **Responsive & Dark Theme Consistency**:
   - No layout shift or overflow on desktop or mobile viewports.
   - Conforms strictly to the Dark Console design system tokens.
4. **Accessibility**:
   - `aria-label="Chọn màn chơi"` and `aria-label="Đặt lại tiến trình chơi"` provide accessible descriptions for assistive devices.
   - High contrast text on dark background maintains WCAG AA conformance.

## Verdict: PASS
