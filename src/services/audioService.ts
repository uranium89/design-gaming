/**
 * Web Audio Synthesizer Service
 * 100% pure Web Audio API synthesizer for tactile micro-interactions.
 * Zero external audio downloads, 0ms latency, zero server cost.
 */

export const AUDIO_MUTE_STORAGE_KEY = 'sysarchitect_audio_muted';

type MuteListener = (muted: boolean) => void;

class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private muted: boolean = false;
  private listeners: Set<MuteListener> = new Set();
  private lastOverloadTime: number = 0;

  constructor() {
    this.initMuteState();
    this.registerAutoplayUnlock();
  }

  private initMuteState() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = window.localStorage.getItem(AUDIO_MUTE_STORAGE_KEY);
        this.muted = stored === 'true';
      } catch {
        this.muted = false;
      }
    }
  }

  private registerAutoplayUnlock() {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      this.ensureContext();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };

    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
  }

  private ensureContext(): AudioContext | null {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    if (typeof window === 'undefined') return null;

    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return null;

    try {
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.25, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      return this.ctx;
    } catch {
      return null;
    }
  }

  public setContextForTesting(ctx: AudioContext | null, masterGain?: GainNode | null): void {
    this.ctx = ctx;
    this.masterGain = masterGain || (ctx ? ctx.createGain() : null);
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.25, this.ctx.currentTime);
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean): void {
    this.muted = Boolean(muted);
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.25, this.ctx.currentTime);
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(AUDIO_MUTE_STORAGE_KEY, String(this.muted));
      } catch {}
    }
    this.listeners.forEach((fn) => fn(this.muted));
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  public onMuteChange(listener: MuteListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Sound Profile: Cable Connect (Crisp electronic snap/chirp)
   */
  public playCableConnect(): void {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.06);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  /**
   * Sound Profile: Simulation Start (Frequency glide hum)
   */
  public playSimulationStart(): void {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.18);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {}
  }

  /**
   * Sound Profile: Node Overload Alert (Throttled beep warning)
   * Plays at most once every 3 seconds to avoid sound clutter.
   */
  public playNodeOverload(): void {
    if (this.muted) return;
    const nowMs = Date.now();
    if (nowMs - this.lastOverloadTime < 3000) {
      return;
    }
    this.lastOverloadTime = nowMs;

    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    try {
      const now = ctx.currentTime;

      // Pulse 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(320, now);
      gain1.gain.setValueAtTime(0.04, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc1.connect(gain1);
      gain1.connect(this.masterGain);
      osc1.start(now);
      osc1.stop(now + 0.08);

      // Pulse 2
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(240, now + 0.09);
      gain2.gain.setValueAtTime(0.04, now + 0.09);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
      osc2.connect(gain2);
      gain2.connect(this.masterGain);
      osc2.start(now + 0.09);
      osc2.stop(now + 0.17);
    } catch {}
  }

  /**
   * Sound Profile: Victory Fanfare (Celebratory ascending arpeggio)
   */
  public playVictoryFanfare(stars: number = 3): void {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    try {
      const notes = [
        523.25, // C5
        659.25, // E5
        783.99, // G5
        1046.5, // C6
      ];

      const noteCount = Math.max(2, Math.min(4, stars + 1));
      const now = ctx.currentTime;

      for (let i = 0; i < noteCount; i++) {
        const noteTime = now + i * 0.09;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(notes[i], noteTime);

        gain.gain.setValueAtTime(0.15, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(noteTime);
        osc.stop(noteTime + 0.25);
      }
    } catch {}
  }
}

export const audioService = new AudioService();
