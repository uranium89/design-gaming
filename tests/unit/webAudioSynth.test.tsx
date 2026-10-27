import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { audioService, AUDIO_MUTE_STORAGE_KEY } from '../../src/services/audioService';
import { TopBar } from '../../src/components/TopBar/TopBar';
import { ALL_LEVELS } from '../../src/levels';

describe('S-021 Web Audio Synth & Mute Control Unit Tests', () => {
  let mockOscillator: any;
  let mockGain: any;
  let mockContext: any;

  beforeEach(() => {
    window.localStorage.clear();
    audioService.setMuted(false);

    mockOscillator = {
      type: 'sine',
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };

    mockGain = {
      gain: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    };

    mockContext = {
      state: 'running',
      currentTime: 10,
      destination: {},
      createOscillator: vi.fn(() => ({ ...mockOscillator })),
      createGain: vi.fn(() => ({ ...mockGain })),
      resume: vi.fn().mockResolvedValue(undefined),
    };

    audioService.setContextForTesting(mockContext, mockGain);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('AudioService Unit Tests', () => {
    it('manages mute state and persists to localStorage', () => {
      expect(audioService.isMuted()).toBe(false);

      audioService.setMuted(true);
      expect(audioService.isMuted()).toBe(true);
      expect(window.localStorage.getItem(AUDIO_MUTE_STORAGE_KEY)).toBe('true');

      const toggled = audioService.toggleMute();
      expect(toggled).toBe(false);
      expect(audioService.isMuted()).toBe(false);
      expect(window.localStorage.getItem(AUDIO_MUTE_STORAGE_KEY)).toBe('false');
    });

    it('notifies listeners when mute state changes', () => {
      const listener = vi.fn();
      const unsubscribe = audioService.onMuteChange(listener);

      audioService.setMuted(true);
      expect(listener).toHaveBeenCalledWith(true);

      audioService.setMuted(false);
      expect(listener).toHaveBeenCalledWith(false);

      unsubscribe();
      audioService.setMuted(true);
      expect(listener).toHaveBeenCalledTimes(2);
    });

    it('plays cable connect sound when not muted', () => {
      audioService.setMuted(false);
      audioService.playCableConnect();

      expect(mockContext.createOscillator).toHaveBeenCalled();
      expect(mockContext.createGain).toHaveBeenCalled();
    });

    it('does not play sounds when muted', () => {
      audioService.setMuted(true);
      audioService.playCableConnect();
      audioService.playSimulationStart();
      audioService.playNodeOverload();
      audioService.playVictoryFanfare(3);

      expect(mockContext.createOscillator).not.toHaveBeenCalled();
    });

    it('throttles node overload alert sound to prevent audio spam', () => {
      audioService.setMuted(false);
      audioService.playNodeOverload();
      const firstCallCount = mockContext.createOscillator.mock.calls.length;
      expect(firstCallCount).toBeGreaterThan(0);

      // Immediate second call should be throttled
      audioService.playNodeOverload();
      expect(mockContext.createOscillator.mock.calls.length).toBe(firstCallCount);
    });

    it('plays victory fanfare arpeggio according to star count', () => {
      audioService.setMuted(false);
      audioService.playVictoryFanfare(3);

      // For 3 stars, arpeggio plays 4 notes
      expect(mockContext.createOscillator).toHaveBeenCalledTimes(4);
    });
  });

  describe('TopBar Audio Toggle Component Tests', () => {
    it('renders audio toggle button and flips icon on click', () => {
      audioService.setMuted(false);

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
          onToggleSimulation={() => {}}
          onSetSpeed={() => {}}
        />
      );

      // Initially unmuted: button label indicates "Tắt âm thanh"
      const muteBtn = screen.getByRole('button', { name: /Tắt âm thanh/i });
      expect(muteBtn).toBeInTheDocument();

      // Click to mute
      fireEvent.click(muteBtn);
      expect(audioService.isMuted()).toBe(true);

      // Now button label indicates "Bật âm thanh"
      expect(screen.getByRole('button', { name: /Bật âm thanh/i })).toBeInTheDocument();
    });
  });
});
