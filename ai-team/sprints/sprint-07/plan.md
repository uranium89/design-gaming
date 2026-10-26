# Sprint 07 Plan: 4 Đế Chế Đám Mây & Chế Độ Sandbox Tự Do (Cloud Empires & Sandbox Mode)

## Sprint Goal
Triển khai trọn vẹn **Hệ thống 4 Đế chế Đám mây (Freestyle, AWS, Azure, GCP)** theo đúng tài liệu Game Design Document (GDD Mục 2 & Mục 5), bổ sung kho linh kiện mang thương hiệu và thông số đặc thù của từng nhà cung cấp, đồng thời xây dựng **Chế độ Sandbox (Tự do thiết kế)** với thanh trượt điều khiển lưu lượng và cơ chế **Lưu trữ tiến trình chơi (LocalStorage Star Tracking)**.

## Ordered Stories
1. **[S-015: Hệ Thống 4 Đế Chế Đám Mây (Cloud Empires: Freestyle, AWS, Azure, GCP) & Kho Linh Kiện Nhà Cung Cấp](../stories/S-015-cloud-empires-component-catalogs/story.md)**:
   - Thanh chọn tab Đế chế trên SidebarDock: `Freestyle (FOSS)`, `AWS`, `Azure`, `GCP`.
   - Danh mục linh kiện có thương hiệu, màu sắc, icon và thông số riêng của 4 nhà cung cấp đám mây.
   - Badge nhận diện và phong cách hiển thị riêng trên Canvas Node và Component Inspector.
   - Tính toán tải và chi phí linh kiện theo từng hệ sinh thái đám mây.
   - Risk: 🟡 Medium.

2. **[S-016: Chế Độ Sandbox Tự Do & Lưu Trữ Tiến Trình Chơi (LocalStorage Star Tracking)](../stories/S-016-sandbox-mode-progress-persistence/story.md)**:
   - Tùy chọn `Chế độ Sandbox (Tự Do Thiết Kế)` trên TopBar level switcher.
   - Bảng điều khiển lưu lượng tùy biến (Traffic Injector Slider 100 - 50,000 RPS, Read/Write Ratio slider 0% - 100%) trong Sandbox.
   - Lưu trữ số sao đạt được (⭐⭐⭐) và điểm số cao nhất của từng Level vào `localStorage`.
   - Hiển thị huy hiệu sao trực quan trên thanh chọn Level.
   - Risk: 🟢 Low.

## What the Stakeholder Will Be Able to Try
1. Chuyển đổi giữa 4 tab **Freestyle | AWS | Azure | GCP** trên thanh công cụ bên trái. Kéo thả các linh kiện có thương hiệu chính hãng như **AWS ALB, EC2, ElastiCache, SQS; Azure App Gateway, Cosmos DB; GCP Cloud LB, Cloud Run, Cloud Spanner**.
2. Chọn **Chế độ Sandbox** để tự do lắp ráp bất kỳ hệ thống phân tán nào của 4 đế chế, tự kéo thanh trượt thử tải từ 100 RPS lên 50,000 RPS xem hệ thống chịu lỗi ra sao.
3. Chơi và nhận sao từ Level 1 đến Level 5; khi F5 tải lại trang web, toàn bộ sao và điểm số cao nhất đều được lưu giữ nguyên vẹn trên thanh TopBar.
