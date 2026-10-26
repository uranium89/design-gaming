# Technical Spec: S-009 Load Balancer Health Check & Failover Event

- **Status**: Ready for Implementation
- **Risk Level**: 🟡 Med (Cơ chế phân phối tải động dựa trên trạng thái sức khỏe của target nodes)
- **Author**: Architect

## 1. Technical Approach
1. **Dynamic Target Pool Filtering trong `src/simulation/engineMath.ts`**:
   - Khi Load Balancer forward traffic downstream:
     - Lọc danh sách `healthyTargets`: các target có `targetNode.data.status !== 'crashed'`.
     - Nếu `healthyTargets.length > 0`:
       - `sharePerTarget = rpsOut / healthyTargets.length`.
       - Chỉ chuyển tiếp `sharePerTarget` vào các `healthyTargets`.
       - Các target bị `crashed` nhận 0 RPS.
     - Nếu `healthyTargets.length === 0` (tất cả server backend đều sập):
       - Load Balancer rơi vào trạng thái lỗi 503 (`overloaded`), toàn bộ `rpsOut` bị drop (`totalDroppedRps += rpsOut`), không có traffic đi tiếp.
2. **Nút Mô phỏng Sự cố (Chaos Injection) trên Inspector (`src/components/Inspector/Inspector.tsx`)**:
   - Bổ sung nút bấm trong Inspector:
     - Nếu node đang hoạt động: `"🚨 Đánh sập node (Simulate Crash)"` $\rightarrow$ cập nhật `status: 'crashed'`.
     - Nếu node đang sập: `"🔄 Khởi động lại (Recover Server)"` $\rightarrow$ khôi phục `status: 'healthy'`.
3. **Hiển thị trực quan Cạnh kết nối khi Failover (`src/components/ParticleEdge/ParticleEdge.tsx`)**:
   - Nhận diện nếu target node có `status === 'crashed'`:
     - Cạnh nối đổi màu viền sang đỏ mờ / xám ngắt quãng (`stroke: '#ef4444'`, `strokeDasharray: '4 4'`).
     - Tắt chuyển động của các hạt packet trên cạnh đó (`particleSpeed = 0` hoặc ẩn hạt).
     - Giúp người chơi thấy trực quan luồng packet tự động chuyển hướng 100% sang các cạnh dẫn tới máy chủ khỏe mạnh.

## 2. File Manifest (Write Zone)
- `src/simulation/engineMath.ts`: Bổ sung lọc `healthyTargets` và xử lý 503 khi toàn bộ backend sập.
- `src/components/Inspector/Inspector.tsx` & `Inspector.module.css`: Thêm nút Chaos Crash/Recover node.
- `src/components/ParticleEdge/ParticleEdge.tsx`: Hiệu ứng đổi màu cạnh và ngắt hạt khi target bị sập.
- `tests/unit/loadBalancerFailover.test.tsx`: Bộ test kiểm chứng auto failover và zero-drop khi 1 node bị sập.

## 3. Verification Criteria
- `npm test`: PASS tất cả tests, bao gồm test chia tải khi 1 node bị crash và test 503 khi toàn bộ sập.
- `npm run build`: Build production sạch sẽ không lỗi.
