# S-022: Giao Diện Xem Trước Bản Vẽ Kiến Trúc Trước Khi Nạp (Blueprint Preview Modal & Overwrite Safety)

Status: Done

## User Story
As a player,  
I want to preview the blueprint details (target level, cloud empire, component counts, estimated cost) before importing a JSON file or loading a shared URL link, and receive a warning if my active canvas has unsaved components,  
So that I can verify what is in the blueprint and avoid accidentally overwriting my work.

## Acceptance Criteria
- [x] Màn hình Xem Trước (Blueprint Preview Card) trong `BlueprintModal`:
  - Khi người chơi chọn 1 file `.json` hoặc khi nạp link chia sẻ `#blueprint=...`, hiển thị khối Preview gồm:
    - Tên bản vẽ (`name`) & Ghi chú (`description`).
    - Màn chơi mục tiêu (`levelId`) & Nhà cung cấp Đám mây (`empire`).
    - Thống kê chi tiết: Tổng số Node (`nodesCount`), Tổng số Edge (`edgesCount`), Danh sách tên các linh kiện sử dụng.
    - Dự toán chi phí ước tính ($/tháng) của bản vẽ.
- [x] Cảnh báo ghi đè an toàn (Overwrite Safety Warning):
  - Nếu Canvas hiện tại đang có $\ge 1$ linh kiện và bản vẽ mới khác với bản vẽ hiện tại, hiển thị thông báo nhắc nhở màu vàng/cam: *"Thao tác này sẽ thay thế kiến trúc hiện tại trên Canvas. Bạn có chắc chắn muốn nạp?"*.
  - Có 2 nút rõ ràng: "Nạp bản vẽ này" (Xác nhận) và "Hủy / Chọn file khác".
- [x] Unit tests kiểm tra việc render Preview Card, tính toán tóm tắt linh kiện, và luồng xác nhận ghi đè.

## Out of Scope
- Chỉnh sửa trực tiếp JSON schema bên trong modal.

## Assumptions
- Dữ liệu bản vẽ tuân thủ cấu trúc của `blueprintService.ts`.

## Acceptance
- **Accepted by**: product-owner
- **Evidence**: Vitest unit test suite (109/109 passed), build passed, security scanners passed.
- **Date**: 2026-10-27
- **Verdict**: PASS / Done
