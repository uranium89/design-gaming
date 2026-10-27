# Implementation Notes: S-025 Khắc Phục Lỗi Cài Đặt Gói Phụ Thuộc Peer Dependencies Khi Deploy Lên Vercel

## Loop 1

### Overview of Changes
1. **Upgraded `@vitejs/plugin-react` to `^5.2.0`**:
   - `package.json`: Updated `@vitejs/plugin-react` from `^4.3.4` to `^5.2.0`.
   - Plugin version 5.2.0 officially supports Vite 8 via peer dependency range `peer vite@"^4.2.0 || ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0"`.
   - Eliminates the previous Vite warning `[vite:react-babel] We recommend switching to @vitejs/plugin-react-oxc`.
2. **Added `@testing-library/dom` to `devDependencies`**:
   - `package.json`: Explicitly added `"@testing-library/dom": "^10.4.0"` to satisfy the peer dependency of `@testing-library/react` and `@testing-library/jest-dom` under clean CI installs.
3. **Added Vercel Deployment Configuration (`vercel.json`)**:
   - Configured `outputDirectory`: `"build"` and `buildCommand`: `"npm run build"` to ensure Vercel routes deployment builds to the correct build output folder rather than defaulting to `dist`.
4. **Regenerated `package-lock.json`**:
   - Synchronized all dependencies cleanly using `npm install` and verified through `npm ci`.

### How to Run and Verify
- `npm ci`: Verifies clean package installation without any peer dependency resolution errors.
- `npm test -- --run`: Runs all 20 test suites (113 unit tests).
- `npm run build`: Validates successful production bundle creation in `build/`.
