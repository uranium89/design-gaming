import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import {
  loadProgress,
  saveLevelProgress,
  getLevelStars,
  renderStarString,
  PROGRESS_STORAGE_KEY,
} from '../../src/services/progressStorage';
import { TopBar } from '../../src/components/TopBar/TopBar';
import { ALL_LEVELS, SANDBOX_LEVEL } from '../../src/levels';

describe('S-016 Sandbox Mode & LocalStorage Star Tracking Unit Tests', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('Progress Storage Service', () => {
    it('returns empty progress when localStorage is empty', () => {
      const progress = loadProgress();
      expect(progress).toEqual({});
    });

    it('safely recovers from corrupted JSON without throwing errors', () => {
      window.localStorage.setItem(PROGRESS_STORAGE_KEY, '{invalid:json@@@');
      const progress = loadProgress();
      expect(progress).toEqual({});
    });

    it('saves and updates level progress correctly', () => {
      saveLevelProgress('level-01-bakery', 3, 95);

      const progress = loadProgress();
      expect(progress['level-01-bakery']).toBeDefined();
      expect(progress['level-01-bakery'].stars).toBe(3);
      expect(progress['level-01-bakery'].totalScore).toBe(95);
      expect(progress['level-01-bakery'].passed).toBe(true);

      // Does not downgrade score/stars
      saveLevelProgress('level-01-bakery', 2, 70);
      const afterDowngrade = loadProgress();
      expect(afterDowngrade['level-01-bakery'].stars).toBe(3);
      expect(afterDowngrade['level-01-bakery'].totalScore).toBe(95);

      // Upgrades score if higher
      saveLevelProgress('level-01-bakery', 3, 98);
      const afterUpgrade = loadProgress();
      expect(afterUpgrade['level-01-bakery'].totalScore).toBe(98);
    });

    it('clamps stars between 0 and 3', () => {
      saveLevelProgress('test-level', 5, 120);
      const progress = loadProgress();
      expect(progress['test-level'].stars).toBe(3);

      expect(renderStarString(3)).toBe('⭐⭐⭐');
      expect(renderStarString(2)).toBe('⭐⭐');
      expect(renderStarString(1)).toBe('⭐');
      expect(renderStarString(0)).toBe('');
    });
  });

  describe('Sandbox Level Definition', () => {
    it('contains valid Sandbox level properties with unlimited budget', () => {
      expect(SANDBOX_LEVEL.id).toBe('sandbox');
      expect(SANDBOX_LEVEL.budgetMax).toBe(999999);
      expect(SANDBOX_LEVEL.baseRps).toBe(1000);
      expect(SANDBOX_LEVEL.initialNodes.length).toBe(1);
      expect(SANDBOX_LEVEL.initialNodes[0].data.name).toBe('User Traffic');
    });
  });

  describe('TopBar Star Display & Sandbox Controls', () => {
    it('renders stars next to level names in level selector', () => {
      const mockProgress = {
        'level-01-bakery': { stars: 3, totalScore: 95, passed: true, unlocked: true },
        'level-02-tech-news': { stars: 2, totalScore: 82, passed: true, unlocked: true },
      };

      render(
        <TopBar
          metrics={{
            throughputRps: 50,
            p95LatencyMs: 15,
            costPerMonth: 30,
            budgetLimit: 35,
            errorRate: 0,
            activeRequests: 1,
          }}
          simulation={{ isRunning: false, speed: 1, elapsedSeconds: 0 }}
          levels={ALL_LEVELS}
          currentLevelId="level-01-bakery"
          progress={mockProgress}
          onToggleSimulation={() => {}}
          onSetSpeed={() => {}}
        />
      );

      // Should display Level 1 with 3 stars
      expect(screen.getByText(/Level 1: The Bakery ⭐⭐⭐/)).toBeInTheDocument();
      // Should display Level 2 with 2 stars
      expect(screen.getByText(/Level 2: Tech News ⭐⭐/)).toBeInTheDocument();
      // Sandbox should be present
      expect(screen.getByText(/Sandbox Mode/)).toBeInTheDocument();
    });

    it('renders Sandbox controls (RPS slider, Write ratio slider, and ∞ Budget)', () => {
      const onSetRps = vi.fn();
      const onSetWriteRatio = vi.fn();

      render(
        <TopBar
          metrics={{
            throughputRps: 1000,
            p95LatencyMs: 8,
            costPerMonth: 120,
            budgetLimit: 999999,
            errorRate: 0,
            activeRequests: 10,
          }}
          simulation={{ isRunning: true, speed: 1, elapsedSeconds: 45 }}
          levels={ALL_LEVELS}
          currentLevelId="sandbox"
          sandboxTrafficRps={2500}
          sandboxWriteRatio={0.35}
          onSetSandboxTrafficRps={onSetRps}
          onSetSandboxWriteRatio={onSetWriteRatio}
          onToggleSimulation={() => {}}
          onSetSpeed={() => {}}
        />
      );

      // Verify Sandbox Controls
      expect(screen.getByText('Tải:')).toBeInTheDocument();
      expect(screen.getByText('2,500 RPS')).toBeInTheDocument();
      expect(screen.getByText('Ghi:')).toBeInTheDocument();
      expect(screen.getByText('35%')).toBeInTheDocument();

      // Verify Infinite Budget symbol
      expect(screen.getByText('∞ /mo')).toBeInTheDocument();

      // Interact with sliders
      const rpsSlider = screen.getByLabelText('Điều chỉnh RPS Sandbox');
      fireEvent.change(rpsSlider, { target: { value: '5000' } });
      expect(onSetRps).toHaveBeenCalledWith(5000);

      const writeSlider = screen.getByLabelText('Điều chỉnh tỉ lệ ghi Sandbox');
      fireEvent.change(writeSlider, { target: { value: '0.5' } });
      expect(onSetWriteRatio).toHaveBeenCalledWith(0.5);
    });
  });
});
