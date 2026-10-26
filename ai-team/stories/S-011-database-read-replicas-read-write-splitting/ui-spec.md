# UI Spec: S-011 Phân tách Đọc/Ghi & Linh kiện Database Read Replica

- **Status**: Ready for Implementation
- **Author**: UI Designer

## 1. Giao diện Linh kiện Database Read Replica

### 1.1. SidebarDock Item Card
- **Nhóm**: `Storage & Database`.
- **Icon**: `Database` với màu cyan / sky blue đặc trưng `#0ea5e9` để phân biệt với PostgreSQL Master (`#6366f1`).
- **Tên**: `Database Read Replica`.
- **Phụ đề**: `1,500 RPS`.
- **Giá**: `$25/m`.

### 1.2. Inspector Panel
- Khi click chọn node `Database Read Replica`:
  - Category Badge: Hiển thị `"Storage / Read-Only Replica"`.
  - Hiển thị công suất đọc tối đa: `1,500 RPS`.
  - Giữ đầy đủ tính năng đo tải thời gian thực (Utilization Meter) và nút Chaos Engineering (`🚨 Đánh sập node / 🔄 Khởi động lại`).

### 1.3. Canvas Node Trực quan hóa
- Node Read Replica trên canvas hiển thị icon Database có màu viền xanh cyan `#0ea5e9`, dễ dàng phân biệt trên đồ thị kiến trúc so với Master Database.
