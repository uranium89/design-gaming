# UI Spec: S-008 Màn 2 - Tin Tức Nóng / Dịch Vụ Rút Gọn URL

- **Author**: UI Designer
- **Status**: Ready for Implementation
- **Reference**: [ai-team/DESIGN.md](../../DESIGN.md)

## 1. Level Switcher trên TopBar
- **Vị trí**: Thay thế badge tĩnh "Level 1: The Bakery" bằng một Dropdown Selector tương tác cao.
- **Phong cách**:
  - Nền `rgba(99, 102, 241, 0.15)`, viền `rgba(99, 102, 241, 0.35)`, màu chữ `#c7d2fe`.
  - Icon Zap ở bên trái, mũi tên trỏ xuống ChevronDown ở bên phải.
  - Hover: Sáng hơn, viền phát sáng nhẹ.
  - Hỗ trợ chọn nhanh:
    - `Level 1: The Bakery (Budget $35)`
    - `Level 2: Tech News (Budget $100)`

## 2. Briefing Modal Màn 2
- **Header**: Icon tia sét ⚡ / biểu tượng báo chí 📰.
- **Badge**: `Level 2: Tech News`.
- **Tiêu đề**: `Trang Tin Công Nghệ Nóng (Breaking Tech News)`.
- **Bối cảnh**: Văn bản dễ hiểu giải thích bài toán đọc tin tức nhiều (99% Read) và nguy cơ bão hòa Database.
- **Lưới thông số kỹ thuật (Grid 2 cột)**:
  - Lưu lượng mục tiêu: `300 RPS (200,000 DAU)`
  - Ngân sách trần: `$100 / tháng`
  - Mục tiêu P95 Latency: `< 80 ms` (yêu cầu phản hồi nhanh tức thì)
  - Cam kết Uptime SLA: `>= 99.5%`
- **Hộp cảnh báo**:
  - Hổ phách `#fbbf24`, cảnh báo: *"Cache Stampede / Đỉnh tải 2,500 RPS có thể đè sập Database nếu không có bộ nhớ đệm!"*

## 3. Linh kiện Redis Cache
- Card linh kiện trong Toolbox: Icon `Database`, tên `Redis Cache`, subtitle `20,000 RPS`, cost `$25/m`.
