# S-019: Tối Ưu Bố Cục TopBar & Chống Tràn Giao Diện (TopBar Responsive Layout & Action Consolidation)

Status: Done

## User Story
As a player,  
I want the TopBar navigation bar to be cleanly organized, compact, and responsive without overflowing or clipping buttons,  
So that all gameplay controls (level selection, simulation run/speed, metrics, blueprint tools, and scoring) remain fully visible and comfortable to use across all screen resolutions.

## Acceptance Criteria
- [x] Tối ưu hóa các nút thao tác phụ (Action Buttons Consolidation):
  - Nút "Đặt lại tiến trình" (Reset Progress): Chuyển thành icon button nhỏ gọn (`iconBtn`) với icon `RotateCcw`, có tooltip và `aria-label="Đặt lại tiến trình chơi"`, không chiếm diện tích văn bản dài.
  - Các nút `Đề bài`, `Bản vẽ`, `Chấm điểm`: Tối ưu padding (4px 8px), có class responsive tự động ẩn nhãn text và giữ icon khi độ rộng màn hình hẹp (< 1280px).
- [x] Giới hạn chiều rộng Level Selector Dropdown:
  - Giới hạn `max-width: 175px` cho dropdown chọn màn chơi với `text-overflow: ellipsis; white-space: nowrap; overflow: hidden;` để các tên màn dài và điều kiện mở khóa không đẩy lệch các thành phần khác.
- [x] Chống tràn tuyệt đối và bố cục linh hoạt (No Horizontal Overflow):
  - Tiết kiệm ~470px không gian chiều ngang.
  - Đảm bảo `topBar` không bị tràn hoặc che khuất nút trên độ phân giải laptop phổ biến (1280px - 1440px) và màn hình nhỏ hơn (1080px).
  - Các thành phần co giãn mềm mại (`gap: 8px`, `flex-shrink: 0` cho các nút điều khiển thiết yếu, ẩn scrollbar trình duyệt an toàn).

## Out of Scope
- Viết lại toàn bộ thanh navigation sang Sidebar (giữ vững cấu trúc TopBar theo GDD Mục 6.1).

## Assumptions
- Trình duyệt mục tiêu hỗ trợ Flexbox và CSS Media Queries tiêu chuẩn.

## Acceptance
- **Accepted by**: Product Owner
- **Evidence**: `tests/unit/topbarResponsive.test.tsx` (1/1 passed), full test suite (18 suites, 97/97 passed), build production clean (188ms), SAST & gitleaks PASS.
- **Date**: 2026-10-27
- **Verdict**: PASS & ACCEPTED
