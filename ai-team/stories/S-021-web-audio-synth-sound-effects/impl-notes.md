# Implementation Notes - S-021: Web Audio Synth Sound Effects & Mute Control

## Summary of Changes
1. **`src/services/audioService.ts`**:
   - Implemented Web Audio API synthesis engine (zero external audio file downloads, pure oscillator and gain node graphs).
   - Designed 4 sound profiles:
     - `playCableConnect()`: 660Hz to 1320Hz crisp triangle chirp.
     - `playSimulationStart()`: 220Hz to 440Hz glide hum.
     - `playNodeOverload()`: Throttled dual-tone warning buzzer (max once every 3s).
     - `playVictoryFanfare(stars)`: Celebratory ascending arpeggio based on star count.
   - State management:
     - Toggle mute with local persistence (`sysarchitect_audio_muted`).
     - Listener subscription pattern for real-time UI synchronization.
     - Browser autoplay policy compliance (unlock on first user interaction).
2. **`src/components/TopBar/TopBar.tsx`**:
   - Added audio mute toggle button (`Volume2` / `VolumeX`) next to Reset progress button.
   - Subscribed to `audioService.onMuteChange` for seamless icon synchronization.
3. **Integration Hooks**:
   - `src/state/graphStore.ts`: Trigger `playCableConnect()` on `onConnect` and `playSimulationStart()` when starting simulation.
   - `src/App.tsx`: Trigger `playVictoryFanfare(score.stars)` when score modal opens with stars, and `playNodeOverload()` when error rate spikes during simulation.
4. **`tests/unit/webAudioSynth.test.tsx`**:
   - Added 7 unit tests covering AudioService mute toggling, localStorage persistence, oscillator scheduling, rate-limiting throttle, and TopBar toggle button behavior.
