# Implementation Notes - S-020: Strict Sequential Level Unlocking & Stale Progress Invalidation

## Summary of Changes
1. **`src/services/progressStorage.ts`**:
   - Updated `isLevelUnlocked(progress, levelId)`:
     - Strict prerequisite checking: For any campaign level $N$ ($N \ge 2$), every single predecessor level in `CAMPAIGN_LEVEL_SEQUENCE` must have earned $\ge 1★$ or have `passed: true`.
     - Removed the short-circuit `if (progress[levelId]?.unlocked) return true;` which permitted stale `unlocked: true` entries in `localStorage` to bypass predecessor completion.
   - Updated `loadProgress()`:
     - When unmarshalling records from `localStorage`, default `unlocked` to `false` for all campaign levels except Màn 1 (`level-01-bakery`) and Sandbox.
     - Runs a sanitization loop against loaded records using `isLevelUnlocked` to normalize stale `unlocked: true` flags.
2. **`tests/unit/campaignProgression.test.tsx`**:
   - Added unit test verifying Level 5 remains strictly locked even when `localStorage` has `unlocked: true` if predecessor levels (Levels 2, 3, 4) have not been passed.
   - Added unit test verifying `loadProgress()` cleanses/sanitizes stale legacy `unlocked` flags from `localStorage`.
