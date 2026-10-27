# Technical Specification: S-017 Hệ Thống Mở Khóa Màn Chơi Theo Tiến Trình & Quản Lý Dữ Liệu Chơi (Campaign Level Unlocking Progression & Reset)

Status: Spec Complete  
Risk Level: 🟢 Low (Client-side localStorage logic and UI select state, no server risk)

## 1. Architecture Overview
1. **Progress & Unlocking Storage (`src/services/progressStorage.ts`)**:
   - Manages level progression, stars, and unlocking conditions in browser `localStorage`.
   - Campaign sequence: `level-01` -> `level-02` -> `level-03` -> `level-04` -> `level-05`.
   - `sandbox` is non-campaign and always unlocked.
   - Core helper functions:
     - `isLevelUnlocked(progress: GameProgress, levelId: string): boolean`:
       - `level-01` and `sandbox` are always `true`.
       - For `level-02` to `level-05`, returns `true` if `progress[levelId]?.unlocked === true` OR if the preceding level has `stars >= 1`.
     - `saveLevelProgress(levelId: string, stars: number, totalScore: number): GameProgress`:
       - When saving a level with `stars >= 1`, automatically find the next level in the sequence and mark `unlocked: true` for the next level.
     - `resetProgress(): GameProgress`:
       - Clears `sysarchitect_progress_v1` from `localStorage`, returning a clean state where only `level-01` and `sandbox` are unlocked and all stars/scores are reset to 0.
     - `getNextLevelId(levelId: string): string | null`:
       - Returns the next sequential campaign level ID, or `null` if on the last level or sandbox.
     - `getUnlockRequirementText(levelId: string): string`:
       - Returns a clear human-readable hint (e.g. *"Cần đạt ít nhất 1★ ở Màn 1 để mở khóa"*).

2. **TopBar & Level Selector UI (`src/components/TopBar/TopBar.tsx`)**:
   - For each level in the dropdown:
     - Check `isLevelUnlocked(currentProgress, lvl.id)`.
     - If unlocked: display `lvl.badge` + earned stars (e.g., `Level 1: The Bakery ⭐⭐⭐`).
     - If locked: display `🔒 ${lvl.badge} (Cần 1★ ở Màn trước)`, with `disabled` attribute so it cannot be selected.
   - Add Reset Progress button (`onResetProgress`) with a confirmation dialog:
     - Prompts: *"Bạn có chắc chắn muốn đặt lại toàn bộ tiến trình chơi về ban đầu không?"*.
     - On confirmation, calls `resetProgress()`, updates state, and resets to `LEVEL_01`.

3. **App Integration (`src/App.tsx`)**:
   - `handleSelectLevel`: verifies that the target level is unlocked before switching.
   - `handleOpenScore`: upon evaluation, if `score.stars >= 1`, `saveLevelProgress` unlocks the next level.

## 2. API Contract & Data Types
```ts
export interface LevelProgress {
  stars: number;
  totalScore: number;
  passed: boolean;
  unlocked: boolean;
  updatedAt?: string;
}

export type GameProgress = Record<string, LevelProgress>;

export const CAMPAIGN_LEVEL_SEQUENCE = [
  'level-01',
  'level-02',
  'level-03',
  'level-04',
  'level-05',
] as const;
```
