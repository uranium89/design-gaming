# ADR 0002: Mô hình Mô phỏng Lưu lượng trong Web Worker (Discrete Event Simulation)

- **Status**: ACCEPTED
- **Decider**: Architect
- **Risk Level**: 🟡 Medium (Ảnh hưởng kiến trúc luồng dữ liệu giữa UI Thread và Simulation Engine)

## Context
Trò chơi mô phỏng lưu lượng truy cập thực tế với hàng nghìn đến hàng chục nghìn RPS ảo. Nếu chạy tính toán hàng đợi M/M/c/K, độ trễ, tỉ lệ lỗi và sinh hạt packet trực tiếp trên Main Thread của trình duyệt:
- Giao diện người dùng (UI) sẽ bị giật/khựng hình (dropped frames).
- Trải nghiệm kéo-thả và tinh chỉnh thông số trong Inspector sẽ bị trễ.

## Decision
1. Toàn bộ logic toán học của bộ mô phỏng (Simulation Engine) được cô lập bên trong một **Dedicated Web Worker**.
2. Cơ chế truyền thông:
   - **Main Thread $\rightarrow$ Worker**: Gửi snapshot cấu hình đồ thị mạng (danh sách nodes, edges, thuộc tính nội tại) và lệnh điều khiển (`START`, `PAUSE`, `SET_SPEED`, `INJECT_INCIDENT`).
   - **Worker $\rightarrow$ Main Thread**: Gửi dữ liệu nén định kỳ (20-30 FPS) chứa metrics tức thời (RPS, Error count, Latency P95, Cost accumulator) và danh sách tọa độ các hạt packet đang bay trên các dây nối.
3. Sử dụng mô hình Discrete Event Simulation (DES) theo nhịp Tick (mỗi tick = 50ms ảo).

## Challenge (Reviewer's perspective)
- **Thách thức**: Chi phí serialize/deserialize qua `postMessage` có thể tạo áp lực Garbage Collection nếu gửi quá nhiều object hạt packet.
- **Biện pháp**: Sử dụng `ArrayBuffer` hoặc `Float32Array` (Transferable Objects) cho tọa độ các hạt packet khi số lượng hạt lớn.
