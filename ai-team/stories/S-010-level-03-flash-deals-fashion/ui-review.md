# UI Review: S-010 Màn 3 - Săn Sale Thời Trang (Level 03: Flash Deals Fashion)

- **Verdict**: PASS
- **Loop**: 1
- **Author**: UI Designer

## 1. Visual Verification & Component Assessment
- **Level Switcher**:
  - Menu hiển thị 3 màn chơi rõ ràng:
    1. *Level 1: The Bakery*
    2. *Level 2: Tech News*
    3. *Level 3: Flash Deals*
- **Briefing Modal Level 3**:
  - Hiển thị đầy đủ thông điệp đợt flash sale thời trang 4,000 RPS đỉnh, P95 < 120ms, ngân sách $250/tháng và cảnh báo nguy cơ sập máy chủ.
- **Failover & Particle Edge Feedback**:
  - Khi một máy chủ bị sập trong đợt spike: Cạnh nối tới máy chủ đó chuyển sang nét đứt đỏ mờ, dòng hạt packet lập tức chuyển hướng sang máy chủ thứ hai mà không bị gián đoạn.
- **Accessibility & Contrast**:
  - Đạt chuẩn WCAG 2.1 AA.
