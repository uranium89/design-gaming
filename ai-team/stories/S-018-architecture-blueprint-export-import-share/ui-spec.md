# UI Specification: S-018 Xuất, Nhập & Chia Sẻ Bản Vẽ Kiến Trúc (Architecture Blueprint Export, Import & Shareable Link)

Status: UI Spec Complete

## 1. TopBar Blueprint Trigger
- Placed in `leftSection` or `rightSection` next to existing action buttons:
  - Button text: `Bản vẽ`
  - Icon: `Share2` (14px)
  - Styling: Ghost button (`styles.ghostBtn`) with hover highlight matching Dark Console palette.

## 2. Blueprint Modal Dialog (`BlueprintModal`)
- Modal structure matching `ScoreModal` / `BriefingModal`:
  - Dark backdrop (`rgba(10, 15, 29, 0.85)` with blur).
  - Header: Icon `Share2`, Title: `Bản Vẽ Kiến Trúc (Blueprint & Share)`, Close button (X).
  - Body composed of 3 interactive cards:
    - **Card 1: Sao chép Liên kết Chia sẻ (Shareable Link)**:
      - Quick copy input containing the `#blueprint=...` URL.
      - Button: `Sao chép liên kết`. When clicked, toggles state to green `Đã sao chép! ✓` for 2 seconds.
    - **Card 2: Xuất Bản vẽ JSON (Export Blueprint)**:
      - Summary of nodes count & edges count currently on canvas.
      - Button: `Tải xuống .json` (`Download` icon).
    - **Card 3: Nhập Bản vẽ JSON (Import Blueprint)**:
      - File input button or dropzone accepting `.json` files.
      - Inline error callout if file is invalid or corrupt.
      - Success feedback on load.

## 3. Responsive & Dark Theme Conformance
- High contrast, emerald `#10b981` and cyan accents.
- Accessible keyboard navigation (`Escape` closes modal, `Enter` / `Space` triggers actions).
