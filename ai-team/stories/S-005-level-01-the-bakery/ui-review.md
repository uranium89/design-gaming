# UI Review: S-005 Màn 1 Hoàn chỉnh - Tiệm Bánh Ngọt (Level 01: The Local Bakery)

- **Author**: UI Designer
- **Verdict**: PASS
- **Loop**: 1

## Visual & Interaction Conformance
1. **Briefing Modal Conformance**:
   - Khung modal nổi bật với `backdrop-filter: blur(8px)`, bo góc 12px, nền Dark Surface `#1e293b`.
   - Header hiển thị icon bánh ngọt 🧁 nổi bật trong badge màu tím mờ.
   - Lưới thông số 2 cột bố trí cân đối, hiển thị rõ ràng: Base RPS (50), Budget Max ($35/tháng), Target P95 (< 200ms), Uptime SLA (>= 99%).
   - Hộp cảnh báo sự cố màu vàng hổ phách cảnh báo spike 120 RPS.
   - Nút hành động chính "Bắt đầu thiết kế kiến trúc" toàn chiều rộng với màu tím `--color-primary` nổi bật.
2. **Score Modal Conformance**:
   - 3 ngôi sao lớn ⭐⭐⭐ ở vị trí trung tâm: sao đạt được có màu vàng ánh kim `#fbbf24` kèm hiệu ứng phát sáng `drop-shadow(0 0 12px rgba(251, 191, 36, 0.6))`.
   - Hiển thị điểm số lớn 1.75rem trên 1000 điểm kèm danh hiệu cấp độ tương ứng.
   - 4 thanh tiến trình (progress bar) thể hiện 4 trụ cột:
     - Tải thành công (Throughput): Gradient xanh lục.
     - Độ trễ (Latency): Gradient xanh dương - tím.
     - Chi phí (Cost): Gradient vàng cam.
     - Độ sẵn sàng (Reliability): Gradient tím.
   - Hộp nhận xét kiến trúc phong cách console chuyên nghiệp.
   - 2 nút điều hướng rõ ràng: "Thử lại" (Ghost button) và "Nạp kiến trúc mẫu (3★)" (Primary button).
3. **Accessibility & Usability**:
   - Đầy đủ thuộc tính `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-label` cho các nút bấm và hộp thoại.
   - Hỗ trợ đóng modal bằng nút X hoặc click hành động.
