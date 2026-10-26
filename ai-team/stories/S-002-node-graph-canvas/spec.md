# Technical Spec: S-002 Bảng vẽ Đồ thị Kiến trúc với React Flow (Node Graph Canvas)

- **Status**: Ready for Implementation
- **Risk Level**: 🟢 Low
- **Author**: Architect

## 1. Technical Approach
- Tích hợp thư viện `@xyflow/react` vào `src/components/CanvasArea/CanvasArea.tsx` thay thế placeholder cũ.
- Thiết lập ReactFlow Provider, Controls, Background (pattern 'dots' hoặc 'lines').
- Xây dựng hệ thống Custom Node Types chuẩn hóa:
  - `customNode`: Component card chung hiển thị Header, Icon, Status Indicator (Healthy/Warning/Overloaded), Metrics tóm tắt và Handles (Input / Output).
  - Handles sử dụng `@xyflow/react` (`Handle type="target"`, `Handle type="source"`).
- Kéo-thả bằng HTML5 Drag & Drop:
  - `SidebarDock` đính kèm metadata vào `event.dataTransfer.setData('application/reactflow', JSON.stringify(item))`.
  - `CanvasArea` lắng nghe `onDragOver` (preventDefault) và `onDrop` để tính toán tọa độ qua `screenToFlowPosition`.
- Quản lý trạng thái bằng Zustand tại `src/state/graphStore.ts`:
  - `nodes: Node[]`, `edges: Edge[]`, `selectedNodeId: string | null`.
  - Handlers: `onNodesChange`, `onEdgesChange`, `onConnect`, `addNode`, `updateNodeData`, `removeSelected`.
- Bảng điều khiển Inspector (`src/components/Inspector/Inspector.tsx`):
  - Hiển thị khi có node được chọn (`selectedNodeId`).
  - Cho phép điều chỉnh `capacityRps` và xóa node.

## 2. File Manifest (Write Zone)
- `src/state/graphStore.ts`: Zustand store quản lý nodes, edges, selection.
- `src/components/CustomNode/CustomNode.tsx` & `CustomNode.module.css`: Giao diện custom node của React Flow.
- `src/components/Inspector/Inspector.tsx` & `Inspector.module.css`: Panel chỉnh sửa thuộc tính node.
- `src/components/CanvasArea/CanvasArea.tsx`: Tích hợp ReactFlow, DnD handler, Background.
- `src/components/SidebarDock/SidebarDock.tsx`: Bổ sung draggable attribute và `onDragStart`.
- `tests/unit/graph.test.tsx`: Unit tests kiểm tra tạo node, kết nối dây và cập nhật trạng thái store.

## 3. Verification Criteria
- `npm run build`: Hoàn tất không lỗi.
- `npm test`: Tất cả graph unit tests đều PASS.
- Kéo-thả linh kiện sinh ra node mới đúng vị trí và nối được dây kết nối.
