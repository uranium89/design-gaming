# Technical Specification - S-021: Web Audio Synth Sound Effects & Mute Control

Status: Ready
Risk Level: 🟢 Low (Confined to audio utility service, TopBar button, and event hooks)

## 1. Overview
Triển khai hệ thống âm thanh tổng hợp đa tầng (Multi-tier Synthesizer) bằng Web Audio API thuần của trình duyệt, cung cấp phản hồi âm thanh xúc giác (Tactile Audio Feedback) cho các hành động quan trọng trong game: nối cáp, khởi động mô phỏng, cảnh báo quá tải linh kiện và hoàn thành màn chơi nhận sao.

## 2. Audio Architecture & Synthesis Graphs
Tất cả âm thanh được tổng hợp thời gian thực từ phần tử sóng (`OscillatorNode`) và tầng khuếch đại (`GainNode`) thông qua một AudioContext dùng chung duy nhất (`singleton`):

```
[Oscillator Node(s)] ---> [Gain Node (Envelope ADSR)] ---> [Master Gain (Mute Controller)] ---> [AudioContext.destination]
```

### A. Chi tiết các Profile Âm Thanh:
1. **`cable-connect` (Nối dây thành công)**:
   - Dạng sóng: `sine` kết hợp `triangle`.
   - Tần số: 880Hz lướt nhanh lên 1320Hz trong 70ms.
   - Biên độ: Exponential decay $0.15 \rightarrow 0.001$.
   - Cảm giác: Tiếng "click" điện tử thanh gọn, sắc sảo.
2. **`simulation-start` (Bắt đầu phát tải)**:
   - Dạng sóng: `triangle`.
   - Tần số: 220Hz lướt êm dịu lên 440Hz trong 220ms.
   - Biên độ: Tăng dần rồi giảm êm.
   - Cảm giác: Tiếng "hum/glide" biểu thị luồng điện cao thế được kích hoạt.
3. **`node-overload` (Cảnh báo nghẽn/quá tải $\ge 90\%$)**:
   - Dạng sóng: `square` (hạn chế âm lượng để êm tai, gain 0.06).
   - Tần số: 2 xung ngắn ở 280Hz và 220Hz cách nhau 60ms.
   - Cảm giác: Tiếng beep cảnh báo khẩn cấp nhưng không gây chói gắt.
4. **`victory-fanfare` (Chiến thắng đạt sao)**:
   - Dạng sóng: `triangle` đa âm (Arpeggio).
   - Tần số: Nốt nhạc Đô trưởng C5 (523Hz) $\rightarrow$ E5 (659Hz) $\rightarrow$ G5 (784Hz) $\rightarrow$ C6 (1046Hz), phát tuần tự cách nhau 80ms.
   - Cảm giác: Hợp âm chiến thắng rộn rã, hào hứng.

### B. Mute & Storage Control:
- Lưu trạng thái vào `localStorage` với key `sysarchitect_audio_muted` (`'true'` hoặc `'false'`).
- `AudioService` cung cấp API:
  - `isMuted(): boolean`
  - `setMuted(muted: boolean): void`
  - `toggleMute(): boolean`
  - `onMuteChange(listener: (muted: boolean) => void): () => void`
  - `playCableConnect()`
  - `playSimulationStart()`
  - `playNodeOverload()`
  - `playVictoryFanfare(stars: number)`
- An toàn Autoplay: Tự động gọi `ctx.resume()` khi người chơi tương tác chuột/bàn phím lần đầu.

## 3. UI Component Integration
- **TopBar**:
  - Bổ sung nút bấm tròn tinh gọn (icon button) chứa icon `Volume2` (khi bật) hoặc `VolumeX` (khi tắt).
  - Nằm liền kề nút Đặt lại tiến trình (`RotateCcw`).
  - Tooltip: `Âm thanh: Đang bật (Click để tắt)` / `Âm thanh: Đang tắt (Click để bật)`.
- **Canvas / App.tsx**:
  - Gọi `playCableConnect()` khi `onConnect` tạo dây cáp thành công.
  - Gọi `playSimulationStart()` khi chuyển trạng thái `isRunning` từ `false` sang `true`.
  - Gọi `playVictoryFanfare(stars)` khi `ScoreModal` xuất hiện.
  - Gọi `playNodeOverload()` khi phát hiện nút có tải $\ge 90\%$ (có cơ chế throttle 3 giây tránh spam âm thanh liên tục).

## 4. Test Strategy
- Mock `AudioContext`, `OscillatorNode`, `GainNode` trong Vitest jsdom.
- Kiểm tra tính năng mute/unmute, lưu trữ `localStorage`, và gọi hàm phát âm thanh.
- Kiểm tra nút TopBar render đúng icon và toggle trạng thái mượt mà.
