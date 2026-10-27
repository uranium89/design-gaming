# Technical Specification: S-025 Khắc Phục Lỗi Cài Đặt Gói Phụ Thuộc Peer Dependencies Khi Deploy Lên Vercel

## Risk Classification
- **Risk Level**: 🟢 Low (Cập nhật phiên bản devDependency tương thích và thêm file cấu hình triển khai build, không ảnh hưởng logic ứng dụng runtime).

## Root Cause Analysis
1. **Peer Dependency Conflict (`ERESOLVE`)**:
   - `package.json` định nghĩa `"vite": "^8.3.5"` và `"@vitejs/plugin-react": "^4.3.4"`.
   - Phiên bản `@vitejs/plugin-react@4.7.0` (phiên bản 4.x mới nhất mà `^4.3.4` match tới) khai báo `peerDependencies` là `peer vite@"^4.2.0 || ^5.0.0 || ^6.0.0 || ^7.0.0"`.
   - Khi môi trường CI/CD như Vercel chạy `npm install` hoặc `npm ci`, npm phiên bản 7+ thực thi phân giải nghiêm ngặt peer dependencies và dừng lại với mã lỗi `ERESOLVE could not resolve`.
   - Giải pháp chuẩn: Nâng cấp `@vitejs/plugin-react` lên `^5.2.0` (phiên bản này hỗ trợ chính thức `vite: '^4.2.0 || ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0'`).
2. **CI Safety Net via `.npmrc`**:
   - Thêm `.npmrc` chứa `legacy-peer-deps=true` đảm bảo bất kỳ môi trường CI hoặc nhà phát triển nào dùng `npm` cũng không bị block bởi xung đột peer dependencies không mong muốn.
3. **Vercel Output Directory Alignment**:
   - `vite.config.ts` cấu hình thư mục đầu ra là `build/` (`outDir: 'build'`).
   - Mặc định Vercel cho Vite framework là `dist/`. Nếu không chỉ định, Vercel có thể cảnh báo hoặc không tìm thấy thư mục xuất file.
   - Thêm `vercel.json` định cấu hình rõ ràng:
     ```json
     {
       "buildCommand": "npm run build",
       "outputDirectory": "build"
     }
     ```

## Files to Modify / Create
- `package.json`: Nâng `@vitejs/plugin-react` từ `^4.3.4` lên `^5.2.0`.
- `.npmrc`: Tạo mới với thiết lập `legacy-peer-deps=true`.
- `vercel.json`: Tạo mới với cấu hình build và thư mục đầu ra `build`.
- `package-lock.json`: Tái tạo đồng bộ thông qua `npm install`.

## Verification Criteria
- `npm ci` thực thi hoàn tất với exit code 0.
- `npm test -- --run` chạy 100% pass (20 files, 113 tests).
- `npm run build` xuất file hợp lệ vào thư mục `build/`.
- `npm audit`, `gitleaks`, `semgrep` pass.
