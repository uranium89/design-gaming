# S-001: Nền tảng Thiết kế Giao diện (Design Foundation)

Status: Done

## User Story
As a player,  
I want to see a sleek, cohesive dark-mode UI with clear navigation, header metrics bar, component dock, and canvas grid,  
So that I feel immersed in a modern high-tech system architecture environment.

## Acceptance Criteria
- [x] Giao diện áp dụng bảng màu và design tokens thống nhất (Header, Sidebar Dock, Canvas background grid).
- [x] Header hiển thị đầy đủ: Tên game, tên bài toán/màn chơi, thanh đồng hồ/tốc độ (1x/2x/5x), và các chỉ số live metrics (RPS, P95, Cost, Budget).
- [x] Sidebar Dock bên trái liệt kê các danh mục linh kiện (Routing, Compute, Storage, Messaging) với icon trực quan.
- [x] Không gian Canvas ở giữa có họa tiết lưới tọa độ (grid), hỗ trợ phóng to/thu nhỏ (zoom) và di chuyển (pan).
- [x] Ứng dụng hiển thị mượt mà trên desktop màn hình rộng (tối thiểu 1280x720 và tối ưu cho 1440px+).

## Out of Scope
- Logic tính toán dòng tải thực tế của Web Worker (thuộc story S-003).
- Chức năng lưu trữ đám mây hoặc đăng nhập tài khoản.

## Assumptions
- Sử dụng phong cách thiết kế được stakeholder lựa chọn trong DEC-001.

## Acceptance
- **Accepted by**: Product Owner (Loop 1)
- **Evidence**:
  - Criterion 1: Met - [test-result.md](test-result.md), `src/styles/tokens.css`
  - Criterion 2: Met - [test-result.md](test-result.md#automated-test-evidence), `tests/unit/foundation.test.tsx`
  - Criterion 3: Met - [test-result.md](test-result.md#automated-test-evidence), `src/components/SidebarDock/SidebarDock.tsx`
  - Criterion 4: Met - `src/components/CanvasArea/CanvasArea.module.css` (lưới 20px x 20px)
  - Criterion 5: Met - `npm run build` thành công, bundle 151KB
  - Security Gate: PASS - [security.md](security.md)
  - Reviewer Verdict: APPROVED - [review.md](review.md)

