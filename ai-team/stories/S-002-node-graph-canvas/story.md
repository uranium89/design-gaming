# S-002: Bảng vẽ Đồ thị Kiến trúc với React Flow (Node Graph Canvas)

Status: Draft

## User Story
As a player,  
I want to drag infrastructure components from the dock onto the canvas and connect them with wires,  
So that I can construct a complete software system architecture.

## Acceptance Criteria
- [ ] Người chơi có thể kéo một node từ Sidebar Dock thả vào bất kỳ vị trí nào trên Canvas.
- [ ] Hỗ trợ 4 loại node cơ bản ban đầu: User Traffic Node, Load Balancer Node, App Server Node, Database Node.
- [ ] Người chơi có thể kéo dây kết nối (Edge) từ Output handle của node này sang Input handle của node khác.
- [ ] Cho phép xóa node hoặc xóa dây nối bằng phím Delete/Backspace hoặc nút thao tác.
- [ ] Khi click chọn một Node, bảng Inspector bên dưới hiển thị thông tin chi tiết và cho phép tùy biến thông số cơ bản (ví dụ: instance capacity, timeout).

## Out of Scope
- Dòng hạt packet chuyển động thời gian thực (thuộc S-004).
- Bộ mô phỏng toán học Web Worker (thuộc S-003).

## Assumptions
- Dùng thư viện `@xyflow/react` như đã duyệt trong ADR 0001.

## Acceptance
_Filled by the product-owner after testing and visual review._
