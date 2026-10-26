# S-002: Bảng vẽ Đồ thị Kiến trúc với React Flow (Node Graph Canvas)

Status: Done

## User Story
As a player,  
I want to drag infrastructure components from the dock onto the canvas and connect them with wires,  
So that I can construct a complete software system architecture.

## Acceptance Criteria
- [x] Người chơi có thể kéo một node từ Sidebar Dock thả vào bất kỳ vị trí nào trên Canvas.
- [x] Hỗ trợ 4 loại node cơ bản ban đầu: User Traffic Node, Load Balancer Node, App Server Node, Database Node.
- [x] Người chơi có thể kéo dây kết nối (Edge) từ Output handle của node này sang Input handle của node khác.
- [x] Cho phép xóa node hoặc xóa dây nối bằng phím Delete/Backspace hoặc nút thao tác.
- [x] Khi click chọn một Node, bảng Inspector bên dưới hiển thị thông tin chi tiết và cho phép tùy biến thông số cơ bản (ví dụ: instance capacity, timeout).

## Out of Scope
- Dòng hạt packet chuyển động thời gian thực (thuộc S-004).
- Bộ mô phỏng toán học Web Worker (thuộc S-003).

## Assumptions
- Dùng thư viện `@xyflow/react` như đã duyệt trong ADR 0001.

## Acceptance
- **Accepted by**: Product Owner (Loop 1)
- **Evidence**:
  - Criterion 1: Met - [test-result.md](test-result.md#acceptance-criteria-verification), `src/components/CanvasArea/CanvasArea.tsx:L45-L77`
  - Criterion 2: Met - `src/components/SidebarDock/SidebarDock.tsx:L6-L57`, `src/state/graphStore.ts`
  - Criterion 3: Met - [test-result.md](test-result.md#acceptance-criteria-verification), `tests/unit/graph.test.tsx:L39-L50`
  - Criterion 4: Met - [test-result.md](test-result.md#acceptance-criteria-verification), `tests/unit/graph.test.tsx:L69-L81`
  - Criterion 5: Met - [test-result.md](test-result.md#acceptance-criteria-verification), `tests/unit/graph.test.tsx:L52-L67`
  - Security Gate: PASS - [security.md](security.md)
  - Reviewer Verdict: APPROVED - [review.md](review.md)

