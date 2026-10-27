# S-024: Đổi Tên Ứng Dụng Thành Design Gaming & Cập Nhật Toàn Diện README (App Rebranding & README Update)

Status: Done

## User Story
As a user and visitor to the repository,  
I want the application to be named "Design Gaming" throughout the UI, title, package metadata, and have a rich, comprehensive, and professional README.md describing the game, its levels, features, and setup instructions,  
So that anyone viewing or playing the project understands its value, mechanics, and how to run it.

## Acceptance Criteria
- [x] Cập nhật tên ứng dụng thành **Design Gaming**:
  - `src/components/TopBar/TopBar.tsx`: Nhãn thương hiệu góc trái hiển thị `<span>Design Gaming</span>`.
  - `index.html`: Cập nhật `<title>Design Gaming - System Design Simulator & Game</title>` và meta description.
  - `package.json`: `"name": "design-gaming"`.
- [x] Viết lại toàn diện `README.md`:
  - Tiêu đề: **Design Gaming** (Interactive System Design Simulator & Architecture Puzzle Game).
  - Giới thiệu tổng quan (Mini Metro / Factorio dành cho Kỹ sư Hệ thống).
  - Danh sách tính năng nổi bật:
    - 6 Màn chơi Chiến dịch (The Bakery, Tech News, Flash Deals, TinyURL, Ticket Rush, Global Chat).
    - 4 Đế Chế Đám Mây (Freestyle, AWS, Azure, GCP) và Chế độ Sandbox.
    - Hệ thống hạt Packet Flow mô phỏng lưu lượng 60 FPS qua Web Worker.
    - Hệ thống âm thanh tổng hợp Web Audio Synth xúc giác.
    - Xuất, nhập và chia sẻ bản vẽ kiến trúc qua URL Hash ($0 server cost).
    - Giao diện Dark Cyberpunk / Cloud Console tối ưu responsive.
  - Hướng dẫn cài đặt và khởi chạy: `npm install`, `npm run dev`, `npm test`, `npm run build`.
  - Tech Stack & Kiến trúc hệ thống.
- [x] Toàn bộ unit tests và build pass 100%.

## Out of Scope
- Thay đổi logic gameplay cốt lõi.

## Assumptions
- Giữ nguyên các key localStorage nội bộ để không làm mất tiến trình đã lưu của người chơi.

## Acceptance
- **Accepted by**: Product Owner
- **Evidence**:
  - `npm test -- --run`: 20 suites passed, 113/113 unit tests passed.
  - `npm run build`: Production bundle built successfully.
  - Scanners: `npm audit` (0 vulns), `gitleaks` (0 leaks), `semgrep` (0 findings).
  - Review: APPROVED by reviewer.
- **Date**: 2026-10-27
- **Verdict**: PASS
