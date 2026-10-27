# Threat Model - S-021: Web Audio Synth Sound Effects & Mute Control

Status: Complete
Author: devsecops

## 1. Assets & Surface
- **Audio Output**: Web Audio API `AudioContext`.
- **Local Persistence**: `localStorage` key `sysarchitect_audio_muted`.

## 2. Threat Analysis (STRIDE)
- **Denial of Service / Audio Bombing (Hearing Hazard)**:
  - *Threat*: Nếu một node bị quá tải liên tục hoặc vòng lặp sự kiện kích hoạt `playNodeOverload()` hàng trăm lần/giây, âm thanh phát dồn dập có thể gây khó chịu hoặc chói tai cho người chơi.
  - *Mitigation*:
    - Giới hạn âm lượng tối đa (Master Gain $\le 0.15$).
    - Tích hợp cơ chế Rate Limiting / Debounce cho các âm thanh cảnh báo lặp lại (ví dụ: `playNodeOverload` chỉ phát tối đa 1 lần mỗi 3 giây).
- **Tampering**:
  - `localStorage` key `sysarchitect_audio_muted` chỉ nhận giá trị boolean (`'true'` / `'false'`). Nếu bị sửa đổi giá trị lạ, tự động fallback an toàn về `false`.
- **Information Disclosure / Secret Leakage**:
  - Không có dữ liệu người dùng hay mạng truyền ra ngoài. Zero external network requests.

## 3. Security Acceptance Criteria
- [x] Không tải bất kỳ external audio asset nào.
- [x] Có giới hạn Master Gain an toàn ($\le 0.15$) và throttling cho âm thanh cảnh báo lặp lại.
- [x] Fallback an toàn khi Web Audio API bị chặn hoặc không được hỗ trợ bởi trình duyệt.
