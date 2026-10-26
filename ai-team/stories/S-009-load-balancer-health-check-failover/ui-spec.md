# UI Spec: S-009 Load Balancer Health Check & Failover Event

- **Status**: Ready for Implementation
- **Author**: UI Designer

## 1. Thành phần Giao diện & Tương tác

### 1.1. Inspector Chaos Simulation Button
- **Vị trí**: Nằm bên dưới khối cấu hình Tier và Utilization trong `Inspector.tsx`.
- **Giao diện**:
  - Container: Viền đứt nét viền đỏ mờ `rgba(239, 68, 68, 0.25)`, nền `rgba(239, 68, 68, 0.05)`, bo góc 8px, padding 10px.
  - Label: "Mô phỏng sự cố (Chaos Engineering)".
  - Button Action:
    - Khi node bình thường: Nút màu đỏ gạch `background: #ef4444`, text trắng "🚨 Đánh sập node (Simulate Crash)".
    - Khi node đang sập (`crashed`): Nút màu xanh ngọc `background: #10b981`, text trắng "🔄 Khởi động lại (Recover Server)".

### 1.2. Particle Edge Trực quan hóa Failover
- **Bình thường**: Cạnh nối phát sáng tím/indigo `#6366f1`, các hạt tròn trắng chuyển động nhịp nhàng theo chiều dòng chảy.
- **Khi Target Node bị Crash**:
  - Đường nét path chuyển sang màu đỏ `#ef4444` với kiểu nét đứt `strokeDasharray="4 4"`.
  - Hạt packet trên cạnh đó biến mất (ngừng phát tín hiệu).
  - Cạnh nối đến các máy chủ còn lại sáng rực hơn, tốc độ và mật độ hạt tăng lên gấp đôi phản ánh lưu lượng dồn tải.

## 2. Tiêu chuẩn Thẩm mỹ & Accessibility
- Độ tương phản đạt chuẩn WCAG AA: icon và chữ trên nút bấm sắc nét.
- Hiệu ứng chuyển trạng thái mượt mà bằng CSS transitions (0.2s).
