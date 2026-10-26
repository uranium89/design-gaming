# Architecture

Shared memory for every agent. Read it before acting. The architect owns this file, except Guardrails (product-owner) and Quality Gates (devsecops).

## Guardrails
- Problem and users: Game giáo dục puzzle/simulation về System Design cho lập trình viên junior-mid luyện kiến trúc và ôn phỏng vấn.
- Expected users (launch / 1 year): 1,000 launch / 50,000 1 year.
- Monthly budget for hosting and paid services: $0 - $50/tháng (Client-side simulation qua Web Worker, Supabase/Vercel free tier cho MVP).
- Sensitive data (personal, payments, other) and user countries: Không có dữ liệu thanh toán nhạy cảm; lưu user profile, tiến độ và điểm số leaderboard. Toàn cầu.
- Deadline for first usable version: 4 tuần cho MVP cốt lõi (1-2 màn đầu); 16 tuần cho toàn bộ 10 màn.
- Who maintains it after launch: Tác giả / Core maintainer.
- Existing systems or accounts to use: GitHub, Vercel/Cloudflare Pages, Supabase.
- Design direction (products with a UI): Web 2D desktop-first, giao diện Dark Theme / Cyberpunk / Cloud Console hiện đại, trực quan hóa hạt lưu lượng thời gian thực (như Factorio / Mini Metro). Reference: [docs/GAME_DESIGN_DOCUMENT.md](file:///Users/vinhpham/Documents/GitHub/design-gaming/docs/GAME_DESIGN_DOCUMENT.md).

## Team
- Mode: single coder
- ui-designer: on (Game có giao diện 2D web phong phú, node canvas, visual feedback hạt packet)

## Stack
- Framework: Vite + React 18 (TypeScript) - [ADR 0001](adr/0001-frontend-stack-vite-react-flow.md)
- Canvas Node Graph: `@xyflow/react` (React Flow)
- Particle & Flow Render: Canvas 2D overlay (hoặc PixiJS)
- Simulation Engine: TypeScript trong Web Worker (Discrete Event Simulation) - [ADR 0002](adr/0002-web-worker-discrete-event-simulation.md)
- State Management: Zustand
- Styling: Vanilla CSS / CSS Modules với Design Tokens (Cyberpunk / Cloud Console)
- Testing: Vitest + @testing-library/react
- Linter: ESLint

## Folder Structure
- `src/`: Mã nguồn ứng dụng
  - `components/`: UI components (Dock, TopBar, Inspector, ControlDeck, ScoreModal)
  - `canvas/`: React Flow wrapper và custom overlays
  - `nodes/`: Custom node components (LoadBalancer, AppServer, Cache, Database, Queue...)
  - `edges/`: Custom animated edges và particle rendering
  - `simulation/`: Web Worker core, M/M/c/K queue calculation, event scheduler
  - `levels/`: Dữ liệu 10 màn chơi (thông số, ràng buộc, kịch bản incident)
  - `state/`: Zustand stores (levelStore, simulationStore, designStore)
  - `types/`: Định nghĩa TypeScript interfaces cho nodes, metrics, levels
  - `styles/`: Design tokens, typography, dark theme variables
- `tests/`: Kiểm thử tự động
  - `unit/`: Test tính toán math của queue model và scoring formula
  - `integration/`: Test tương tác giữa UI và simulation worker

## Commands
- Install: `npm install`
- Build: `npm run build`
- Lint: `npm run lint`
- Test: `npm test`
- Run locally: `npm run dev`

## Conventions
- Code style: TypeScript strict mode, React functional components với hooks.
- Naming: PascalCase cho Components/Nodes, camelCase cho functions/files, UPPER_SNAKE cho constants.
- State: Toàn bộ trạng thái mô phỏng đồng bộ qua tin nhắn type-safe giữa Web Worker và Zustand.

## Quality Gates
- Dependencies: `npm audit` (hoặc `osv-scanner`)
- Secrets: `gitleaks detect --source . -v`
- SAST: `semgrep --config auto .`
- Config / infrastructure: `n/a` (chưa có Docker/Infra trong MVP)
