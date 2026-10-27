# Threat Model - S-024: App Rebranding to Design Gaming & README Update

Status: Complete
Author: devsecops

## 1. Assets & Scope
- **Branding Assets**: Public text display in TopBar and HTML metadata.
- **Documentation**: Public repository `README.md`.

## 2. Threat Analysis (STRIDE)
- **Data Loss / Backward Compatibility**:
  - *Threat*: Đổi tên thương hiệu có thể vô tình làm thay đổi key lưu trữ `localStorage` (`sysarchitect_progress_v1`, `sysarchitect_audio_muted`), khiến người chơi cũ bị mất toàn bộ sao tiến trình.
  - *Mitigation*: Giữ nguyên các key `localStorage` nội bộ hoặc tạo alias tương thích ngược. Chỉ đổi nhãn hiển thị trực quan (visual labels).
- **Secret Leakage**:
  - Kiểm tra `README.md` mới để bảo đảm không chứa bất kỳ secret, API key hay token riêng tư nào.

## 3. Security Acceptance Criteria
- [x] Không làm mất dữ liệu người chơi cũ.
- [x] Không rò rỉ thông tin nhạy cảm trong tài liệu.
