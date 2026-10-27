# Threat Model: S-019 Tối Ưu Bố Cục TopBar & Chống Tràn Giao Diện (TopBar Responsive Layout & Action Consolidation)

## Asset & Trust Boundaries
- **Scope**: CSS layout, DOM responsive classes, button aria-labels.
- No new inputs, server endpoints, or data deserialization paths are introduced.

## Threats & Mitigations (STRIDE)
1. **Accessibility Degradation via Icon-only Buttons**:
   - *Threat*: Icon-only buttons lack text labels for screen readers or keyboard users.
   - *Mitigation*: Strictly enforce `aria-label` attributes on all icon buttons (`aria-label="Đặt lại tiến trình chơi"`, `title="..."`).
2. **Click Jacking / Misclicks from Button Proximity**:
   - *Threat*: Reducing button margins leads to accidental destructive reset clicks.
   - *Mitigation*: Retain mandatory `window.confirm()` verification dialog for the Reset action.

## Security Acceptance Criteria
- [x] All icon-only and collapsible buttons retain full accessible labels (`aria-label` & `title`).
- [x] Reset action retains destructive confirmation safety check.
