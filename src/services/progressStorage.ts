export interface LevelProgress {
  stars: number;
  totalScore: number;
  passed: boolean;
  unlocked: boolean;
  updatedAt?: string;
}

export type GameProgress = Record<string, LevelProgress>;

export const PROGRESS_STORAGE_KEY = 'sysarchitect_progress_v1';

export const CAMPAIGN_LEVEL_SEQUENCE = [
  'level-01-bakery',
  'level-02-tech-news',
  'level-03-flash-deals',
  'level-04-tinyurl',
  'level-05-ticket-rush',
] as const;

/**
 * Returns the next level in the campaign sequence, or null if on the last level or sandbox.
 */
export function getNextLevelId(levelId: string): string | null {
  const index = CAMPAIGN_LEVEL_SEQUENCE.indexOf(levelId as (typeof CAMPAIGN_LEVEL_SEQUENCE)[number]);
  if (index >= 0 && index < CAMPAIGN_LEVEL_SEQUENCE.length - 1) {
    return CAMPAIGN_LEVEL_SEQUENCE[index + 1];
  }
  return null;
}

/**
 * Checks whether a level is unlocked.
 * - 'level-01-bakery' and 'sandbox' are always unlocked.
 * - Other campaign levels are strictly unlocked ONLY if ALL preceding levels in the campaign sequence
 *   have been completed with at least 1 star or marked passed.
 * - Stale or unvalidated unlocked flags on higher levels without completed predecessors are rejected.
 */
export function isLevelUnlocked(progress: GameProgress, levelId: string): boolean {
  if (levelId === 'sandbox' || levelId === 'level-01-bakery') {
    return true;
  }

  const index = CAMPAIGN_LEVEL_SEQUENCE.indexOf(levelId as (typeof CAMPAIGN_LEVEL_SEQUENCE)[number]);
  if (index > 0) {
    // Every predecessor level must have >= 1 star or passed === true
    for (let i = 0; i < index; i++) {
      const predLevelId = CAMPAIGN_LEVEL_SEQUENCE[i];
      const predProgress = progress[predLevelId];
      if (!predProgress || (predProgress.stars < 1 && !predProgress.passed)) {
        return false;
      }
    }
    return true;
  }

  return false;
}

/**
 * Returns human-readable unlocking requirements text for locked levels.
 */
export function getUnlockRequirementText(levelId: string): string {
  const index = CAMPAIGN_LEVEL_SEQUENCE.indexOf(levelId as (typeof CAMPAIGN_LEVEL_SEQUENCE)[number]);
  if (index > 0) {
    return `Cần 1★ ở Màn ${index}`;
  }
  return '';
}

/**
 * Loads game progress from browser localStorage.
 * Automatically recovers from missing or corrupted data and sanitizes unlocked flags.
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
        const defaultUnlocked = levelId === 'level-01-bakery' || levelId === 'sandbox';
        sanitized[levelId] = {
          stars: Math.max(0, Math.min(3, Math.round(Number(item.stars) || 0))),
          totalScore: Math.max(0, Math.round(Number(item.totalScore) || 0)),
          passed: Boolean(item.passed),
          unlocked: item.unlocked !== undefined ? Boolean(item.unlocked) : defaultUnlocked,
          updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : undefined,
        };
      }
    }

    // Sanitize unlocked state across all campaign levels against strict progression rules
    for (const levelId of CAMPAIGN_LEVEL_SEQUENCE) {
      if (sanitized[levelId]) {
        sanitized[levelId].unlocked = isLevelUnlocked(sanitized, levelId);
      }
    }

    return sanitized;
  } catch (err) {
    console.warn('Failed to load progress from localStorage:', err);
    return {};
  }
}

/**
 * Saves level score and stars to localStorage.
 * Automatically unlocks the subsequent level if at least 1 star was earned.
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
  }

  // If player earned at least 1 star, unlock next level
  if (safeStars >= 1) {
    const nextLevelId = getNextLevelId(levelId);
    if (nextLevelId) {
      if (!current[nextLevelId]) {
        current[nextLevelId] = {
          stars: 0,
          totalScore: 0,
          passed: false,
          unlocked: true,
        };
      } else {
        current[nextLevelId].unlocked = true;
      }
    }
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(current));
    } catch (err) {
      console.warn('Failed to save progress to localStorage:', err);
    }
  }

  return current;
}

/**
 * Resets all progress and locks all levels except Level 1 and Sandbox.
 */
export function resetProgress(): GameProgress {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
    } catch (err) {
      console.warn('Failed to reset progress from localStorage:', err);
    }
  }

  const initialProgress: GameProgress = {
    'level-01-bakery': {
      stars: 0,
      totalScore: 0,
      passed: false,
      unlocked: true,
    },
  };

  return initialProgress;
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
