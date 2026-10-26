# S-011: Phân tách Đọc/Ghi & Linh kiện Database Read Replica (Read/Write Splitting)

Status: Ready

## User Story
As a player,  
I want to use Database Read Replicas and have the simulation engine automatically split Read and Write traffic (Read/Write Splitting),  
So that I learn how to scale database read capacity independently from write operations and prevent connection pool exhaustion on the primary Master Database.

## Acceptance Criteria
- [ ] Bổ sung linh kiện **`Read Replica DB`** vào danh mục Storage trong SidebarDock:
  - Tên: `Database Read Replica`.
  - Giá: $25/tháng, Công suất: 1,500 RPS, Độ trễ: 10ms, Icon: Database (nhận diện màu xanh lam/cyan).
  - Mô tả: "Bản sao cơ sở dữ liệu chỉ đọc, đồng bộ bất đồng bộ từ Master, mở rộng khả năng đọc".
- [ ] Cơ chế Phân tách Đọc/Ghi (Read/Write Splitting) trong `engineMath.ts`:
  - Phân loại node storage:
    - `isMasterDb`: node Database không có chữ "replica" hay "cache".
    - `isReplicaDb`: node có chữ "replica" hoặc type tương ứng.
  - Khi luồng lưu lượng từ Compute/App Server đi xuống Storage:
    - Lưu lượng Ghi (`writeTraffic = rps * writeRatio`): 100% được định tuyến vào Master DB.
    - Lưu lượng Đọc (`readTraffic = rps * (1 - writeRatio)`): Nếu có Read Replica(s) kết nối, chia đều cho các Read Replicas!
    - Nếu không có Read Replica: Toàn bộ lưu lượng đọc dồn chung vào Master DB.
  - Nếu tất cả Read Replicas bị sập: Tự động dồn ngược lưu lượng đọc về Master DB (Graceful degradation).
- [ ] Hiển thị trực quan:
  - Cạnh nối dẫn tới Master DB hiển thị tải ghi (Write).
  - Cạnh nối dẫn tới Read Replicas hiển thị tải đọc (Read).
  - Node Read Replica trong Inspector hiển thị nhãn "Read-Only Replica" và công suất 1,500 RPS.

## Out of Scope
- Cấu hình độ trễ Replication Lag động theo mili-giây (sẽ mô phỏng định tính).

## Assumptions
- Tỉ lệ Read/Write được truyền từ cấu hình màn chơi (`writeRatio`).

## Acceptance
_Filled by the product-owner after testing and visual review._
