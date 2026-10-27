# Design Gaming ⚡
### Interactive System Design Simulator & Architecture Puzzle Game

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)](https://vite.dev/)
[![Tests](https://img.shields.io/badge/Tests-113%20Passing-10b981.svg)](tests/)
[![Security](https://img.shields.io/badge/Security-0%20Vulnerabilities-10b981.svg)](ai-team/RISKS.md)

**Design Gaming** là trò chơi giải đố kết hợp mô phỏng (Puzzle/Simulation) trực quan trên nền tảng Web, biến những bài toán phỏng vấn System Design và kiến trúc phần mềm phân tán trừu tượng thành trải nghiệm tương tác trực quan, sống động (phong cách *Mini Metro* / *Factorio* dành cho Kỹ sư Hệ thống).

Người chơi kéo-thả các linh kiện đám mây (Load Balancer, App Server, Cache, Message Queue, Database, Worker Pool...), kết nối đường truyền mạng và chứng kiến dòng lưu lượng thực tế (dưới dạng các hạt packet thời gian thực) chuyển động qua hệ thống, kiểm thử độ trễ, khả năng chịu lỗi và tối ưu chi phí vận hành.

---

## 🌟 Tính Năng Nổi Bật (Key Features)

### 1. 🎮 Chiến Dịch 6 Màn Chơi Theo Tiến Trình (Campaign Mode)
Chuỗi màn chơi mở khóa tuần tự tăng dần từ cơ bản đến đỉnh cao kiến trúc phân tán:
- **Level 1: The Bakery (Tiệm Bánh Ngọt)**: Dựng kiến trúc Monolith VM & PostgreSQL nhỏ gọn, tối ưu chi phí dưới $35/tháng cho 50 RPS.
- **Level 2: Tech News Aggregator (Trang Tin Công Nghệ)**: Bài toán 500 RPS đọc nhiều (Read-heavy 95%). Phối hợp Load Balancer và Redis Cache để giảm tải cho Database.
- **Level 3: Flash Deals Fashion (Săn Sale Thời Trang)**: 3,000 RPS giờ vàng. Thiết kế cụm Load Balancer phân tải Least-Connections, tự động xử lý sự cố máy chủ sập (Failover Event).
- **Level 4: Global TinyURL (Rút Gọn Link Toàn Cầu)**: 5,000 RPS. Phân tách Đọc/Ghi (Read/Write Splitting) với Database Read Replicas và xử lý hiện tượng Hot Key / Cache Stampede.
- **Level 5: Concert Ticket Rush (Săn Vé Concert Black Friday)**: Cơn bão 15,000 fan cuồng đồng loạt đặt vé (90% Write). Ứng dụng Message Queue (RabbitMQ) và Worker Pool san phẳng đỉnh nhọn lưu lượng, bảo đảm Zero Data Loss trong ngân sách $400/tháng.
- **Level 6: Global Chat App (Phòng Chat Toàn Cầu - Tier 3)**: 50,000 kết nối WebSocket đồng thời (CCU) và 10,000 tin nhắn/giây. Ứng dụng cụm WebSocket Gateway kết hợp **Redis Pub/Sub** làm message broker trung tâm đồng bộ tin nhắn đa cụm server trong ngân sách $500/tháng.

### 2. ☁️ 4 Đế Chế Đám Mây & Chế Độ Sandbox (Cloud Empires & Sandbox)
- Tùy chọn 4 danh mục linh kiện mang nhận diện thương hiệu và bảng giá đặc trưng:
  - **Freestyle (Open-Source)**: Linh kiện mã nguồn mở, chi phí phần cứng rẻ nhất (hệ số 1.0x).
  - **Amazon Web Services (AWS)**: Hệ sinh thái phong phú (ALB, EC2, ElastiCache, SQS, RDS).
  - **Microsoft Azure**: Tối ưu doanh nghiệp (App Gateway, VM Scale Sets, Service Bus, Cosmos DB).
  - **Google Cloud (GCP)**: Tốc độ mạng cao, Cloud Run, Memorystore, Cloud Pub/Sub, Cloud SQL.
- **Chế độ Sandbox tự do**: Không giới hạn ngân sách và linh kiện, cho phép tùy chỉnh thông lượng từ 100 RPS đến 50,000 RPS và tỉ lệ ghi để tự do thử nghiệm các mô hình kiến trúc kỳ công nhất.

### 3. ⚡ Bộ Mô Phỏng Dòng Tải Thời Gian Thực (Web Worker Simulation Core)
- Mô hình hàng đợi toán học **M/M/c/K** kết hợp mô phỏng sự kiện rời rạc (Discrete Event Simulation - DES) chạy độc lập trên Web Worker, không gây giật lag giao diện (giữ 60 FPS mượt mà).
- Trực quan hóa dòng hạt Packet Flow:
  - 🟢 **Hạt Xanh lá**: Request thành công (200 OK).
  - 🟡 **Hạt Vàng**: Request có độ trễ cao vượt SLA.
  - 🔴 **Hạt Đỏ**: Request thất bại (5xx/4xx) hoặc bị Drop do tràn hàng đợi.
  - 🟣 **Hạt Tím**: Dòng lưu lượng nội bộ bất đồng bộ (Message Queue / DB Replication).

### 4. 🔊 Âm Thanh Tương Tác Xúc Giác (Web Audio Synth)
- Bộ tổng hợp âm thanh bằng **Web Audio API thuần** (0KB asset tải ngoài, 0 latency, $0 server cost).
- Cung cấp phản hồi âm thanh cho các hành động quan trọng: nối dây cáp mạng (cable snap), khởi động phát tải (hum glide), cảnh báo quá tải khẩn cấp (overload buzz) và hợp âm ăn mừng chiến thắng đạt sao (victory fanfare).
- Nút Mute/Unmute tiện lợi trên TopBar, lưu trạng thái vào `localStorage`.

### 5. 🔗 Xuất, Nhập & Chia Sẻ Bản Vẽ Kiến Trúc (Blueprint Sharing)
- **Sao chép liên kết chia sẻ**: Nén toàn bộ cấu trúc bản vẽ (nodes, edges, đám mây, cấu hình) vào URL Hash (`#blueprint=...`), cho phép chia sẻ thiết kế ngay qua web link ($0 chi phí máy chủ).
- **Xuất / Nhập JSON**: Tải file `.json` bản vẽ về máy tính hoặc nạp file lên Canvas.
- **Giao diện Xem trước & Cảnh báo ghi đè (Blueprint Preview Card)**: Hiển thị tóm tắt linh kiện, số node, chi phí dự toán $/tháng và cảnh báo an toàn trước khi thay thế bản vẽ trên Canvas.

---

## 🚀 Khởi Chạy Dự Án (Quick Start)

### Yêu Cầu Môi Trường
- **Node.js**: Phiên bản 18.0 trở lên.
- **npm** (hoặc `pnpm` / `yarn`).

### Cài Đặt & Chạy Môi Trường Phát Triển
```bash
# 1. Clone repository
git clone https://github.com/uranium89/design-gaming.git
cd design-gaming

# 2. Cài đặt dependencies
npm install

# 3. Khởi chạy dev server
npm run dev
```
Mở trình duyệt tại: `http://localhost:5173/` để bắt đầu trải nghiệm!

### Chạy Kiểm Thử Tự Động (Tests)
```bash
# Chạy toàn bộ 20 test suites (113 tests) qua Vitest
npm test

# Hoặc chạy kiểm thử một lần (single run)
npm test -- --run
```

### Đóng Gói Ứng Dụng (Production Build)
```bash
npm run build
```
Bản build tối ưu hóa sẽ được xuất ra thư mục `build/` (biên dịch siêu tốc trong ~200ms).

---

## 🏗️ Kiến Trúc Kỹ Thuật (Tech Stack)

| Thành Phần | Công Nghệ Lựa Chọn | Vai Trò |
|---|---|---|
| **Core Framework** | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | Nền tảng UI type-safe, cấu trúc component hiện đại |
| **Build Tool** | [Vite 6](https://vite.dev/) | Bundler siêu tốc, HMR tức thì |
| **Node Graph Canvas** | [@xyflow/react](https://reactflow.dev/) (React Flow) | Khung canvas kéo thả node, render edge và custom nodes |
| **Simulation Engine** | TypeScript in Dedicated Web Worker | Tính toán tải M/M/c/K discrete-event đa luồng |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) | Quản lý trạng thái canvas, level và bộ đếm metrics |
| **Audio Synthesizer** | Web Audio API | Tổng hợp sóng âm thanh tương tác thời gian thực |
| **Styling** | Vanilla CSS Modules | Bảng màu Cyberpunk / Cloud Console Dark Theme |
| **Icons** | [Lucide React](https://lucide.dev/) | Bộ biểu tượng giao diện hiện đại |
| **Testing** | [Vitest](https://vitest.dev/) + [@testing-library/react](https://testing-library.com/) | Kiểm thử tự động unit & integration tests |

---

## 📂 Cấu Trúc Mã Nguồn (Directory Structure)

```
design-gaming/
├── src/
│   ├── components/            # UI components (TopBar, SidebarDock, CanvasArea, Modals)
│   │   ├── TopBar/            # Thanh điều hướng, chọn màn, audio toggle, metrics
│   │   ├── SidebarDock/       # Hộp công cụ linh kiện 4 đế chế đám mây
│   │   ├── CanvasArea/        # Bảng vẽ React Flow và render hạt packet flow
│   │   ├── BlueprintModal/    # Modal xuất/nhập/chia sẻ bản vẽ & thẻ Preview Card
│   │   ├── BriefingModal/     # Hộp thoại đề bài và ràng buộc mục tiêu
│   │   └── ScoreModal/        # Hộp thoại chấm điểm kiến trúc và nhận sao
│   ├── levels/                # Định nghĩa 6 màn chơi chiến dịch & Sandbox Mode
│   │   ├── level01.ts ... level06.ts
│   │   └── sandbox.ts
│   ├── services/              # Các dịch vụ độc lập
│   │   ├── audioService.ts    # Web Audio Synthesizer (0KB audio files)
│   │   ├── blueprintService.ts# Encode/decode URL hash, JSON export/import, preview summary
│   │   └── progressStorage.ts # Quản lý tiến trình, sao, và mở khóa tuần tự
│   ├── simulation/            # Bộ mô phỏng dòng tải Web Worker và công thức tính điểm
│   ├── state/                 # Zustand stores (graphStore)
│   ├── types/                 # TypeScript interfaces và Cloud Provider types
│   └── styles/                # Design tokens, biến CSS Dark Console
├── tests/
│   └── unit/                  # 20 test suites bao phủ toàn diện 113 bài test
├── ai-team/                   # Tài liệu quản trị dự án AI Scrum Team
│   ├── backlog/               # Product Backlog (S-001 đến S-024)
│   ├── stories/               # Tài liệu User Story, Spec, Threat Model, Review
│   ├── sprints/               # Kế hoạch và đánh giá Sprint (Sprint 01 đến 09)
│   └── ARCHITECTURE.md        # Kiến trúc tổng thể và ranh giới bảo mật
└── package.json
```

---

## 🤖 Phương Pháp Phát Triển: AI Scrum Team

Dự án này được xây dựng và duy trì theo phương thức **AI Scrum Team** có kỷ luật cao (theo [AGENTS.md](AGENTS.md)):
- Mỗi tính năng, sửa lỗi hoặc cải tiến đều bắt buộc bắt đầu bằng một **User Story** chính thức có tiêu chí chấp thuận (Acceptance Criteria) rõ ràng trong `ai-team/stories/`.
- Đi qua đầy đủ pipeline chất lượng: `SPEC` $\rightarrow$ `UI SPEC` $\rightarrow$ `THREAT MODEL` $\rightarrow$ `CODE` $\rightarrow$ `TEST` $\rightarrow$ `VISUAL CHECK` $\rightarrow$ `SECURITY GATE` $\rightarrow$ `REVIEW` $\rightarrow$ `ACCEPTANCE`.
- Tất cả commit đều có bằng chứng kiểm thử tự động, quét lỗ hổng bảo mật (`npm audit`, `gitleaks`, `semgrep`) và được phê duyệt bởi Reviewer.

---

## 📄 Bản Quyền (License)

Dự án được phân phối dưới giấy phép [MIT License](LICENSE).
Tự do đóng góp, mở rộng thêm các màn chơi mới và chia sẻ bản vẽ kiến trúc cùng cộng đồng!
