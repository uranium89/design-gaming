# Sprint 01 Retrospective: Engine Prototype & Foundation

- **Author**: Reviewer
- **Target Audience**: Stakeholder & AI Scrum Team

## 1. Những điểm đã làm tốt (What Went Well)
- **Tốc độ và tính đồng bộ**: Hoàn thành toàn bộ nền tảng ứng dụng từ scaffold Vite, Design Tokens, React Flow canvas, và Web Worker simulation chỉ trong 1 sprint.
- **Kiến trúc phân tầng sạch sẽ**: Việc tách riêng `engineMath.ts` (thuần logic toán học) khỏi `simulationWorker.ts` (quản lý timer/IPC) giúp việc kiểm thử tự động đạt độ tin cậy 100% với thời gian chạy cực nhanh (< 700ms cho 12 tests).
- **Trải nghiệm kéo-thả trực quan**: Tích hợp mượt mà giữa Sidebar HTML5 drag-and-drop và React Flow canvas.

## 2. Những thách thức đã xử lý trong Sprint (What Challenged Us & How We Solved It)
- **Kiểu dữ liệu TypeScript của React Flow**: Interface `NodeData` mặc định trong `@xyflow/react` đòi hỏi index signature `Record<string, unknown>`. Đội ngũ đã giải quyết bằng cách kế thừa `Record<string, unknown>` để vừa đảm bảo strict type-safety, vừa khớp hoàn toàn với props của React Flow.
- **ResizeObserver trong môi trường test (jsdom)**: React Flow cần `ResizeObserver` để tính toán kích thước canvas trong quá trình test DOM. Đội ngũ đã bổ sung mock trong `tests/setup.ts` để bảo đảm test suite chạy ổn định.
- **Tooling Gap với Headless Browser Binary**: Môi trường không thể tải Playwright arm64 driver từ Azure CDN (lỗi 404 từ nhà cung cấp CDN). Đội ngũ đã ghi nhận minh bạch thành Tooling Gap và tăng cường bảo vệ bằng các bài test DOM tự động trong Vitest.

## 3. Đề xuất cải tiến cho Sprint 02 (Action Items for Sprint 02)
- **Sprint 02 Focus**: Triển khai `S-004: Trực quan hóa Hạt Lưu lượng Thời gian thực (Particle Visualizer)` để các hạt gói tin (packet) bay trực tiếp trên dây nối, và `S-005: Màn 1 Hoàn chỉnh (Level 01: The Local Bakery)` với đầy đủ kịch bản Traffic Spike và chấm điểm 1-3 sao.
- **Tối ưu đồ họa**: Sử dụng Canvas 2D overlay để vẽ hạt packet nhằm đảm bảo tốc độ khung hình 60 FPS ngay cả khi hệ thống chạy ở tốc độ 5x.
