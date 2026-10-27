# Technical Specification - S-020: Strict Sequential Level Unlocking & Stale Progress Invalidation

Status: Ready
Risk Level: 🟢 Low (Confined to progress storage & unlocking helper functions in `src/services/progressStorage.ts`)

## 1. Overview
Khắc phục triệt để lỗi mở khóa màn chơi trong chế độ Chiến dịch (Campaign). Đảm bảo các màn chơi cao hơn (như Màn 5 - Ticket Rush) không thể mở khóa nếu các màn tiền nhiệm (Màn 1, 2, 3, 4) chưa thực sự hoàn thành với tối thiểu 1 sao ($\ge 1★$).

## 2. Root Cause Analysis
1. **Lỗ hổng Short-Circuit trong `isLevelUnlocked()`**:
   - Dòng 43-45 trong `src/services/progressStorage.ts` kiểm tra `if (progress[levelId]?.unlocked) return true;`.
   - Nếu bản ghi trong `localStorage` có `unlocked: true` (do phiên bản cũ lưu lại, hoặc người chơi từng đánh giá màn đó), hàm lập tức trả về `true` mà không hề xác thực xem Màn $N-1$ đã đạt điều kiện mở khóa hay chưa.
2. **Default Fallback không an toàn trong `loadProgress()`**:
   - Dòng 97: `unlocked: item.unlocked !== undefined ? Boolean(item.unlocked) : true`.
   - Khi nạp dữ liệu cũ (từ trước S-017 chưa có cờ `unlocked`), trường này tự động nhận giá trị `true` cho tất cả các màn có trong cache.
3. **Lưu `unlocked: true` ngay cả khi đánh giá thất bại**:
   - Khi người chơi chạy thử nghiệm hoặc đánh giá một màn, `saveLevelProgress(levelId, ...)` gán `unlocked: true` cho chính `levelId` đó dù không đủ điều kiện.

## 3. Architecture & Technical Design
### A. Hàm `isLevelUnlocked(progress, levelId)`
- **Sandbox** và **Màn 1 (`level-01-bakery`)**: Luôn luôn mở khóa (`return true`).
- **Các màn Campaign $N$ ($N \ge 2$)**:
  - Xác định vị trí `index = CAMPAIGN_LEVEL_SEQUENCE.indexOf(levelId)`.
  - Nếu `index > 0`, lấy `prevLevelId = CAMPAIGN_LEVEL_SEQUENCE[index - 1]`.
  - Chỉ trả về `true` nếu và chỉ nếu `prevProgress && (prevProgress.stars >= 1 || prevProgress.passed)`.
  - Không cho phép bất kỳ cờ `progress[levelId]?.unlocked` độc lập nào vượt qua (bypass) điều kiện màn trước chưa hoàn thành!

### B. Hàm `loadProgress()`
- Chuẩn hóa mặc định:
  - Chỉ `level-01-bakery` và `sandbox` được mặc định `unlocked: true` nếu thiếu cờ.
  - Tất cả các màn khác mặc định `unlocked: false`.
  - Sau khi nạp, tự động tính toán lại cờ `unlocked` dựa trên quy tắc tiền nhiệm để làm sạch dữ liệu cũ (data sanitization).

### C. Hàm `saveLevelProgress()`
- Không tự ý gán `unlocked: true` cho màn hiện tại nếu màn đó chưa đạt điều kiện tiền nhiệm.

## 4. Test Strategy
- Unit test trong `tests/unit/campaignProgression.test.tsx`:
  - Test trường hợp `progress['level-05-ticket-rush']` có `unlocked: true` nhưng Level 4 có 0 sao -> Phải trả về `false` (Khóa chặt chẽ).
  - Test trường hợp nạp `localStorage` cũ không có trường `unlocked` cho Màn 2, 3, 4, 5 -> Phải bị khóa.
  - Test luồng hoàn thành tuần tự: Màn 1 đạt 1★ -> Màn 2 mở khóa; Màn 2 đạt 1★ -> Màn 3 mở khóa; ... -> Màn 5 mở khóa.
- Chạy toàn bộ regression test suite (`npm test -- --run`).
