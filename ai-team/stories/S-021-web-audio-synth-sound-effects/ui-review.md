# UI Review - S-021: Web Audio Synth Sound Effects & Mute Control

Status: PASS
Author: ui-designer

## Visual & Interaction Observations
- **TopBar Audio Button**:
  - Rendered with circular `styles.iconBtn` (36px x 36px) adjacent to the Reset progress button.
  - Active state (Unmuted): Renders `Volume2` with vivid `#38bdf8` accent tone, indicating active audio.
  - Muted state: Renders `VolumeX` in muted slate grey `#94a3b8`.
  - Accessible tooltip and `aria-label` clearly state current status: "Âm thanh: Đang bật (Nhấn để tắt)" vs "Âm thanh: Đang tắt (Nhấn để bật)".
- **Audio Micro-Interactions**:
  - Zero UI blocking or frame drops during oscillator playback.
  - Audio envelopes are short and crisp without pop/click artifacts.
