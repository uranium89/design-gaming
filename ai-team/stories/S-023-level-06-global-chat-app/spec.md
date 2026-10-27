# Technical Specification - S-023: Level 06 Global Chat App (WebSockets & Redis Pub/Sub)

Status: Ready
Risk Level: 🟡 Med (Adds new Level 06 definition and extends campaign progression sequence)

## 1. Overview
Thiết kế và tích hợp Màn 6: Ứng Dụng Nhắn Tin Trực Tuyến Toàn Cầu (Level 06: Global Chat App), thuộc phân khúc Tier 3 (Stateful & Real-time Systems) theo Game Design Document.

## 2. Level Parameters & Design Constraints
- **ID**: `level-06-global-chat`
- **Badge**: `Level 6: Global Chat`
- **Title**: `Phòng Chat Toàn Cầu (Global Chat App)`
- **Bối cảnh & Thử thách**:
  - 100,000 người dùng trực tuyến đồng thời (50,000 CCU giữ kết nối liên tục).
  - 10,000 tin nhắn/giây (Message throughput).
  - Độ trễ truyền tin P95 $< 50\text{ms}$.
  - Tỷ lệ ghi tin nhắn cao: `writeRatio: 0.60`.
  - Ngân sách tối đa: $\le \$500/\text{tháng}$.
- **Thông số tải**:
  - `baseRps`: 1,000 RPS.
  - `spikeRps`: 10,000 RPS (cơn bão tin nhắn khi có sự kiện breaking news).
  - `spikeDurationSeconds`: 15s.
  - `budgetMax`: 500.
  - `latencyTargetMs`: 50.
  - `slaTarget`: 99.9.
- **Reference Architecture (3★)**:
  - 1 Load Balancer ($25).
  - 2 Stateful Gateway App Servers ($90).
  - 1 Redis Pub/Sub Cluster ($25) để broadcast tin nhắn giữa các server.
  - 1 Message Queue ($40) + 1 Worker Pool ($30) để lưu trữ bất đồng bộ tin nhắn xuống Database.
  - 1 PostgreSQL Database ($40) lưu trữ tin nhắn.
  - Tổng chi phí ước tính: $250/tháng ($\le 0.8 \times \$500$).

## 3. Progression Sequence Update
- Cập nhật `CAMPAIGN_LEVEL_SEQUENCE` trong `src/services/progressStorage.ts`:
  ```ts
  export const CAMPAIGN_LEVEL_SEQUENCE = [
    'level-01-bakery',
    'level-02-tech-news',
    'level-03-flash-deals',
    'level-04-tinyurl',
    'level-05-ticket-rush',
    'level-06-global-chat',
  ] as const;
  ```
- Cập nhật `ALL_LEVELS` trong `src/levels/index.ts` để đưa `LEVEL_06` vào menu TopBar.
- Quy tắc mở khóa:
  - Màn 6 yêu cầu Màn 5 (`level-05-ticket-rush`) đạt $\ge 1★$.
  - Nếu Màn 5 chưa hoàn thành, hiển thị `🔒 Level 6: Global Chat (Cần 1★ ở Màn 5)`.

## 4. Test Strategy
- Unit test trong `tests/unit/level06GlobalChat.test.tsx`:
  - Kiểm tra các thông số đề bài của `LEVEL_06`.
  - Kiểm tra reference architecture đạt $\le \$500$ ngân sách và đáp ứng đủ năng lực 10,000 RPS.
  - Kiểm tra chuỗi mở khóa: Màn 6 bị khóa khi Màn 5 chưa hoàn thành, và mở khóa khi Màn 5 đạt $\ge 1★$.
  - Kiểm tra hồi quy toàn bộ hệ thống test suite.
