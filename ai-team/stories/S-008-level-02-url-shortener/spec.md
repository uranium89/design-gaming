# Technical Spec: S-008 Màn 2 - Tin Tức Nóng / Dịch Vụ Rút Gọn URL

- **Status**: Ready for Implementation
- **Risk Level**: 🟡 Med (Cơ chế phân tán Cache Hit/Miss và bộ chọn đa màn chơi)
- **Author**: Architect

## 1. Technical Approach
1. **Dữ liệu Màn 2 (`src/levels/level02.ts`)**:
   - `LEVEL_02: LevelDefinition`:
     - Base RPS: 300 RPS, Spike Peak: 2,500 RPS (15s).
     - Ngân sách trần: $100/tháng, P95 Target: 80ms, SLA: 99.5%.
     - Read ratio: 99%, Write ratio: 1%.
     - Kiến trúc mẫu 3★: 1 App Server Medium ($45) + 1 Redis Cache ($25) + 1 Micro DB ($10) = $80/tháng (<= $100) hoặc dùng Postgres ($40) kết hợp App Server ($45) nếu cấu hình tùy chỉnh.
2. **Cơ chế Mô phỏng Cache Hit/Miss (`src/simulation/engineMath.ts`)**:
   - Nhận diện node Cache qua `name.toLowerCase().includes('cache')` hoặc `category === 'storage' && icon === 'Database' && name.includes('Redis')`.
   - Với các request đọc (Read):
     - **Tỉ lệ Cache Hit**: 90% (trả về ngay với độ trễ 1ms).
     - **Tỉ lệ Cache Miss**: 10% (chỉ 10% lưu lượng đọc chuyển tiếp xuống Database).
   - Nếu KHÔNG có Cache trong luồng: 100% tải dồn trực tiếp xuống Database $\rightarrow$ Database bị bão hòa, drop hàng loạt request khi gặp spike 2,500 RPS.
3. **Linh kiện Redis Cache (`src/components/SidebarDock/SidebarDock.tsx`)**:
   - Thêm `cache-redis`: Cost: $25, Capacity: 20,000 RPS, Latency: 1ms.
4. **Bộ chọn Màn chơi (Level Switcher) (`src/components/TopBar/TopBar.tsx`)**:
   - Cho phép người chơi chuyển đổi giữa Màn 1 và Màn 2.
   - Khi chuyển màn: Bảng vẽ reset về `level.initialNodes` và mở Briefing tương ứng.

## 2. File Manifest (Write Zone)
- `src/levels/level02.ts`: Định nghĩa thông số Màn 2.
- `src/levels/index.ts`: Export danh sách các màn chơi `LEVELS = [LEVEL_01, LEVEL_02]`.
- `src/simulation/engineMath.ts`: Bổ sung toán học Cache Hit/Miss.
- `src/components/SidebarDock/SidebarDock.tsx`: Bổ sung Redis Cache component.
- `src/components/TopBar/TopBar.tsx` & `TopBar.module.css`: Thêm Level Switcher dropdown.
- `src/App.tsx`: Quản lý state màn chơi hiện tại `currentLevel`.
- `tests/unit/cacheSimulation.test.ts`: Test kiểm chứng cơ chế giảm 90% tải DB nhờ Cache.

## 3. Verification Criteria
- `npm test`: PASS tất cả tests, bao gồm test cache hit rate và giảm tải DB.
- `npm run build`: Build thành công, không lỗi.
- Chạy Màn 2: Nếu không có Redis Cache, Database sập lúc spike 2,500 RPS; khi thêm Redis Cache, Database êm ả và đạt 3 sao.
