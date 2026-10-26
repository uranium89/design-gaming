# S-008: Màn 2 - Tin Tức Nóng / Dịch Vụ Rút Gọn URL (Level 02: Read-Heavy with Redis Cache)

Status: Done

## User Story
As a player,  
I want to play through Level 2 (Read-heavy architecture with 2,500 RPS peak and $100 budget), use Redis In-Memory Cache to absorb 90% of read traffic, and prevent Database connection exhaustion,  
So that I learn how caching layers protect relational databases and keep P95 latency under 80ms.

## Acceptance Criteria
- [x] Bổ sung linh kiện **`Redis Cache`** ($25/tháng, 20,000 RPS, latency 1ms) vào danh mục Storage trong Toolbox.
- [x] Cung cấp bộ chọn Màn chơi (Level Switcher) trên thanh TopBar cho phép chuyển đổi mượt mà giữa Màn 1 và Màn 2.
- [x] Modal Briefing hiển thị đầy đủ đề bài Màn 2:
  - Bối cảnh: Breaking Tech News / URL Shortener (99% Read, 1% Write).
  - Tải: Base 300 RPS, Peak Spike 2,500 RPS.
  - Ràng buộc: Ngân sách tối đa $100/tháng, P95 < 80ms, SLA 99.5%.
- [x] Cơ chế mô phỏng Cache Hit/Miss trong `engineMath.ts`:
  - Redis Cache hấp thụ 90% lưu lượng đọc (Hit Rate 90%) với độ trễ 1ms.
  - Chỉ 10% Cache Miss và các yêu cầu ghi mới được chuyển tiếp xuống Database.
  - Nếu không có Cache: 2,500 RPS dồn thẳng xuống Database (vốn chỉ có 600 RPS) gây quá tải nghiêm trọng và drop request.
- [x] Cung cấp kiến trúc mẫu 3★ cho Màn 2: `User Traffic` $\rightarrow$ `App Server (Medium $45)` $\rightarrow$ `Redis Cache ($25)` $\rightarrow$ `Postgres DB ($40)` (hoặc tối ưu dưới $100).
- [x] Chấm điểm Màn 2 theo đúng ràng buộc ngân sách $100 và độ trễ 80ms, trao 1–3 sao chính xác.

## Out of Scope
- Cơ chế phân cụm Multi-AZ Redis replication (sẽ có ở Màn 4-5).
- Tích hợp CDN Edge Varnish nâng cao (Màn 4).

## Assumptions
- Tỉ lệ Cache Hit rate chuẩn là 90% theo GDD Section 3.1 & 4 (Màn 2).

## Acceptance
- **Accepted by**: Product Owner
- **Date**: 2026-10-26
- **Evidence**:
  - `npm test`: 34/34 unit tests PASSING across 7 test suites.
  - `npm run build`: Production build passes in 157ms.
  - `npm audit`: 0 vulnerabilities.
  - Reviewer: APPROVED.
  - UI Designer: PASS.
  - DevSecOps: PASS.
