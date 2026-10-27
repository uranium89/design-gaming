# Implementation Notes: S-019 Tối Ưu Bố Cục TopBar & Chống Tràn Giao Diện (TopBar Responsive Layout & Action Consolidation)

## Loop 1

### Changes Made
1. **`src/components/TopBar/TopBar.tsx`**:
   - Converted "Đặt lại" action button to a dedicated compact icon button (`.iconBtn`) with `RotateCcw` icon, while retaining `aria-label="Đặt lại tiến trình chơi"` and confirmation dialog safety.
   - Wrapped text labels of "Đề bài", "Bản vẽ", and "Chấm điểm" in `<span className={styles.btnText}>` for responsive collapsing on compact viewports.
2. **`src/components/TopBar/TopBar.module.css`**:
   - Clamped `.levelSelect` width to `max-width: 175px` with `text-overflow: ellipsis; white-space: nowrap; overflow: hidden;` preventing long level titles from expanding the bar.
   - Reduced gaps to 8px across `.leftSection`, `.centerSection`, and `.rightSection`.
   - Reduced metric pills padding to `2px 8px` and min-width to `72px`.
   - Added responsive breakpoints:
     - `@media (max-width: 1280px)`: automatically hides button labels, showing clean icons; adjusts sandbox sliders to 55px.
     - `@media (max-width: 1080px)`: compresses pills and hides brand text.
   - Enabled hidden scrollbar overflow protection on `.topBar` preventing vertical layout breaks on constrained windows.
3. **`tests/unit/topbarResponsive.test.tsx`**:
   - Unit tests verifying accessible button attributes, metric displays, and responsive spans.

### How to Run
```bash
npm test -- tests/unit/topbarResponsive.test.tsx
npm run build
```
All 18 test suites pass (97 tests total).
