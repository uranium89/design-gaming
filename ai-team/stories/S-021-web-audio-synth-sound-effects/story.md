# S-021: Hệ Thống Âm Thanh Phản Hồi Web Audio Synth & Nút Bật/Tắt Âm Thanh (Web Audio FX & Mute Control)

Status: Done

## User Story
As a player,  
I want the game to play rich, low-latency audio sound effects when I connect cables, start traffic simulations, experience node overload warnings, or achieve victory stars, and have a mute/unmute toggle on the TopBar,  
So that the system design game feels vibrant, tactile, and rewarding without slowing down my browser or requiring heavy external media downloads.

## Acceptance Criteria
- [x] Module `src/services/audioService.ts`:
  - Sử dụng chuẩn Web Audio API thuần (`AudioContext`, `OscillatorNode`, `GainNode`).
  - Tuyệt đối không tải các file `.mp3` hay `.wav` bên ngoài để bảo đảm 0KB asset ngoại lai và độ trễ phản hồi tức thì.
  - Hỗ trợ 4 profile hiệu ứng âm thanh cốt lõi:
    - `cable-connect`: Tiếng click/snap điện tử khi nối dây.
    - `simulation-start`: Tiếng hum/frequency glide nhẹ khi bắt đầu phát dòng tải.
    - `node-overload`: Tiếng beep/buzz cảnh báo khi một node chạm ngưỡng tải $\ge 90\%$.
    - `victory-fanfare`: Chuỗi hợp âm arpeggio thăng hoa khi bảng điểm `ScoreModal` đạt sao.
  - Quản lý trạng thái Mute/Unmute và lưu lựa chọn của người dùng vào `localStorage` (`sysarchitect_audio_muted`).
- [x] Nút điều khiển âm thanh trên TopBar:
  - Hiển thị icon loa `Volume2` (khi bật) và `VolumeX` (khi tắt).
  - Tự động đồng bộ với `audioService`.
- [x] Tích hợp phản hồi âm thanh vào các sự kiện trên Canvas, Simulator và Modal.
- [x] Unit tests kiểm tra `audioService` (mock `AudioContext`) và component toggle trên TopBar.

## Out of Scope
- Nhạc nền (BGM) lặp dài gây phân tâm khi tính toán kiến trúc.

## Assumptions
- Trình duyệt hiện đại hỗ trợ `window.AudioContext` hoặc `window.webkitAudioContext`.
- Tự động kích hoạt AudioContext sau cử chỉ tương tác đầu tiên của người dùng (tuân thủ Browser Autoplay Policy).

## Acceptance
- **Accepted by**: product-owner
- **Evidence**: Vitest unit test suite (106/106 passed), build passed, security scanners passed.
- **Date**: 2026-10-27
- **Verdict**: PASS / Done
