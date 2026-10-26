# S-001: Nền tảng Thiết kế Giao diện (Design Foundation)

Status: Ready

## User Story
As a player,  
I want to see a sleek, cohesive dark-mode UI with clear navigation, header metrics bar, component dock, and canvas grid,  
So that I feel immersed in a modern high-tech system architecture environment.

## Acceptance Criteria
- [ ] Giao diện áp dụng bảng màu và design tokens thống nhất (Header, Sidebar Dock, Canvas background grid).
- [ ] Header hiển thị đầy đủ: Tên game, tên bài toán/màn chơi, thanh đồng hồ/tốc độ (1x/2x/5x), và các chỉ số live metrics (RPS, P95, Cost, Budget).
- [ ] Sidebar Dock bên trái liệt kê các danh mục linh kiện (Routing, Compute, Storage, Messaging) với icon trực quan.
- [ ] Không gian Canvas ở giữa có họa tiết lưới tọa độ (grid), hỗ trợ phóng to/thu nhỏ (zoom) và di chuyển (pan).
- [ ] Ứng dụng hiển thị mượt mà trên desktop màn hình rộng (tối thiểu 1280x720 và tối ưu cho 1440px+).

## Out of Scope
- Logic tính toán dòng tải thực tế của Web Worker (thuộc story S-003).
- Chức năng lưu trữ đám mây hoặc đăng nhập tài khoản.

## Assumptions
- Sử dụng phong cách thiết kế được stakeholder lựa chọn trong DEC-001.

## Acceptance
_Filled by the product-owner after testing and visual review._
