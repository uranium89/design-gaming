# Technical Spec: S-001 Nền tảng Thiết kế Giao diện (Design Foundation)

- **Status**: Ready for Implementation
- **Risk Level**: 🟢 Low (Khởi tạo scaffold và styling cơ bản)
- **Author**: Architect

## 1. Technical Approach
- Khởi tạo project Vite + React + TypeScript tại thư mục gốc.
- Cài đặt các thư viện cốt lõi:
  - `@xyflow/react` (chuẩn bị cho canvas node-graph)
  - `zustand` (quản lý trạng thái giao diện và tiến trình)
  - `lucide-react` (bộ icon chất lượng cao, hiện đại phong cách cloud console)
- Thiết lập CSS Design Tokens tại `src/styles/tokens.css` bám sát `ai-team/DESIGN.md`.
- Xây dựng layout 3 khối cơ bản:
  1. `TopBar`: Brand, Level Title Badge, Metric Pills (RPS, Latency, Cost, Budget), Nút Play/Pause.
  2. `SidebarDock`: Phân loại linh kiện hạ tầng theo nhóm (Routing, Compute, Storage, Messaging) với icon trực quan.
  3. `CanvasArea`: Vùng canvas với nền lưới ô vuông 20px x 20px, hỗ trợ kéo rê thử nghiệm.

## 2. File Manifest (Write Zone)
- `package.json`: Khai báo dependencies, scripts `dev`, `build`, `lint`, `test`.
- `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`: Cấu hình TypeScript và Vite.
- `index.html`: Entry HTML với font Inter và title "SysArchitect: High Availability".
- `src/main.tsx`: Entry point React.
- `src/App.tsx`: Layout container chính ghép nối TopBar, SidebarDock, CanvasArea.
- `src/styles/tokens.css`: Các biến CSS tokens màu sắc, khoảng cách, font, bo góc từ DESIGN.md.
- `src/styles/global.css`: Reset CSS, typography cơ bản và utility classes.
- `src/components/TopBar/TopBar.tsx` & `TopBar.module.css`
- `src/components/SidebarDock/SidebarDock.tsx` & `SidebarDock.module.css`
- `src/components/CanvasArea/CanvasArea.tsx` & `CanvasArea.module.css`
- `src/types/index.ts`: Định nghĩa types cho component metadata và metrics.
- `tests/unit/foundation.test.tsx`: Test render TopBar và SidebarDock.

## 3. Verification Criteria
- `npm run build`: Hoàn thành không có lỗi TypeScript hoặc bundle.
- `npm test`: Tất cả unit tests về render layout cơ bản đều PASS.
- Giao diện đáp ứng đúng màu sắc và kích thước theo `ai-team/DESIGN.md`.
