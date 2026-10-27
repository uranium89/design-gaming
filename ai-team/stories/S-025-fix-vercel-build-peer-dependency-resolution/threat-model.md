# Threat Model: S-025 Khắc Phục Lỗi Cài Đặt Gói Phụ Thuộc Peer Dependencies Khi Deploy Lên Vercel

## Assets & Scope
- Scope: File cấu hình cài đặt (`package.json`, `package-lock.json`, `.npmrc`) và cấu hình triển khai (`vercel.json`).
- Assets: Quá trình build an toàn, không có chuỗi cung ứng bị tấn công, không rò rỉ thông tin hoặc secret trong cấu hình triển khai.

## Threats & Mitigations
1. **Supply Chain Dependency Risk (T-025-1)**:
   - Threat: Nâng cấp phiên bản plugin devDependency tải phải gói mã độc hoặc lỗ hổng bảo mật mới.
   - Mitigation: `@vitejs/plugin-react` là gói chính thức được bảo trì bởi Vite core team. Kiểm tra `npm audit` sau khi cài đặt để đảm bảo 0 lỗ hổng bảo mật.
2. **Credential Exposure Risk (T-025-2)**:
   - Threat: Cấu hình `vercel.json` chứa các biến môi trường nhạy cảm hoặc secret.
   - Mitigation: `vercel.json` chỉ chứa chỉ dẫn build (`buildCommand`, `outputDirectory`), tuyệt đối không chứa tokens hay environment keys. Quét `gitleaks` sau khi tạo file.
3. **CI Dependency Drift (T-025-3)**:
   - Threat: Môi trường local và Vercel cài các phiên bản package khác nhau do thiếu lockfile hoặc cấu hình lỏng lẻo.
   - Mitigation: Commit đầy đủ `package-lock.json` sau khi giải quyết xung đột; kiểm tra xác thực bằng `npm ci`.

## Security Acceptance Criteria
- [x] Không lưu trữ bất kỳ secret nào trong `vercel.json` hoặc `.npmrc`.
- [x] `npm audit` trả về 0 vulnerabilities.
- [x] `gitleaks` và `semgrep` quét sạch sẽ không có cảnh báo.
