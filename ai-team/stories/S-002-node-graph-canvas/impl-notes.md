# Implementation Notes: S-002 Bảng vẽ Đồ thị Kiến trúc với React Flow (Node Graph Canvas)

## Loop 1
- **Developer**: Coder
- **Changes**:
  1. Tạo `src/state/graphStore.ts` sử dụng Zustand kết hợp `@xyflow/react` helpers (`applyNodeChanges`, `applyEdgeChanges`, `addEdge`) để quản lý toàn bộ đồ thị mạng, các node mặc định (User Traffic, App Server, Database) và 2 dây kết nối ban đầu.
  2. Xây dựng component `CustomNode` (`src/components/CustomNode/CustomNode.tsx`) hiển thị đầy đủ icon, tên linh kiện, status dot (xanh/vàng/đỏ), capacity RPS, added latency, cost $/tháng, và các Handles tròn (Target ở bên trái, Source ở bên phải).
  3. Cập nhật `src/components/SidebarDock/SidebarDock.tsx` hỗ trợ HTML5 Drag & Drop API (`draggable`, `onDragStart` đóng gói metadata vào `application/reactflow`).
  4. Cập nhật `src/components/CanvasArea/CanvasArea.tsx` tích hợp `ReactFlow`, `Background` (Dots pattern), `Controls`, `MiniMap`, sự kiện `onDrop` tự động tính toán tọa độ qua `screenToFlowPosition` và thêm node mới vào canvas.
  5. Xây dựng component `Inspector` (`src/components/Inspector/Inspector.tsx`) hiển thị ở góc phải dưới khi người chơi click chọn một node, cho phép tinh chỉnh `capacityRps` và xóa linh kiện.
  6. Xây dựng test suite `tests/unit/graph.test.tsx` (5 unit tests) kiểm thử toàn diện việc khởi tạo graph, thêm node, kết nối dây edge, chỉnh sửa capacity và xóa node qua Inspector.

- **Verification Command & Output**:
  - `npm run build`: Hoàn thành thành công (0 errors, 336KB JS, 23.4KB CSS).
  - `npm test`: 8/8 tests PASS trên cả 2 test suites.
