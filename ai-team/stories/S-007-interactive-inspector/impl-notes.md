# Implementation Notes: S-007 Component Inspector Tương tác cao

- **Author**: Coder / Frontend Dev
- **Date**: 2026-10-26
- **Loop**: 1

## Summary of Changes
1. **NodeData Type Definition (`src/state/graphStore.ts`)**:
   - Mở rộng kiểu dữ liệu `NodeData` thêm `tier?: 'small' | 'medium' | 'large'` và `algorithm?: 'round-robin' | 'least-connections' | 'ip-hash'`.
2. **Interactive Inspector Component (`src/components/Inspector/Inspector.tsx`)**:
   - Thêm bộ hiển thị Icon và tên linh kiện theo chuẩn Design System.
   - Hiển thị badge trạng thái động: `Hoạt động tốt` (Xanh), `Cảnh báo tải` (Vàng), `Quá tải / Sập` (Đỏ).
   - Tích hợp thanh đo tải thời gian thực **Realtime Utilization Meter**:
     - Tính tỷ lệ phần trăm `% Tải = currentRps / capacityRps`.
     - Thanh đo tự động đổi màu mượt mà theo 3 dải tải: Xanh (<70%), Vàng (70-99%), Đỏ (>=100%).
   - Tích hợp bộ chuyển đổi quy mô phần cứng **Instance Tier Switcher** (cho Compute/App Server):
     - `Small` (2C/4GB, 500 RPS, $20/m, 25ms).
     - `Medium` (4C/8GB, 1,500 RPS, $45/m, 20ms).
     - `Large` (8C/16GB, 4,000 RPS, $90/m, 15ms).
     - Khi chuyển tier, chi phí và công suất lập tức đồng bộ lên toàn bộ ứng dụng và thanh TopBar.
   - Tích hợp bộ chọn thuật toán điều phối tải **Algorithm Selector** (cho Load Balancer):
     - Least Connections, Round Robin, IP Hash.
   - Nút Xóa linh kiện (Remove Component) với icon thùng rác và hover hiệu ứng cảnh báo.
   - Nút đóng Inspector (✕) để hủy chọn node.
3. **Inspector Styling (`src/components/Inspector/Inspector.module.css`)**:
   - Hoàn thiện giao diện Dark Console với hiệu ứng kính mờ `backdrop-filter: blur(12px)`.
   - Grid 3 cột cho Tier Switcher và thanh tiến trình bo góc toàn phần.

## Verification
- `npm test`: 30/30 tests PASS (bao gồm 7 test case trong `graph.test.tsx` kiểm tra trọn vẹn chuyển đổi Tier và đổi thuật toán).
- `npm run build`: Compile thành công trong 215ms.
- `npm audit`: 0 vulnerabilities.
