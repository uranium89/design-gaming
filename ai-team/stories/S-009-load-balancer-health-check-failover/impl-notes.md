# Implementation Notes: S-009 Load Balancer Health Check & Failover Event

- **Status**: Implemented
- **Loop**: 1
- **Author**: Coder

## 1. What Changed
1. **Toán học Phân phối Tải có Health Check (`src/simulation/engineMath.ts`)**:
   - Khi Load Balancer điều hướng lưu lượng: tự động lọc danh sách `healthyTargets` (`status !== 'crashed'`).
   - Phân bổ lưu lượng đều cho các target khỏe mạnh; các node bị `crashed` tự động nhận 0 RPS.
   - Nếu tất cả các target downstream đều sập: Load Balancer rơi vào trạng thái quá tải lỗi 503, drop 100% request.
   - Khởi tạo mặc định `nodeUpdates` cho toàn bộ các node trong đồ thị để đảm bảo tính sẵn sàng của thông tin trạng thái.
2. **Nút Mô phỏng Sự cố Chaos Engineering (`src/components/Inspector/Inspector.tsx` & `Inspector.module.css`)**:
   - Thêm phần "Mô phỏng sự cố (Chaos Engineering)" trên Inspector.
   - Cho phép người chơi chủ động bấm "🚨 Đánh sập node (Simulate Crash)" để chuyển node sang `status: 'crashed'`, hoặc "🔄 Khởi động lại (Recover Server)" để đưa node về `status: 'healthy'`.
3. **Trực quan hóa Cạnh kết nối khi Failover (`src/components/ParticleEdge/ParticleEdge.tsx` & `ParticleEdge.module.css`)**:
   - Bổ sung class `.edgeCrashed` viền nét đứt màu đỏ nhạt khi node đích bị sập.
   - Dừng hoàn toàn việc bắn hạt packet sang node bị sập, giúp người chơi thấy dòng hạt tự động chuyển hướng sang các server khỏe mạnh.

## 2. Verification Evidence
- `npm test`: 39/39 tests PASSING across 8 test suites.
- `npm run build`: Production build thành công trong 143ms.
