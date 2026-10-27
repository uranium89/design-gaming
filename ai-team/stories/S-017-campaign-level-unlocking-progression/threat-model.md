# Threat Model: S-017 Hệ Thống Mở Khóa Màn Chơi Theo Tiến Trình & Quản Lý Dữ Liệu Chơi (Campaign Level Unlocking Progression & Reset)

## Asset & Trust Boundaries
- **Assets**: Client-side progress integrity, Level unlock state, localStorage keys.
- **Threat Actors**: Malicious/tampered localStorage entries, corrupted JSON data, arbitrary key injection.

## Threats & Mitigations (STRIDE)
1. **Tampering / Prototype Pollution via Corrupted localStorage Data**:
   - *Threat*: User or browser extensions modify `localStorage[sysarchitect_progress_v1]` with `__proto__`, non-numeric stars, or corrupted JSON strings.
   - *Mitigation*: Sanitization in `loadProgress()` with `JSON.parse` safe-guarding, validating field types, clamping stars between 0 and 3, and ignoring prototype properties.
2. **Denial of Service / Unhandled State Crash**:
   - *Threat*: An invalid `levelId` in progress state causes runtime `TypeError` when looking up level definitions or unlocking next level.
   - *Mitigation*: Strictly validate level IDs against `ALL_LEVELS` / `CAMPAIGN_LEVEL_SEQUENCE`. Fall back gracefully to `level-01` if invalid.
3. **Accidental Data Loss on Reset**:
   - *Threat*: Accidental clicking on "Reset Progress" wipes player achievements without recovery.
   - *Mitigation*: Require explicit user confirmation modal / confirm dialog before executing `resetProgress()`.

## Security Acceptance Criteria
- [ ] `loadProgress()` and `isLevelUnlocked()` safely handle corrupted localStorage without throwing unhandled exceptions.
- [ ] Reset confirmation prevents accidental state destruction.
