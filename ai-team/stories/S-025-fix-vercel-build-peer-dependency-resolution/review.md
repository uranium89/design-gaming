# Code & Architecture Review: S-025 Khắc Phục Lỗi Cài Đặt Gói Phụ Thuộc Peer Dependencies Khi Deploy Lên Vercel

## Loop 1

### Scope of Review
- Peer dependency resolution in `package.json` (`@vitejs/plugin-react@^5.2.0` and `@testing-library/dom@^10.4.0`).
- Integrity of `package-lock.json` and verification of `npm ci` without fallback flags.
- Vercel configuration in `vercel.json` pointing to Vite build output (`build`).
- Test suite integrity (113/113 passing tests).
- Quality gates: 0 audit vulnerabilities, 0 leaks, 0 semgrep findings.

### Findings
- The `ERESOLVE` issue reported on Vercel was caused by `@vitejs/plugin-react@4.x` rejecting Vite 8 as an incompatible peer. Upgrading to `@vitejs/plugin-react@^5.2.0` solves this cleanly and natively.
- Adding `@testing-library/dom` completes the required peer dependencies for React testing libraries under clean CI installations.
- `vercel.json` provides explicit output routing to `build/`.
- No sensitive keys or secrets added.

### Verdict
**APPROVED**
