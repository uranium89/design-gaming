# UI Review - S-020: Strict Sequential Level Unlocking & Stale Progress Invalidation

Status: PASS
Author: ui-designer

## Observations
- In the TopBar level dropdown selector:
  - If a player has not beaten Levels 1-4, Level 5 is rendered with `🔒 Level 5: Ticket Rush (Cần 1★ ở Màn 4)` and `disabled={true}`.
  - Option is greyed out and cannot be selected by clicking or keyboard navigation.
  - No layout shift or visual regressions introduced in the TopBar or dropdown menu.
