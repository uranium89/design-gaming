# Technical Spec: S-011 Phân tách Đọc/Ghi & Linh kiện Database Read Replica

- **Status**: Ready for Implementation
- **Risk Level**: 🟡 Med (Cơ chế phân tách luồng Read/Write dựa trên role của storage nodes)
- **Author**: Architect

## 1. Technical Approach
1. **Linh kiện Read Replica (`src/components/SidebarDock/SidebarDock.tsx`)**:
   - Thêm `db-replica`: Name: `Database Read Replica`, Category: `storage`, Cost: $25/tháng, Capacity: 1,500 RPS, Added Latency: 10ms, Icon: `Database`.
2. **Cơ chế Phân tách Đọc/Ghi (Read/Write Splitting) trong `src/simulation/engineMath.ts`**:
   - Phân biệt các loại node storage:
     - `isMasterDb`: `n.data.category === 'storage' && !n.data.name.toLowerCase().includes('replica') && !n.data.name.toLowerCase().includes('cache') && !n.data.name.toLowerCase().includes('redis')`.
     - `isReplicaDb`: `n.data.category === 'storage' && n.data.name.toLowerCase().includes('replica')`.
     - `isCache`: `n.data.category === 'storage' && (n.data.name.toLowerCase().includes('cache') || n.data.name.toLowerCase().includes('redis'))`.
   - Khi chuyển tiếp lưu lượng xuống các target storage:
     - Tách phần ghi `writeRps` và phần đọc `readRps`.
     - Nếu có `replicaTargets`:
       - `writeRps` được chuyển 100% đến `masterTargets`.
       - `readRps` được phân phối đều cho các `replicaTargets`.
     - Nếu không có `replicaTargets` (hoặc toàn bộ replica bị crashed):
       - Toàn bộ `writeRps` và `readRps` dồn về `masterTargets` (cơ chế fallback an toàn).
3. **Inspector Read Replica Label (`src/components/Inspector/Inspector.tsx`)**:
   - Nhận diện `isReplica`: Hiển thị badge `"Read-Only Replica"` để người chơi dễ dàng phân biệt với Master DB.

## 2. File Manifest (Write Zone)
- `src/components/SidebarDock/SidebarDock.tsx`: Bổ sung `db-replica`.
- `src/simulation/engineMath.ts`: Bổ sung phân tách Read/Write Splitting.
- `src/components/Inspector/Inspector.tsx`: Bổ sung badge Read-Only Replica.
- `tests/unit/readWriteSplitting.test.tsx`: Test phân tách đọc/ghi và failover về Master khi replica sập.

## 3. Verification Criteria
- `npm test`: PASS 100% test suites.
- `npm run build`: Production build thành công không lỗi.
