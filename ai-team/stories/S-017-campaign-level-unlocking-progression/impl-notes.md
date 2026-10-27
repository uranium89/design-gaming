# Implementation Notes: S-017 Hệ Thống Mở Khóa Màn Chơi Theo Tiến Trình & Quản Lý Dữ Liệu Chơi (Campaign Level Unlocking Progression & Reset)

## Loop 1

### Changes Made
1. **`src/services/progressStorage.ts`**:
   - Defined `CAMPAIGN_LEVEL_SEQUENCE = ['level-01-bakery', 'level-02-tech-news', 'level-03-flash-deals', 'level-04-tinyurl', 'level-05-ticket-rush'] as const`.
   - Implemented `getNextLevelId(levelId)` to resolve the next sequential level in campaign mode.
   - Implemented `isLevelUnlocked(progress, levelId)`: Level 1 and Sandbox are always unlocked; other campaign levels are unlocked if explicitly recorded or if the preceding level has earned $\ge 1★$.
   - Implemented `getUnlockRequirementText(levelId)` providing clear human-readable unlocking conditions (e.g. *"Cần 1★ ở Màn 1"*).
   - Enhanced `saveLevelProgress(levelId, stars, totalScore)` to automatically mark the next sequential level as unlocked when $\ge 1★$ is scored.
   - Implemented `resetProgress()` to clear stored progress in `localStorage` and reset back to Level 1 with 0 stars and locked subsequent levels.
2. **`src/components/TopBar/TopBar.tsx`**:
   - Integrated `isLevelUnlocked` and `getUnlockRequirementText`.
   - Locked levels are rendered with `🔒 [Title] (Cần 1★ ở Màn X)` and marked `disabled`.
   - Added a "Đặt lại" (Reset Progress) ghost button with `RotateCcw` icon and `window.confirm` dialog protection.
3. **`src/App.tsx`**:
   - Guarded level switching in `handleSelectLevel` with `isLevelUnlocked`.
   - Added `handleResetProgress` wired to `onResetProgress` in `TopBar`.
4. **`tests/unit/campaignProgression.test.tsx`**:
   - Added 10 comprehensive unit tests covering all unlocking rules, sequence calculations, backward compatibility, reset functionality, disabled UI options, and user confirmation.

### How to Run
```bash
npm test -- tests/unit/campaignProgression.test.tsx
npm run build
```
All 16 test suites pass (85 tests total).
