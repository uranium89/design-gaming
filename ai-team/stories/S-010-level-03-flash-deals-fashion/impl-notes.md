# Implementation Notes: S-010 Màn 3 - Săn Sale Thời Trang (Level 03: Flash Deals Fashion)

- **Status**: Implemented
- **Loop**: 1
- **Author**: Coder

## 1. What Changed
1. **Cấu hình Màn 3 (`src/levels/level03.ts` & `src/levels/index.ts`)**:
   - `LEVEL_03`: Tải cơ bản 500 RPS, Peak Spike 4,000 RPS (15s).
   - Tỉ lệ: 70% Read, 30% Write (`writeRatio: 0.30`).
   - Ngân sách: $250/tháng, P95 Target: 120ms, SLA: 99.9%.
   - Cờ sự cố `hasChaosCrashEvent: true`.
   - Bảng vẽ khởi đầu: Chỉ có `User Traffic` ($0).
   - Kiến trúc mẫu 3★: 1 Load Balancer ($25) + 2 App Servers Medium ($45 x 2 = $90) + 1 Redis Cache/Session ($25) + 1 PostgreSQL DB ($40) = $180/tháng (<= $250).
2. **Sự kiện Tự động Crash Server trong Worker (`src/simulation/simulationWorker.ts` & `useSimulation.ts`)**:
   - Khi `hasChaosCrashEvent` được bật: từ giây 35 đến 45 trong đợt spike, tự động kích hoạt sự cố sập 1 node máy chủ App Server.
   - Nếu hệ thống dùng 1 máy chủ duy nhất (SPOF): Toàn bộ lưu lượng bị drop (100% failure).
   - Nếu hệ thống có Load Balancer và 2 máy chủ: Load Balancer tự động failover sang máy chủ còn lại, duy trì lưu lượng với SLA >= 99.9%.
3. **Nâng cấp PostgreSQL DB (`src/components/SidebarDock/SidebarDock.tsx`)**:
   - Nâng công suất `PostgreSQL DB` lên 2,000 RPS để đáp ứng 1,480 RPS (gồm 1,200 Write RPS + 280 miss reads) tại Màn 3.
4. **Bộ chọn Màn chơi 3 Cấp độ (`src/levels/index.ts`)**:
   - Export `ALL_LEVELS = [LEVEL_01, LEVEL_02, LEVEL_03]`. Level Switcher trên TopBar cho phép chuyển đổi tức thì giữa cả 3 màn chơi.

## 2. Verification Evidence
- `npm test`: 44/44 tests PASS across 9 test suites.
- `npm run build`: Production bundle hoàn thành trong 147ms.
- `npm audit`: 0 vulnerabilities.
