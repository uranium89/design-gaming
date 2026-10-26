# Technical Spec: S-010 Màn 3 - Săn Sale Thời Trang (Level 03: Flash Deals Fashion)

- **Status**: Ready for Implementation
- **Risk Level**: 🟢 Low (Kế thừa cơ chế Load Balancer Failover từ S-009 và hệ thống Level Definition)
- **Author**: Architect

## 1. Technical Approach
1. **Dữ liệu Màn 3 (`src/levels/level03.ts`)**:
   - `LEVEL_03: LevelDefinition`:
     - Base RPS: 500 RPS, Spike Peak: 4,000 RPS (15s).
     - Tỉ lệ: 70% Read, 30% Write (`writeRatio: 0.30`).
     - Ngân sách tối đa: $250/tháng, P95 Target: 120ms, SLA Target: 99.9%.
     - Bảng vẽ khởi đầu: Chỉ có `User Traffic` ($0).
     - Kiến trúc mẫu 3★: 1 Load Balancer ($25) + 2 App Servers Medium ($45 x 2 = $90) + 1 Redis Cache/Session ($25) + 1 PostgreSQL DB ($40) = $180/tháng (<= $250).
2. **Sự kiện Chaos Crash trong `src/simulation/simulationWorker.ts`**:
   - Khi chạy Màn 3 (`hasChaosCrashEvent: true`), trong khoảng thời gian giây thứ 35 đến 42 (giữa đợt spike):
     - Hệ thống tự động kích hoạt sự cố Memory Leak làm sập 1 node máy chủ App Server (`status: 'crashed'`).
     - Nếu chỉ có 1 App Server duy nhất (Single Point of Failure): Hệ thống chết đứng, 100% traffic bị drop, vi phạm SLA, 0 sao.
     - Nếu có từ 2 App Servers trở lên đằng sau Load Balancer: Load Balancer tự động kích hoạt Health Check cô lập máy chủ hỏng và chuyển hướng lưu lượng sang các máy chủ còn lại, đảm bảo hệ thống vượt qua đợt spike với SLA >= 99.9% và đạt 3 sao.
3. **Cập nhật PostgreSQL DB trong Toolbox (`src/components/SidebarDock/SidebarDock.tsx`)**:
   - Cập nhật công suất `PostgreSQL DB` lên 2,000 RPS để đáp ứng 1,480 RPS (gồm 1,200 Write RPS + 280 Cache miss RPS) ở Màn 3.
4. **Cập nhật TopBar & App State (`src/levels/index.ts`, `src/App.tsx`)**:
   - Đưa `LEVEL_03` vào `ALL_LEVELS = [LEVEL_01, LEVEL_02, LEVEL_03]`.
   - Menu Level Switcher hiển thị 3 màn chơi: `Level 1: The Bakery`, `Level 2: Tech News`, `Level 3: Flash Deals`.

## 2. File Manifest (Write Zone)
- `src/levels/level03.ts`: Định nghĩa thông số Màn 3.
- `src/levels/index.ts`: Bổ sung export `LEVEL_03`.
- `src/components/SidebarDock/SidebarDock.tsx`: Nâng công suất PostgreSQL DB lên 2,000 RPS.
- `src/simulation/simulationWorker.ts`: Tích hợp Chaos Crash Event cho Màn 3.
- `src/simulation/useSimulation.ts`: Đồng bộ cờ `hasChaosCrashEvent`.
- `tests/unit/level03FlashDeals.test.tsx`: Test kiểm chứng Màn 3 với sự cố sập server, so sánh SPOF (0 sao) và Multi-App Server (3 sao).

## 3. Verification Criteria
- `npm test`: PASS 100% toàn bộ test suites.
- `npm run build`: Production build thành công.
