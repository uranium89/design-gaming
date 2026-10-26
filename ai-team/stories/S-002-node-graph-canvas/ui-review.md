# UI Review: S-002 Bảng vẽ Đồ thị Kiến trúc với React Flow (Node Graph Canvas)

## Loop 1
- **UI Designer**: Strong Model
- **Verdict**: PASS

### 1. Code & UI Inspection
- **Custom Node Styling**: `src/components/CustomNode/CustomNode.module.css` tuân thủ đúng kích thước 200px, bo góc 8px, viền sáng khi được chọn, icon Lucide sắc nét, status dot tròn có hiệu ứng glow màu (xanh/vàng/đỏ).
- **Handles Positioning**: Handle Target bên trái (màu indigo `#6366f1`) và Handle Source bên phải (màu xanh lá `#10b981`) có viền trắng tương phản cao, dễ nhìn thấy để nối dây.
- **Canvas Environment**: Tích hợp `@xyflow/react` với Dots pattern, Controls góc dưới bên trái, MiniMap góc dưới bên phải với theme tối tinh tế.
- **Inspector Panel**: Vị trí nổi góc phải dưới, hiệu ứng kính mờ (glassmorphism), typography rõ ràng, nút xóa linh kiện có màu đỏ cảnh báo.

### 2. State & Interaction Verification
- Kiểm thử tương tác trong `tests/unit/graph.test.tsx` (5 tests) xác minh đầy đủ trạng thái selection, hover, edit capacity và xóa component.
