# UI Specification: S-019 Tối Ưu Bố Cục TopBar & Chống Tràn Giao Diện (TopBar Responsive Layout & Action Consolidation)

Status: UI Spec Complete

## 1. TopBar Visual Hierarchy & Spacing
- Target height: fixed `54px` (down from 56px, cleaner proportion).
- Padding: `0 14px` (down from 20px).
- Spacing between items inside Left, Center, Right sections: `8px`.

## 2. Compact Element Design
- **Icon Button Style (`iconBtn`)**:
  - Size: 30px x 30px square.
  - Border radius: 6px (`var(--radius-sm)`).
  - Background: transparent on idle, `rgba(255,255,255,0.06)` on hover.
  - Used for "Đặt lại" (RotateCcw) and responsive collapsed actions.
- **Combined Cost / Budget Pill**:
  - Container width: ~110px.
  - Label: `COST / BUDGET`.
  - Format: `$180 / $250` (or `$180 / ∞`).
  - Colors: emerald/neutral under budget, amber/rose when nearing or exceeding limit.
- **Level Select Element**:
  - Styled with `max-width: 190px`, `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis`.

## 3. Responsive Breakpoints
- **Desktop (>= 1320px)**: Full labels visible on all buttons (`Đề bài`, `Bản vẽ`).
- **Laptop / Compact (< 1320px)**:
  - Text hidden on secondary buttons, showing icons with tooltips.
  - Sandbox sliders width reduced from 90px to 65px.
  - Zero horizontal overflow guaranteed down to 1024px.
