import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import {
  loadProgress,
  saveLevelProgress,
  resetProgress,
  isLevelUnlocked,
  getNextLevelId,
  getUnlockRequirementText,
  CAMPAIGN_LEVEL_SEQUENCE,
  PROGRESS_STORAGE_KEY,
} from '../../src/services/progressStorage';
import { TopBar } from '../../src/components/TopBar/TopBar';
import { ALL_LEVELS } from '../../src/levels';

describe('S-017 Campaign Level Unlocking Progression & Reset Unit Tests', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('Campaign Level Progression Service', () => {
    it('verifies campaign level sequence has 5 ordered levels', () => {
      expect(CAMPAIGN_LEVEL_SEQUENCE).toEqual([
        'level-01-bakery',
        'level-02-tech-news',
        'level-03-flash-deals',
        'level-04-tinyurl',
        'level-05-ticket-rush',
      ]);
    });

    it('correctly calculates next level in sequence', () => {
      expect(getNextLevelId('level-01-bakery')).toBe('level-02-tech-news');
      expect(getNextLevelId('level-02-tech-news')).toBe('level-03-flash-deals');
      expect(getNextLevelId('level-03-flash-deals')).toBe('level-04-tinyurl');
      expect(getNextLevelId('level-04-tinyurl')).toBe('level-05-ticket-rush');
      expect(getNextLevelId('level-05-ticket-rush')).toBeNull();
      expect(getNextLevelId('sandbox')).toBeNull();
    });

    it('returns true for Level 1 and Sandbox by default, false for subsequent levels', () => {
      const emptyProgress = {};
      expect(isLevelUnlocked(emptyProgress, 'level-01-bakery')).toBe(true);
      expect(isLevelUnlocked(emptyProgress, 'sandbox')).toBe(true);
      expect(isLevelUnlocked(emptyProgress, 'level-02-tech-news')).toBe(false);
      expect(isLevelUnlocked(emptyProgress, 'level-03-flash-deals')).toBe(false);
      expect(isLevelUnlocked(emptyProgress, 'level-04-tinyurl')).toBe(false);
      expect(isLevelUnlocked(emptyProgress, 'level-05-ticket-rush')).toBe(false);
    });

    it('returns correct requirement string for locked levels', () => {
      expect(getUnlockRequirementText('level-01-bakery')).toBe('');
      expect(getUnlockRequirementText('sandbox')).toBe('');
      expect(getUnlockRequirementText('level-02-tech-news')).toBe('Cần 1★ ở Màn 1');
      expect(getUnlockRequirementText('level-03-flash-deals')).toBe('Cần 1★ ở Màn 2');
      expect(getUnlockRequirementText('level-04-tinyurl')).toBe('Cần 1★ ở Màn 3');
      expect(getUnlockRequirementText('level-05-ticket-rush')).toBe('Cần 1★ ở Màn 4');
    });

    it('automatically unlocks next level when saving a level with >= 1 star', () => {
      // Complete level 1 with 2 stars
      const progress = saveLevelProgress('level-01-bakery', 2, 85);

      expect(isLevelUnlocked(progress, 'level-01-bakery')).toBe(true);
      expect(isLevelUnlocked(progress, 'level-02-tech-news')).toBe(true);
      expect(isLevelUnlocked(progress, 'level-03-flash-deals')).toBe(false);

      // Complete level 2 with 1 star
      const progressLvl2 = saveLevelProgress('level-02-tech-news', 1, 72);
      expect(isLevelUnlocked(progressLvl2, 'level-03-flash-deals')).toBe(true);
      expect(isLevelUnlocked(progressLvl2, 'level-04-tinyurl')).toBe(false);
    });

    it('supports backwards compatibility if previous level had passing stars', () => {
      const legacyProgress = {
        'level-01-bakery': { stars: 3, totalScore: 95, passed: true, unlocked: true },
      };
      expect(isLevelUnlocked(legacyProgress, 'level-02-tech-news')).toBe(true);
    });

    it('strictly keeps Level 5 locked even if localStorage has unlocked: true when predecessors are incomplete', () => {
      // Bug scenario: localStorage contains Level 5 marked unlocked, but Level 4 is not passed
      const staleProgressWithLevel5 = {
        'level-01-bakery': { stars: 1, totalScore: 50, passed: true, unlocked: true },
        'level-05-ticket-rush': { stars: 0, totalScore: 0, passed: false, unlocked: true },
      };

      // Level 5 MUST NOT be unlocked because Level 2, 3, 4 are not passed!
      expect(isLevelUnlocked(staleProgressWithLevel5, 'level-05-ticket-rush')).toBe(false);
      expect(isLevelUnlocked(staleProgressWithLevel5, 'level-02-tech-news')).toBe(true);
      expect(isLevelUnlocked(staleProgressWithLevel5, 'level-03-flash-deals')).toBe(false);
      expect(isLevelUnlocked(staleProgressWithLevel5, 'level-04-tinyurl')).toBe(false);
    });

    it('sanitizes stale unlocked flags in localStorage during loadProgress()', () => {
      // Simulate raw corrupted / stale localStorage from an earlier sprint
      const rawCorruptedStorage = {
        'level-01-bakery': { stars: 0, totalScore: 0, passed: false },
        'level-05-ticket-rush': { stars: 0, totalScore: 0, passed: false, unlocked: true },
      };
      window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(rawCorruptedStorage));

      const loaded = loadProgress();
      expect(loaded['level-01-bakery'].unlocked).toBe(true);
      expect(loaded['level-05-ticket-rush'].unlocked).toBe(false);
      expect(isLevelUnlocked(loaded, 'level-05-ticket-rush')).toBe(false);
    });

    it('resets all progress and locks all levels except Level 1 and Sandbox', () => {
      // Save progress across levels
      saveLevelProgress('level-01-bakery', 3, 95);
      saveLevelProgress('level-02-tech-news', 2, 80);

      // Verify level 3 is unlocked
      const current = loadProgress();
      expect(isLevelUnlocked(current, 'level-03-flash-deals')).toBe(true);

      // Now reset
      const fresh = resetProgress();
      expect(isLevelUnlocked(fresh, 'level-01-bakery')).toBe(true);
      expect(isLevelUnlocked(fresh, 'sandbox')).toBe(true);
      expect(isLevelUnlocked(fresh, 'level-02-tech-news')).toBe(false);
      expect(isLevelUnlocked(fresh, 'level-03-flash-deals')).toBe(false);
      expect(window.localStorage.getItem(PROGRESS_STORAGE_KEY)).toBeNull();
    });
  });

  describe('TopBar Level Selector with Locks & Reset Button', () => {
    it('disables locked levels and shows padlock icon in dropdown', () => {
      const mockProgress = {
        'level-01-bakery': { stars: 2, totalScore: 85, passed: true, unlocked: true },
        'level-02-tech-news': { stars: 0, totalScore: 0, passed: false, unlocked: true },
      };

      render(
        <TopBar
          metrics={{
            throughputRps: 100,
            p95LatencyMs: 15,
            costPerMonth: 25,
            budgetLimit: 35,
            errorRate: 0,
            activeRequests: 2,
          }}
          simulation={{ isRunning: false, speed: 1, elapsedSeconds: 0 }}
          levels={ALL_LEVELS}
          currentLevelId="level-01-bakery"
          progress={mockProgress}
          onToggleSimulation={() => {}}
          onSetSpeed={() => {}}
        />
      );

      // Level 1: unlocked with 2 stars
      const lvl1Option = screen.getByRole('option', { name: /Level 1: The Bakery ⭐⭐/ });
      expect(lvl1Option).not.toBeDisabled();

      // Level 2: unlocked
      const lvl2Option = screen.getByRole('option', { name: /Level 2: Tech News/ });
      expect(lvl2Option).not.toBeDisabled();

      // Level 3: locked
      const lvl3Option = screen.getByRole('option', { name: /🔒 Level 3: Flash Deals \(Cần 1★ ở Màn 2\)/ });
      expect(lvl3Option).toBeDisabled();

      // Level 4: locked
      const lvl4Option = screen.getByRole('option', { name: /🔒 Level 4: TinyURL \(Cần 1★ ở Màn 3\)/ });
      expect(lvl4Option).toBeDisabled();
    });

    it('triggers reset progress on confirmation', () => {
      const onReset = vi.fn();
      vi.spyOn(window, 'confirm').mockReturnValue(true);

      render(
        <TopBar
          metrics={{
            throughputRps: 100,
            p95LatencyMs: 15,
            costPerMonth: 25,
            budgetLimit: 35,
            errorRate: 0,
            activeRequests: 2,
          }}
          simulation={{ isRunning: false, speed: 1, elapsedSeconds: 0 }}
          levels={ALL_LEVELS}
          currentLevelId="level-01-bakery"
          onResetProgress={onReset}
          onToggleSimulation={() => {}}
          onSetSpeed={() => {}}
        />
      );

      const resetBtn = screen.getByRole('button', { name: /Đặt lại tiến trình chơi/i });
      expect(resetBtn).toBeInTheDocument();

      fireEvent.click(resetBtn);
      expect(window.confirm).toHaveBeenCalled();
      expect(onReset).toHaveBeenCalled();
    });

    it('does not reset progress if user cancels confirmation', () => {
      const onReset = vi.fn();
      vi.spyOn(window, 'confirm').mockReturnValue(false);

      render(
        <TopBar
          metrics={{
            throughputRps: 100,
            p95LatencyMs: 15,
            costPerMonth: 25,
            budgetLimit: 35,
            errorRate: 0,
            activeRequests: 2,
          }}
          simulation={{ isRunning: false, speed: 1, elapsedSeconds: 0 }}
          levels={ALL_LEVELS}
          currentLevelId="level-01-bakery"
          onResetProgress={onReset}
          onToggleSimulation={() => {}}
          onSetSpeed={() => {}}
        />
      );

      const resetBtn = screen.getByRole('button', { name: /Đặt lại tiến trình chơi/i });
      fireEvent.click(resetBtn);
      expect(window.confirm).toHaveBeenCalled();
      expect(onReset).not.toHaveBeenCalled();
    });
  });
});
