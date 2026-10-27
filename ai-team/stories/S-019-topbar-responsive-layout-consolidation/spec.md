# Technical Specification: S-019 Tối Ưu Bố Cục TopBar & Chống Tràn Giao Diện (TopBar Responsive Layout & Action Consolidation)

Status: Spec Complete  
Risk Level: 🟢 Low (Pure UI CSS and layout consolidation, no logic risk)

## 1. Architecture Overview
1. **Financial Metric Consolidation (`TopBar.tsx`)**:
   - Merge `Cost` ($X/mo) and `Budget Max` ($Y/mo) into a single cohesive pill:
     - Label: `Cost / Budget`
     - Value: `${metrics.costPerMonth} / ${metrics.budgetLimit >= 999999 ? '∞' : '$' + metrics.budgetLimit}`
     - Status styling: uses warning/danger highlight if `costPerMonth > budgetLimit`.
     - Reclaims ~110px of horizontal space in the right section.
2. **Compact Secondary Action Buttons**:
   - "Đặt lại": converted to an accessible icon button (`.iconBtn`) featuring `RotateCcw` with `aria-label="Đặt lại tiến trình chơi"` and `title="Đặt lại toàn bộ tiến trình"`.
   - "Đề bài" & "Bản vẽ": wrapped labels in `<span className={styles.btnText}>`, with responsive hiding on compact viewports (< 1320px).
3. **Level Selector Width Clamping**:
   - Level select dropdown styled with `max-width: 200px`, `text-overflow: ellipsis`, and `overflow: hidden` to prevent long option text from distorting the navigation bar width.
4. **Responsive CSS Media Rules (`TopBar.module.css`)**:
   - Gaps reduced to compact standard (8px across sections).
   - Sliders in Sandbox mode scaled to flexible width (65px - 85px).
   - `@media (max-width: 1320px)` and `@media (max-width: 1150px)` rules to gracefully collapse secondary text without clipping buttons or causing horizontal body overflow.

## 2. API Contract & Data Types
No changes to external interfaces or types. `TopBarProps` remains completely backwards compatible.
