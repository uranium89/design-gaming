# S-007: Component Inspector Tương tác cao (Interactive Inspector & Instance Scaling)

Status: Done

## User Story
As a player,  
I want to click on any node on the canvas to open the Inspector Panel, configure instance sizes (Small / Medium / Large), choose load balancing algorithms, and inspect real-time utilization (Current RPS / Capacity),  
So that I can scale my infrastructure, tune performance, and optimize costs interactively.

## Acceptance Criteria
- [x] Bảng điều khiển Inspector trượt mở khi click chọn một Node trên canvas, hiển thị icon, tên, danh mục và chi phí $/tháng tương ứng.
- [x] Cho phép tùy chỉnh cấu hình phần cứng:
  - Với App Server (VM): Chọn Instance Tier (Small: 500 RPS / $20, Medium: 1,500 RPS / $45, Large: 4,000 RPS / $90), chi phí và công suất cập nhật tức thì lên Canvas và thanh TopBar.
  - Với Load Balancer: Chọn thuật toán phân phối (Round Robin, Least Connections, IP Hash).
- [x] Hiển thị thanh đo tải thời gian thực (Utilization Meter): Tỉ lệ % Tải hiện tại / Công suất tối đa, tự động đổi màu theo mức tải: Xanh (<70%), Vàng (70-99%), Đỏ (>=100% quá tải).
- [x] Có nút "Xóa linh kiện" (Remove Component) kèm phím tắt hoặc nút bấm để dọn dẹp node thừa.
- [x] Hỗ trợ đóng Inspector khi click ra ngoài khoảng trống canvas hoặc bấm nút đóng (✕).

## Out of Scope
- Cấu hình mạng VPC chi tiết (Subnet, Security Group, CIDR).
- Biểu đồ lịch sử Time-series lưu trữ trên đám mây.

## Assumptions
- Dữ liệu cấu hình các tier bám sát bảng thông số phần cứng trong GDD Section 2.2.

## Acceptance
- **Accepted by**: product-owner
- **Date**: 2026-10-26
- **Evidence**:
  - Test Results: [test-result.md](file:///Users/vinhpham/Documents/GitHub/design-gaming/ai-team/stories/S-007-interactive-inspector/test-result.md) (30/30 tests pass).
  - UI Conformance: [ui-review.md](file:///Users/vinhpham/Documents/GitHub/design-gaming/ai-team/stories/S-007-interactive-inspector/ui-review.md) (PASS).
  - Security Gate: [security.md](file:///Users/vinhpham/Documents/GitHub/design-gaming/ai-team/stories/S-007-interactive-inspector/security.md) (0 vulnerabilities).
  - Code Review: [review.md](file:///Users/vinhpham/Documents/GitHub/design-gaming/ai-team/stories/S-007-interactive-inspector/review.md) (APPROVED).
