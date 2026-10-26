# Technical Spec: S-006 Hoàn thiện Luật Kiến trúc & Cân bằng Màn 1

- **Status**: Implemented & Verified
- **Risk Level**: 🟢 Low (Cân bằng luật chơi, kiểm duyệt cạnh đồ thị và cập nhật component catalog)
- **Author**: Architect

## 1. Technical Approach
1. **Linh kiện `SQLite / Micro DB`**:
   - Khai báo component `db-sqlite` trong `src/components/SidebarDock/SidebarDock.tsx`: Cost: $10, Capacity: 150 RPS, Latency: 8ms.
   - Cập nhật `src/levels/level01.ts`: Kiến trúc mẫu 3★ gồm `User Traffic` $\rightarrow$ `App Server ($20)` $\rightarrow$ `SQLite / Micro DB ($10)` với tổng chi phí $30/tháng (<= $35).
2. **Khởi tạo Canvas cho Game Giải đố**:
   - `src/state/graphStore.ts`: `INITIAL_NODES` thu gọn về duy nhất `user-client-1` (User Traffic) tại vị trí `{ x: 80, y: 180 }`, `INITIAL_EDGES = []`.
   - `src/simulation/useSimulation.ts`: `DEFAULT_METRICS.costPerMonth = 0`.
3. **Thuật toán Kiểm duyệt Kiến trúc phân tầng (`src/simulation/engineMath.ts`)**:
   - Phát hiện kết nối trực tiếp `User Traffic` (hoặc routing) $\rightarrow$ `storage`:
     - Gán `status = 'crashed'` cho node storage.
     - `totalDroppedRps += rpsIn`, `rpsOut = 0`.
     - Xuất cảnh báo bảo mật nghiêm trọng.
   - Kiểm tra sự hiện diện của tầng `compute` và tầng `storage`:
     - Nếu thiếu `compute`: Không thể xử lý HTTP request.
     - Nếu có `compute` nhưng thiếu `storage` khi có yêu cầu ghi (`writeRatio > 0`): Kích hoạt trừ điểm mất mát dữ liệu (Data Loss).
4. **Bộ chấm điểm (`src/simulation/scoring.ts`)**:
   - Xử lý các cờ vi phạm: `hasDirectClientToStorage`, `hasComputeLayer`, `hasStorageLayer`.
   - Vi phạm bảo mật hoặc thiếu compute layer lập tức nhận 0 sao, 0 điểm.
   - Thiếu DB khi có Write nhận penalty 150đ và tối đa 2 sao.

## 2. File Manifest
- `src/components/SidebarDock/SidebarDock.tsx`
- `src/levels/level01.ts`
- `src/state/graphStore.ts`
- `src/simulation/engineMath.ts`
- `src/simulation/scoring.ts`
- `src/App.tsx`
- `tests/unit/graph.test.tsx`
- `tests/unit/particleEdge.test.tsx`
- `tests/unit/scoring.test.ts`
- `tests/unit/simulationMath.test.ts`
