# S-016: Chế Độ Sandbox Tự Do & Lưu Trữ Tiến Trình Chơi (LocalStorage Star Tracking)

Status: Ready

## User Story
As a player,  
I want to switch to a Sandbox Mode to freely experiment with multi-cloud architectures without level constraints, and have my stars/scores persisted in the browser,  
So that I can test custom high-traffic scenarios and track my career progression as an architect.

## Acceptance Criteria
- [ ] Bổ sung tùy chọn `Sandbox (Tự Do Thiết Kế)` vào Level Selector trên TopBar:
  - Khi chọn Sandbox: Canvas mở sẵn nguồn tải User Traffic ($0).
  - Không có trần ngân sách ràng buộc (Budget: Không giới hạn).
  - Bật thanh công cụ điều khiển lưu lượng ảo (Virtual Traffic Injector):
    - Slider RPS: 100 RPS đến 50,000 RPS (bước nhảy 500 RPS).
    - Slider Tỉ lệ Read/Write: 0% đến 100% Write.
- [ ] Lưu trữ và hiển thị tiến trình sao (Star Tracking via `localStorage`):
  - Định dạng key: `sysarchitect_progress_v1`.
  - Lưu cấu trúc: `{ [levelId: string]: { stars: number; totalScore: number; passed: boolean; unlocked: boolean } }`.
  - Trên thanh chọn màn chơi (TopBar dropdown), hiển thị sao đạt được bên cạnh tên từng Level:
    - Ví dụ: `Level 1: The Bakery ⭐⭐⭐` (hoặc `Level 2: Tech News ⭐⭐`).
  - Khi người chơi hoàn thành chấm điểm (Evaluation modal) đạt điểm cao hơn, tự động cập nhật tiến trình vào `localStorage`.
- [ ] Đảm bảo tính tương thích ngược và tự phục hồi khi `localStorage` bị rỗng hoặc lỗi JSON.

## Out of Scope
- Đăng nhập tài khoản cloud Supabase (để dành cho bản phát hành cộng đồng ở GDD Giai đoạn 4).

## Assumptions
- Dữ liệu tiến trình được lưu cục bộ trên trình duyệt của người chơi.

## Acceptance
_Filled by the product-owner after testing and visual review._
