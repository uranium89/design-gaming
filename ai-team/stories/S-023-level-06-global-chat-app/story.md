# S-023: Màn 6 - Ứng Dụng Nhắn Tin Trực Tuyến Toàn Cầu (Level 06: Global Chat App - WebSockets & Redis Pub/Sub)

Status: Done

## User Story
As a player,  
I want to play Level 06: Global Chat App (Tier 3), handling 50,000 concurrent WebSocket connections and 10,000 messages/sec using distributed chat servers and Redis Pub/Sub message broker,  
So that I can learn how to architect stateful real-time distributed communication systems.

## Acceptance Criteria
- [x] Định nghĩa Màn 6 trong `src/levels/level06.ts`:
  - **Mục tiêu**: 50,000 kết nối đồng thời (CCU), 10,000 tin nhắn/giây, P95 Latency $< 50\text{ms}$, Ngân sách $\le \$500/\text{tháng}$.
  - **Linh kiện cốt lõi**:
    - WebSocket Gateway (Stateful connection handler).
    - Chat App Server (Message routing & logic).
    - Redis Pub/Sub (Cross-server message distribution bus).
    - Message Store Database (Lưu trữ lịch sử tin nhắn).
  - **Sự cố bất ngờ (Incident Trigger)**: Kịch bản kiểm tra khả năng định tuyến tin nhắn thời gian thực qua Redis Pub/Sub.
- [x] Tích hợp vào hệ thống tiến trình:
  - Bổ sung `level-06-global-chat` vào `CAMPAIGN_LEVEL_SEQUENCE` trong `src/services/progressStorage.ts`.
  - Màn 6 tự động mở khóa khi Màn 5 đạt tối thiểu 1 sao ($\ge 1★$).
  - Khóa Màn 6 chặt chẽ nếu Màn 5 chưa hoàn thành.
- [x] Unit tests cho kịch bản Màn 6, tính toán chấm điểm và quy tắc mở khóa tuần tự.

## Out of Scope
- Mã hóa đầu cuối (E2EE) hay Voice/Video calling.

## Assumptions
- Web Worker simulation hỗ trợ mô hình hóa thông lượng tin nhắn thời gian thực.

## Acceptance
- **Accepted by**: product-owner
- **Evidence**: Vitest unit test suite (113/113 passed), build passed, security scanners passed.
- **Date**: 2026-10-27
- **Verdict**: PASS / Done
