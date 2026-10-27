# Technical Specification - S-024: App Rebranding to Design Gaming & README Update

Status: Ready
Risk Level: 🟢 Low (Documentation and UI brand label branding)

## 1. Overview
Đổi tên hiển thị chính thức của ứng dụng từ "SysArchitect" thành "Design Gaming", cập nhật tiêu đề trang web, cấu hình package, và viết lại toàn diện `README.md` để trở thành trang giới thiệu sản phẩm chính thức cho repository GitHub.

## 2. Touchpoints & Scope
1. **`src/components/TopBar/TopBar.tsx`**:
   - Dòng 66: Đổi `<span>SysArchitect</span>` thành `<span>Design Gaming</span>`.
2. **`index.html`**:
   - Đổi thẻ `<title>`: `Design Gaming - System Design Simulator & Puzzle Game`.
   - Cập nhật thẻ meta description mô tả game mô phỏng kiến trúc hệ thống phân tán.
3. **`package.json`**:
   - `"name": "design-gaming"`
   - `"description": "Interactive System Design Simulator & Architecture Puzzle Game"`
4. **`README.md`**:
   - Viết mới hoàn chỉnh giới thiệu về trò chơi **Design Gaming**:
     - Giới thiệu khái niệm: Game giáo dục kết hợp giải đố kiến trúc hệ thống thời gian thực (như Factorio / Mini Metro cho Software Architecture).
     - Các tính năng cốt lõi: 6 Màn chơi chiến dịch, 4 Đế chế đám mây (Freestyle, AWS, Azure, GCP), Chế độ Sandbox, Web Worker mô phỏng tải 60 FPS, Web Audio Synth, Chia sẻ bản vẽ qua URL Hash.
     - Bảng tóm tắt 6 Màn chơi và mục tiêu.
     - Hướng dẫn cài đặt và chạy thử (`npm install`, `npm run dev`, `npm test`, `npm run build`).
     - Tech Stack & Quy trình phát triển AI Scrum Team.

## 3. Test Strategy
- Kiểm tra các test suite hiện tại có kiểm tra chuỗi `SysArchitect` hay không (nếu có, cập nhật sang `Design Gaming`).
- Chạy toàn bộ 20 test suites và build production.
