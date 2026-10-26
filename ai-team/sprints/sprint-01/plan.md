# Sprint 01 Plan: Engine Prototype & Foundation

- **Sprint Goal**: Xây dựng nền tảng ứng dụng web hoàn chỉnh gồm theme giao diện theo phong cách đã chọn, canvas kéo-thả node kiến trúc với React Flow, và bộ mô phỏng Web Worker cơ bản.
- **Trạng thái**: Chờ Stakeholder phê duyệt (Reply "approved")

## Danh sách User Stories trong Sprint

| Thứ tự | Mã Story | Tiêu đề | Trạng thái | Điểm cốt lõi |
|---|---|---|---|---|
| 1 | S-001 | [Design Foundation](../stories/S-001-design-foundation/story.md) | Ready | Layout tổng thể, Header metrics, Sidebar Dock, Canvas Grid, Theme tokens |
| 2 | S-002 | [Node Graph Canvas](../stories/S-002-node-graph-canvas/story.md) | Draft | Kéo-thả linh kiện (LB, App, DB), nối dây mạng, Inspector xem thuộc tính |
| 3 | S-003 | [Simulation Engine Core](../stories/S-003-simulation-engine-core/story.md) | Draft | Web Worker DES engine, tính toán hàng đợi M/M/c/K, đo RPS & Latency |

## Những gì Stakeholder có thể trải nghiệm sau Sprint 01
1. Mở ứng dụng web trên trình duyệt với giao diện dark theme sắc nét.
2. Kéo các linh kiện hạ tầng (User Traffic, Load Balancer, App Server, Database) ra Canvas và nối dây giữa chúng.
3. Bấm nút "Run" để kích hoạt mô phỏng: nhìn thấy các con số RPS, Latency và Chi phí $/tháng nhảy theo thời gian thực dựa trên kiến trúc đã lắp đặt.
