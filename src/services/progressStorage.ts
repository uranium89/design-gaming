export interface LevelProgress {
  stars: number;
  totalScore: number;
  passed: boolean;
  unlocked: boolean;
  updatedAt?: string;
}

export type GameProgress = Record<string, LevelProgress>;

export const PROGRESS_STORAGE_KEY = 'sysarchitect_progress_v1';

/**
 * Loads game progress from browser localStorage.
 * Automatically recovers from missing or corrupted data.
 */
export function loadProgress(): GameProgress {
  if (typeof window === 'undefined' || !window.localStorage) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return {};
    }

    const sanitized: GameProgress = {};
    for (const [levelId, val] of Object.entries(parsed)) {
      if (typeof val === 'object' && val !== null) {
        const item = val as Record<string, unknown>;
        sanitized[levelId] = {
          stars: Math.max(0, Math.min(3, Math.round(Number(item.stars) || 0))),
          totalScore: Math.max(0, Math.round(Number(item.totalScore) || 0)),
          passed: Boolean(item.passed),
          unlocked: item.unlocked !== undefined ? Boolean(item.unlocked) : true,
          updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : undefined,
        };
      }
    }
    return sanitized;
  } catch (err) {
    console.warn('Failed to load progress from localStorage:', err);
    return {};
  }
}

/**
 * Saves level score and stars to localStorage if score or stars is higher than before.
 */
export function saveLevelProgress(
  levelId: string,
  stars: number,
  totalScore: number
): GameProgress {
  const current = loadProgress();
  const existing = current[levelId];

  const safeStars = Math.max(0, Math.min(3, Math.round(stars)));
  const safeScore = Math.max(0, Math.round(totalScore));

  const shouldUpdate =
    !existing || safeStars > existing.stars || safeScore > existing.totalScore;

  if (shouldUpdate) {
    current[levelId] = {
      stars: Math.max(safeStars, existing?.stars || 0),
      totalScore: Math.max(safeScore, existing?.totalScore || 0),
      passed: safeStars > 0 || (existing?.passed ?? false),
      unlocked: true,
      updatedAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(current));
      } catch (err) {
        console.warn('Failed to save progress to localStorage:', err);
      }
    }
  }

  return current;
}

/**
 * Helper to get star count for a given level.
 */
export function getLevelStars(progress: GameProgress, levelId: string): number {
  return progress[levelId]?.stars || 0;
}

/**
 * Formats star string, e.g. "⭐⭐⭐"
 */
export function renderStarString(stars: number): string {
  if (stars <= 0) return '';
  return '⭐'.repeat(Math.min(3, Math.max(1, stars)));
}
