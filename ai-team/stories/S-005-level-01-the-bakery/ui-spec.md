# UI Spec: S-005 Màn 1 Hoàn chỉnh - Tiệm Bánh Ngọt (Level 01: The Local Bakery)

- **Author**: UI Designer
- **Status**: Ready for Implementation
- **Reference**: [ai-team/DESIGN.md](../../DESIGN.md)

## 1. Briefing Modal Design
- **Khung hộp thoại**: Độ rộng 540px, căn giữa màn hình, hiệu ứng kính mờ `backdrop-filter: blur(8px)`.
- **Nền & Viền**: Nền `--bg-surface` (#1e293b), viền `--border-default` (#334155), bo góc 12px, đổ bóng sâu `shadow-md`.
- **Nội dung**:
  - **Header**: Icon bánh ngọt 🧁 kèm tiêu đề: *"Màn 1: Tiệm Bánh Ngọt (The Local Bakery)"*.
  - **Bối cảnh kinh doanh**: Văn bản mô tả ngắn gọn, dễ hiểu cho người chơi không chuyên nghiệp.
  - **Lưới thông số kỹ thuật (Grid 2 cột)**:
    - Lưu lượng trung bình: `20 - 50 RPS`
    - Tỉ lệ Đọc/Ghi: `80% Read / 20% Write`
    - Ngân sách tối đa: `$35 / tháng`
    - Cam kết P95 Latency: `< 200 ms`
    - Cảnh báo sự cố: *Có thể có đột biến lưu lượng (Spike) lúc lên báo!*
  - **Nút hành động chính**: Nút bấm màu tím Indigo `--color-primary`, chiều rộng 100%, chữ in đậm: *"Bắt đầu thiết kế kiến trúc"*.

## 2. Score Modal Design
- **Khung hộp thoại**: Độ rộng 520px, căn giữa màn hình, viền phát sáng nhẹ màu vàng hoặc tím.
- **Biểu tượng Sao**:
  - 3 ngôi sao lớn ở trung tâm (⭐⭐⭐) màu vàng ánh kim `#fbbf24`, hiệu ứng phát sáng `drop-shadow(0 0 12px rgba(251, 191, 36, 0.5))`.
  - Nếu đạt 1 hoặc 2 sao, các ngôi sao chưa đạt có màu xám mờ `#475569`.
- **Bảng phân tích 4 trụ cột (Breakdown Rows)**:
  - Throughput (Tải thành công): Thanh tiến trình màu xanh lục.
  - Latency (Độ trễ): Thanh tiến trình màu xanh lục/vàng.
  - Cost Efficiency (Tối ưu ngân sách): Thanh tiến trình màu vàng.
  - Reliability (Chống chịu sự cố): Thanh tiến trình màu tím.
- **Các nút điều hướng**:
  - Nút "Thử lại (Retry)": Màu viền Ghost, reset mô phỏng.
  - Nút "Tải kiến trúc mẫu (Best Practice)": Nạp cấu hình mẫu chuẩn tối ưu ngân sách $35.
