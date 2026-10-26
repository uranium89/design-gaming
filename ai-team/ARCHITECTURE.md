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
- Mode: single coder | fullstack (backend-dev + frontend-dev)
- ui-designer: on | off (on for any product with a user interface)

## Stack
_Language, framework, database, hosting target, and for a UI the component library. Link the ADR for each choice._

## Folder Structure
_Where product code and tests live, following the stack's standard layout at the project root (never inside `ai-team/`). In fullstack mode, list backend folders and frontend folders (default `apps/backend/`, `apps/frontend/`)._

## Commands
- Install:
- Build:
- Lint:
- Test:
- Run locally:

## Conventions
_Naming, error handling, logging, config via environment variables._

## Quality Gates
_Filled by devsecops: the exact command for each scanner, and whether it runs in CI._
- Dependencies:
- Secrets:
- SAST:
- Config / infrastructure:
