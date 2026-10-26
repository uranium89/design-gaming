# Implementation Notes: S-001 Nền tảng Thiết kế Giao diện (Design Foundation)

## Loop 1
- **Developer**: Coder
- **Changes**:
  1. Khởi tạo cấu hình dự án Vite + React 18 + TypeScript với `@xyflow/react`, `zustand`, `lucide-react`, `vitest`.
  2. Tạo hệ thống biến màu và design tokens tại `src/styles/tokens.css` bám sát Option B trong `ai-team/DESIGN.md`.
  3. Xây dựng component `TopBar` hoàn chỉnh với thương hiệu "SysArchitect", Level Badge, control nút Run/Pause, và các metric pills (Throughput, Latency P95, Cost, Budget).
  4. Xây dựng component `SidebarDock` với 4 danh mục linh kiện (Routing, Compute, Storage, Messaging) và thẻ linh kiện có giá, công suất RPS, icon và hiệu ứng hover.
  5. Xây dựng component `CanvasArea` với họa tiết lưới kẻ ô vuông tinh tế (20px) và thông điệp hướng dẫn trung tâm.
  6. Xây dựng test suite tự động tại `tests/unit/foundation.test.tsx` kiểm thử toàn diện khả năng render của layout và tương tác nút Run/Pause.

- **Verification Command & Output**:
  - `npm run build`: Hoàn thành thành công (0 errors, bundle 156kB js, 5.8kB css).
  - `npm test`: 3/3 tests PASS (tests/unit/foundation.test.tsx).
