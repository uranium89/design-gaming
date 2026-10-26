# Implementation Notes: S-008 Màn 2 - Tin Tức Nóng / Dịch Vụ Rút Gọn URL

- **Status**: Implemented
- **Loop**: 1
- **Author**: Coder

## 1. What Changed
1. **Linh kiện Redis Cache (`src/components/SidebarDock/SidebarDock.tsx`)**:
   - Thêm linh kiện `cache-redis`: Category: `storage`, Cost: $25, Capacity: 20,000 RPS, Added Latency: 1ms.
2. **Cơ chế Mô phỏng Cache Hit/Miss (`src/simulation/engineMath.ts`)**:
   - Tích hợp công thức hấp thụ 90% tải đọc (`hitTraffic = rpsOut * (1 - writeRatio) * 0.90`).
   - Các request hit được hoàn tất ngay tại Cache với độ trễ siêu thấp 1ms.
   - Chỉ 10% Cache miss và 100% write request mới chuyển tiếp xuống Database.
   - Khi không có Cache: 2,500 RPS dồn thẳng xuống Database (600 RPS capacity) gây drop 1,900 RPS (~76% error rate).
   - Phân biệt Database bền vững và In-Memory Cache: nếu có write request mà thiếu Database thì cảnh báo mất dữ liệu (Data Loss).
3. **Cấu hình Màn 2 (`src/levels/level02.ts` & `src/levels/index.ts`)**:
   - Base 300 RPS, Peak Spike 2,500 RPS (15s).
   - Ngân sách trần: $100/tháng, Latency target: 80ms, SLA: 99.5%, Write ratio: 0.01 (99% Read, 1% Write).
   - Bảng vẽ khởi đầu sạch: Chỉ có `User Traffic` ($0).
   - Kiến trúc mẫu 3★: 1 App Server Medium ($45) + 1 Redis Cache ($25) + 1 Micro DB ($10) = $80/tháng (<= $100).
4. **Bộ chọn Màn chơi (Level Switcher) (`src/components/TopBar/TopBar.tsx` & `TopBar.module.css`)**:
   - Bổ sung Level Switcher dropdown trên TopBar cho phép chuyển đổi giữa Level 1: The Bakery và Level 2: Tech News.
   - Khi đổi màn chơi, reset bảng vẽ về node khởi đầu của màn đó và tự động mở Briefing.
5. **Cấu hình Worker & State App (`src/simulation/useSimulation.ts`, `simulationWorker.ts`, `src/App.tsx`)**:
   - `useSimulation(currentLevel)` tự động đồng bộ `baseRps`, `spikeRps`, `budgetLimit`, `writeRatio` xuống Web Worker.
   - Modal chấm điểm và reset lấy đúng tham số của màn chơi đang chọn.

## 2. Verification Evidence
- `npm test`: 34/34 tests PASS across 7 test suites.
- `npm run build`: Build production sạch trong 157ms (`build/index.html`, `build/assets/`).
- `npm audit`: 0 vulnerabilities.
