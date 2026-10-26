# S-013: Linh Kiện Message Queue (RabbitMQ) & Worker Pool (Async Processing)

Status: Done

## User Story
As a player,  
I want to use Message Queue and Worker Pool components to decouple synchronous write operations,  
So that I learn how asynchronous event-driven architectures san phẳng đỉnh nhọn lưu lượng (Traffic Buffering & Leveling), protect downstream databases from write exhaustion, and ensure Zero Data Loss.

## Acceptance Criteria
- [x] Bổ sung linh kiện **`Message Queue (RabbitMQ)`** vào SidebarDock:
  - Tên: `Message Queue (RabbitMQ)`.
  - Giá: $40/tháng, Công suất: 30,000 RPS, Độ trễ: 5ms, Icon: `Layers` (nhận diện màu hổ phách / amber / cam).
  - Mô tả: "Hàng đợi thông điệp bất đồng bộ (FIFO), đệm lưu lượng tức thời, chống sập hệ thống và đảm bảo Zero Data Loss."
- [x] Bổ sung linh kiện **`Worker Pool (Async Consumer)`** vào SidebarDock:
  - Tên: `Worker Pool (Async Consumer)`.
  - Giá: $30/tháng, Công suất: 2,000 RPS, Độ trễ: 15ms, Icon: `Cpu` (nhận diện màu tím / violet).
  - Mô tả: "Tiến trình nền kéo tác vụ từ Message Queue để ghi dữ liệu ổn định xuống Database (Traffic Leveling)."
- [x] Xử lý lưu lượng bất đồng bộ trong `engineMath.ts`:
  - Nhận diện node `isQueue` (name chứa "queue" hoặc "rabbitmq") và node `isWorker` (name chứa "worker").
  - Khi App Server chuyển tiếp Write traffic sang Message Queue:
    - Message Queue hấp thụ lưu lượng ghi (lên tới 30,000 RPS) chỉ với độ trễ 5ms, không làm rơi rớt dữ liệu (Zero Data Loss).
  - Khi Message Queue kết nối với Worker Pool(s):
    - Các Worker Pool phân chia nhau tiêu thụ tác vụ từ Queue theo công suất định mức (2,000 RPS mỗi Worker node).
    - Lưu lượng vượt quá tổng công suất Worker Pool được đệm an toàn trong Queue thay vì tính là lỗi rớt gói (Drop).
  - Khi Worker Pool kết nối tới Database:
    - Dòng tải được san phẳng (rate-limited stream) truyền an toàn xuống Database, bảo vệ DB không bị quá tải.
- [x] Cập nhật hiển thị trong Component Inspector:
  - Message Queue hiển thị badge `"Message Queue (FIFO)"` và công suất 30,000 RPS.
  - Worker Pool hiển thị badge `"Async Consumer"` và công suất 2,000 RPS.

## Out of Scope
- Dead Letter Queue (DLQ) retry policies nâng cao (dành cho các màn sau).

## Assumptions
- Hàng đợi có dung lượng bộ đệm RAM/Disk đủ lớn để chứa toàn bộ đợt spike tức thời mà không tràn RAM.

## Acceptance
- **Accepted by**: product-owner
- **Date**: 2026-10-26
- **Evidence**:
  - `tests/unit/messageQueueWorker.test.tsx`: 4/4 passing unit tests covering dock rendering, badges, queue buffering, worker traffic leveling, and drop protection.
  - `npm test`: 58/58 tests passing across all suites.
  - `npm run build`: successful production build.
  - Reviewer verdict: APPROVED in `review.md`.
