# S-025: Khắc Phục Lỗi Cài Đặt Gói Phụ Thuộc Peer Dependencies Khi Deploy Lên Vercel (Fix Vercel Build Peer Dependency Resolution)

Status: Done

## User Story
As a developer and stakeholder deploying the game to Vercel,  
I want `npm install` / `npm ci` on Vercel to resolve all package dependencies cleanly without `ERESOLVE` peer dependency conflicts, and build into the correct output directory,  
So that every deployment to Vercel completes successfully and serves the latest version of Design Gaming.

## Acceptance Criteria
- [x] Khắc phục xung đột `peerDependencies` giữa `@vitejs/plugin-react` và `vite@^8.3.5`:
  - Nâng cấp `@vitejs/plugin-react` lên `^5.2.0` (hỗ trợ chính thức `vite: '^8.0.0'`).
  - Thêm `@testing-library/dom` vào `devDependencies` để thỏa mãn peer dependency của React testing library.
  - Tái tạo `package-lock.json` đồng bộ và kiểm tra lệnh `npm ci` thực thi thành công không lỗi (exit code 0).
- [x] Cấu hình triển khai Vercel (`vercel.json`):
  - Định rõ `"outputDirectory": "build"` và `"buildCommand": "npm run build"` để Vercel nhận diện chính xác thư mục xuất file của Vite.
- [x] Đảm bảo toàn bộ 20 test suites (113 tests) và `npm run build` chạy thành công.
- [x] Vượt qua toàn bộ cổng kiểm thử bảo mật: `npm audit`, `gitleaks`, `semgrep`.

## Out of Scope
- Thay đổi cấu trúc code React hoặc logic mô phỏng hệ thống.

## Assumptions
- Nâng cấp `@vitejs/plugin-react` lên 5.2.0 tương thích 100% với React 18/19 và Vite 8.

## Acceptance
- **Accepted by**: Product Owner
- **Evidence**:
  - `npm ci`: Exit code 0, 192 packages installed cleanly in 2s.
  - `npm test -- --run`: 20/20 test suites passed (113/113 tests).
  - `npm run build`: Output built to `build/` without errors or deprecation warnings.
  - Scanners: `npm audit` (0 vulns), `gitleaks` (0 leaks), `semgrep` (0 findings).
  - Review: APPROVED by Reviewer.
- **Date**: 2026-10-27
- **Verdict**: PASS
