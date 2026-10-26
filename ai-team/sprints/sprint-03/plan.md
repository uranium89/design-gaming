# Sprint 03 Plan: Interactive Inspector & Level 02 (URL Shortener with Caching)

- **Sprint Goal**: Cung cấp khả năng cấu hình chi tiết phần cứng (vCPU, RAM, capacity, cost) trực tiếp trên Inspector Panel khi click vào Node và phát hành Màn 2 (URL Shortener) giới thiệu cơ chế In-Memory Caching (Redis) và tỉ lệ Cache Hit/Miss bão hòa DB.
- **Trạng thái**: In Progress (Approved)

## Danh sách User Stories trong Sprint 03

| Thứ tự | Mã Story | Tiêu đề | Trạng thái | Điểm cốt lõi |
|---|---|---|---|---|
| 1 | S-007 | [Component Inspector Tương tác cao](../stories/S-007-interactive-inspector/story.md) | Ready | Cho phép tùy chỉnh instance size, capacity, thuật toán cân bằng tải trực tiếp trên Inspector |
| 2 | S-008 | [Màn 2: Dịch vụ Rút gọn URL (TinyURL)](../stories/S-008-level-02-url-shortener/story.md) | Ready | Bài toán Read-heavy (10:1), tích hợp Redis Cache, cơ chế Cache Stampede và 1-3 sao |

## Những gì Stakeholder có thể trải nghiệm sau Sprint 03
1. **Tinh chỉnh sâu kiến trúc**: Khi click vào bất kỳ node nào (VM, DB, Cache), người chơi có thể nâng/hạ cấu hình (Scale Up/Down) hoặc đổi instance type để tối ưu chi phí theo thời gian thực.
2. **Trải nghiệm Màn 2 hoàn chỉnh**: Giải bài toán rút gọn URL nổi tiếng với 4,200 RPS đỉnh, học cách đặt Redis Cache phía trước Database để bảo vệ DB khỏi tình trạng cạn kiệt Connection Pool.
