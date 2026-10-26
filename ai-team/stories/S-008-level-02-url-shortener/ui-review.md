# UI Review: S-008 Màn 2 - Tin Tức Nóng / Dịch Vụ Rút Gọn URL

- **Verdict**: PASS
- **Loop**: 1
- **Author**: UI Designer

## 1. Visual Verification & Component Assessment
- **Level Switcher Selector**:
  - Tích hợp thanh dropdown bo tròn pill mượt mà trên góc trái TopBar ngay cạnh brand `SysArchitect`.
  - Icon tia sét `Zap` với màu tím dịu `#c7d2fe` và background glassmorphism `rgba(99, 102, 241, 0.15)`.
  - Hỗ trợ đổi ngay lập tức giữa `Level 1: The Bakery` và `Level 2: Tech News`.
- **Toolbox Redis Cache Card**:
  - Nằm trong nhóm `Storage & Database` với icon `Database`, giá `$25/m`, nhãn `20,000 RPS`.
  - Hỗ trợ kéo thả tự do ra canvas tạo node mới với style Dark Theme đồng nhất.
- **Briefing Modal Level 2**:
  - Tiêu đề: *Trang Tin Công Nghệ Nóng (Breaking Tech News)*.
  - Hiển thị badge: `Level 2: Tech News`.
  - Mục tiêu trực quan: 2,500 RPS Peak, Ngân sách $100/tháng, P95 < 80ms, SLA 99.5%.
- **Node Statuses & Realtime Feedback**:
  - Khi tải đỉnh 2,500 RPS ập đến với Redis Cache: Node Cache xanh mướt (healthy), Database PostgreSQL xanh mướt (272 RPS / 600 RPS), App Server Medium ở mức vàng an toàn (warning - 83% load). Không có gói tin nào bị drop!
- **Accessibility & Contrast**:
  - Tuân thủ WCAG 2.1 AA: các thành phần có label `aria-label="Chọn màn chơi"`, độ tương phản màu sắc cao trên nền tối `#0f172a`.
