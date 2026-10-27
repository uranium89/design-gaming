# Threat Model - S-020: Strict Sequential Level Unlocking & Stale Progress Invalidation

Status: Complete
Author: devsecops

## 1. Assets & Security Boundaries
- **Game Progression Integrity**: State stored in browser `localStorage` (`sysarchitect_progress_v1`).
- **Feature Access Control**: Campaign level access gating prevents skipping challenges and ensures players learn concepts progressively.

## 2. Threat Analysis (STRIDE)
- **Tampering / Elevation of Privilege**:
  - *Threat*: In previous implementations, any stale or artificially injected `unlocked: true` flag in `localStorage` could allow players to jump directly to Level 5, skipping educational scaffolding.
  - *Mitigation*: Serverless/client-side rule enforcement computes unlocking dynamically based on predecessor state (`CAMPAIGN_LEVEL_SEQUENCE[index - 1].stars >= 1`). Independent `unlocked: true` flags without completed predecessor levels are strictly invalidated.
- **Information Disclosure / Secret Leakage**:
  - No secrets, credentials, or PII are stored in game progress.
  - Progress storage contains only numeric scores, star counts, timestamps, and boolean flags.

## 3. Security Acceptance Criteria
- [x] Client-side state loading sanitizes untrusted or legacy data.
- [x] Missing or corrupted flags fall back to the safest state (`unlocked: false` for all non-intro levels).
- [x] Zero external data transmission or leakage.
