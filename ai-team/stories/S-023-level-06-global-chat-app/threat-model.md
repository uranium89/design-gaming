# Threat Model - S-023: Level 06 Global Chat App (WebSockets & Redis Pub/Sub)

Status: Complete
Author: devsecops

## 1. Assets & Surface
- **Level Definition**: Cấu hình các node, edges, kịch bản tải trong `level06.ts`.
- **Progression Integrity**: Khóa bảo vệ Màn 6 trong chuỗi `CAMPAIGN_LEVEL_SEQUENCE`.

## 2. Threat Analysis (STRIDE)
- **Elevation of Privilege / Skipping Progression**:
  - *Threat*: Người chơi có thể cố gắng truy cập trực tiếp Màn 6 bằng cách gán `levelId: 'level-06-global-chat'` hoặc chỉnh sửa `localStorage`.
  - *Mitigation*: Hàm `isLevelUnlocked` áp dụng thuật toán kiểm tra toàn bộ chuỗi tiền nhiệm (Màn 1 $\rightarrow$ Màn 5). Nếu bất kỳ màn nào trong chuỗi 1-5 chưa đạt $\ge 1★$, Màn 6 sẽ bị từ chối truy cập.
- **Resource Exhaustion (Denial of Service)**:
  - *Threat*: Kịch bản spike tải 10,000 RPS làm quá tải Web Worker hoặc render hạt packet trên UI.
  - *Mitigation*: Web Worker tính toán theo tick 50ms, nén packet data thành snapshot và giữ 60 FPS mà không làm nghẽn UI main thread.

## 3. Security Acceptance Criteria
- [x] Quy tắc mở khóa tuần tự áp dụng chặt chẽ cho Màn 6.
- [x] Không phát sinh bất kỳ lỗ hổng bảo mật nào mới.
