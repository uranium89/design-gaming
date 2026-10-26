# Threat Model: S-016 Chế Độ Sandbox Tự Do & Lưu Trữ Tiến Trình Chơi (LocalStorage Star Tracking)

Status: Complete  
Risk Level: 🟢 Low

## 1. Threats Identified
- **T-01: Malformed or Corrupted `localStorage` data**:
  - Risk: Player manually edits `localStorage` or previous schema causes `JSON.parse` exception, crashing the app.
  - Mitigation: Wrap all `localStorage.getItem` in try/catch block with fallback to valid default state `{}`. Validate schema with integer coercion for stars (clamped `0` to `3`).
- **T-02: Denial of Service via Extreme RPS in Sandbox**:
  - Risk: Player slides RPS to 50,000, causing calculation loop or UI freeze.
  - Mitigation: Simulation engine runs asynchronously in Web Worker (`simulationWorker.ts`). High RPS calculations only execute simple arithmetic multiplications and additions per tick, executing in < 1ms.

## 2. Security Acceptance Criteria
- [x] `loadProgress` never throws unhandled errors on null, invalid JSON, or wrong types.
- [x] Sliders clamp values to safe bounds: RPS [100, 50000], Write Ratio [0, 1].
