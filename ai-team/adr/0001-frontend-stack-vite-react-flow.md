# ADR 0001: Lựa chọn Tech Stack Frontend (Vite + React + React Flow)

- **Status**: ACCEPTED
- **Decider**: Architect
- **Risk Level**: 🟢 Low (Chuẩn hệ sinh thái Web phổ biến, dễ thay thế/mở rộng)

## Context
Trò chơi "SysArchitect" là một web app 2D tương tác dạng puzzle/simulation yêu cầu:
1. Giao diện kéo-thả các khối kiến trúc (Load Balancer, App Server, Cache, Database...) và nối dây mạng linh hoạt.
2. Trực quan hóa hạt lưu lượng (packets) chuyển động thời gian thực 60 FPS.
3. Tốc độ build/hot reload nhanh trong quá trình phát triển.
4. Tránh phụ thuộc các framework quá cồng kềnh phía backend ở giai đoạn MVP (toàn bộ logic chạy client-side).

## Decision
1. Sử dụng **Vite + React (TypeScript)** làm nền tảng ứng dụng SPA (Single Page Application).
2. Sử dụng **@xyflow/react (React Flow)** làm engine cho Node Graph Canvas (hỗ trợ custom nodes, custom edges, zoom, pan, minimap).
3. Sử dụng **Zustand** quản lý global state (dễ tích hợp với Web Worker, payload nhẹ).
4. Sử dụng **Vanilla CSS / CSS Modules** với design tokens cho phong cách giao diện Dark Cyberpunk / Cloud Console.

## Consequences
- **Ưu điểm**:
  - React Flow đã giải quyết bài toán drag-and-drop, bounding box, connection handles, zoom & pan chuẩn xác.
  - Vite đem lại trải nghiệm build và dev server cực nhanh.
  - Không phát sinh chi phí server hosting cho MVP (có thể deploy trên GitHub Pages hoặc Vercel free tier).
- **Nhược điểm & Biện pháp**:
  - React Flow render bằng SVG/HTML DOM có thể bị chậm nếu số node > 500. Với quy mô 10–50 node mỗi màn chơi, hiệu năng hoàn toàn mượt mà.
  - Các hạt packet di chuyển sẽ được vẽ trên Canvas overlay độc lập để không làm giật lag DOM của React Flow.
