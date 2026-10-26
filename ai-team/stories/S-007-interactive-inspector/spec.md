# Technical Spec: S-007 Component Inspector Tương tác cao

- **Status**: Ready for Implementation
- **Risk Level**: 🟢 Low (Giao diện điều khiển cấu hình node và state management)
- **Author**: Architect

## 1. Technical Approach
- Cập nhật định nghĩa dữ liệu node `NodeData` trong `src/state/graphStore.ts`:
  - Thêm trường `tier?: 'small' | 'medium' | 'large'`
  - Thêm trường `algorithm?: 'round-robin' | 'least-conn' | 'ip-hash'`
- Thiết kế hệ thống Tier presets theo chuẩn GDD Section 2.2:
  - **Compute (VM/App Server)**:
    - Small (2C/4GB): 500 RPS, $20/m, Latency 25ms.
    - Medium (4C/8GB): 1,500 RPS, $45/m, Latency 20ms.
    - Large (8C/16GB): 4,000 RPS, $90/m, Latency 15ms.
  - **Routing (Load Balancer)**:
    - Lựa chọn thuật toán: Least Connections (mặc định), Round Robin, IP Hash.
- Nâng cấp `src/components/Inspector/Inspector.tsx` & `Inspector.module.css`:
  - Thanh đo tải thực tế (Utilization Meter): Tỷ lệ % giữa `currentRps` và `capacityRps`.
  - Bộ chọn nút chuyển đổi Tier (Segmented Control / Select) phản hồi tức thì và cập nhật cost lên Store.
  - Nút Xóa linh kiện (Remove Component) với icon thùng rác và hover hiệu ứng cảnh báo đỏ.
  - Nút đóng (✕) ở góc trên để hủy chọn node.

## 2. File Manifest (Write Zone)
- `src/state/graphStore.ts`: Mở rộng kiểu dữ liệu `NodeData`.
- `src/components/Inspector/Inspector.tsx`: Nâng cấp giao diện Inspector tương tác.
- `src/components/Inspector/Inspector.module.css`: Thêm kiểu dáng Segmented Control, Utilization bar và Badge.
- `tests/unit/graph.test.tsx`: Bổ sung kiểm thử chuyển đổi Tier và cập nhật chi phí.

## 3. Verification Criteria
- `npm run build`: Không lỗi TypeScript.
- `npm test`: Tất cả tests pass bao gồm các test case tương tác Inspector mới.
- Click vào node App Server chuyển từ Small sang Medium: Chi phí tăng từ $20 lên $45, công suất tăng từ 500 lên 1,500 RPS.
