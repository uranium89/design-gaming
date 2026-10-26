# Technical Specification: S-016 Chế Độ Sandbox Tự Do & Lưu Trữ Tiến Trình Chơi (LocalStorage Star Tracking)

Status: Spec Complete  
Risk Level: 🟢 Low (Client-side localStorage and state extension, zero server risk)

## 1. Architecture Overview
1. **Progress Service (`src/services/progressStorage.ts`)**:
   - Manages player achievements and stars per level in `localStorage`.
   - Key: `sysarchitect_progress_v1`.
   - Resilient against corruption (`JSON.parse` wrapped in try/catch with fallback to empty state).
   - Functions:
     - `loadProgress(): Record<string, LevelProgress>`
     - `saveLevelProgress(levelId: string, stars: number, totalScore: number): Record<string, LevelProgress>`
     - `getLevelStars(progress: Record<string, LevelProgress>, levelId: string): number`
2. **Sandbox Definition (`src/levels/sandbox.ts` & `src/levels/index.ts`)**:
   - `id: 'sandbox'`
   - `name: 'Sandbox: Tự Do Thiết Kế'`
   - `budgetLimit: 999999` (Hiển thị vô hạn "∞")
   - `trafficRps: 1000` (mặc định), `writeRatio: 0.2`
   - Initial graph with single `User Traffic` node.
3. **Traffic Injector Controls in TopBar (`src/components/TopBar/TopBar.tsx`)**:
   - When active level is `'sandbox'`, display interactive sliders in TopBar or dedicated toolbar:
     - RPS slider: 100 to 50,000 RPS (step 500).
     - Write Ratio slider: 0% to 100% (step 5%).
   - Level dropdown displays earned stars next to level names (e.g. `Level 1: Tiệm Bánh Ngọt ⭐⭐⭐`).
4. **Evaluation Persistence**:
   - In `ScoreModal` or `App.tsx` on evaluation completion, auto-save stars and score to progress store.

## 2. API Contract & Data Types
```ts
export interface LevelProgress {
  stars: number;
  totalScore: number;
  passed: boolean;
  unlocked: boolean;
}

export type GameProgress = Record<string, LevelProgress>;
```
