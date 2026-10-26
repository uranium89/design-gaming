# GAME DESIGN DOCUMENT (GDD)
# TÊN DỰ ÁN: SYSARCHITECT: HIGH AVAILABILITY (SYSTEM DESIGN SIMULATION)

---

## 1. TỔNG QUAN GAME & VÒNG LẶP GAMEPLAY CHÍNH

### 1.1. High Concept
**SysArchitect** là một game giải đố kết hợp mô phỏng (Puzzle/Simulation) 2D trên nền tảng Web. Game biến những bài toán phỏng vấn System Design trừu tượng thành các bài toán kiến trúc sống động: người chơi kéo-thả các thành phần (Load Balancer, App Server, Cache, Database, Queue...), nối dây mạng và quan sát lưu lượng truy cập (dưới dạng các hạt packet thời gian thực) chạy qua hệ thống. Mục tiêu là phục vụ được tải thực tế, vượt qua các thảm họa bất ngờ, đạt SLA và tối ưu hóa chi phí vận hành.

### 1.2. Đối tượng mục tiêu (Target Audience)
- Lập trình viên Junior và Mid-level muốn nâng cao tư duy kiến trúc phân tán.
- Kỹ sư phần mềm đang ôn luyện phỏng vấn System Design vào các công ty công nghệ lớn.
- Sinh viên ngành CNTT muốn trực quan hóa các khái niệm sách vở (CAP theorem, Cache stampede, Read replicas lag, Single Point of Failure).

### 1.3. Trọng tâm giá trị giáo dục
- **Trực quan hóa**: Thay vì đọc lý thuyết, người chơi tận mắt thấy một server sập khi hàng đợi connection pool đầy, hoặc database quá tải do tỉ lệ cache miss cao.
- **Tư duy đánh đổi (Trade-off Mindset)**: Không có kiến trúc "hoàn hảo", chỉ có kiến trúc phù hợp với ràng buộc (Chi phí vs Độ sẵn sàng vs Độ trễ vs Độ phức tạp).
- **Phản xạ xử lý sự cố (Incident Response)**: Rèn luyện khả năng thiết kế hệ thống có khả năng tự phục hồi (resilient) trước thảm họa phần cứng và lưu lượng đột biến.

### 1.4. Vòng lặp Gameplay cốt lõi (Core Loop)

```
[1. Nhận Briefing] ---> [2. Thiết kế & Cấu hình] ---> [3. Chạy Mô phỏng Tải]
      ^                                                         |
      |                                                         v
[6. Mở khóa / Lên cấp] <-- [5. Chấm điểm & Rút bài học] <-- [4. Xử lý Incident]
```

1. **Briefing (Đề bài)**: Nhận bài toán kinh doanh, thông số tải (RPS, Read/Write, Data size) và các ràng buộc cam kết (Budget trần, Latency SLA, Uptime).
2. **Design & Build (Kéo - Thả - Cấu hình)**: Người chơi chọn phe (Freestyle, AWS, Azure, GCP), lấy các node từ dock ra canvas, nối dây HTTP/gRPC/Queue, cấu hình tham số (RAM, CPU, Cache TTL, Connection Pool, Sharding Key, Auto-scale rule).
3. **Simulation (Mô phỏng thời gian thực)**: Nhấn "Run". Lưu lượng bắt đầu đổ vào từ User Node. Các hạt request di chuyển qua các node. Màn hình hiển thị live metrics: RPS phục vụ, RPS lỗi, P95/P99 Latency, Chi phí/giờ đang tiêu hao.
4. **Chaos / Incident Phase**: Giữa quá trình chạy, các sự kiện bất ngờ ập đến (traffic spike x5, rớt 1 server, mạng chập chờn, hot key). Hệ thống người chơi phải đủ khả năng tự chịu lỗi hoặc người chơi phải tinh chỉnh tức thời nếu cấu hình dynamic.
5. **Evaluation & Debrief**: Kết thúc chu kỳ mô phỏng (ví dụ: mô phỏng 24h ảo trong 60s thật). Game tính điểm dựa trên 4 trụ cột, trao từ 1 đến 3 sao và đưa ra biểu đồ phân tích nút thắt cổ chai (Bottleneck Breakdown) cùng lời giải tối ưu.
6. **Progression**: Mở khóa linh kiện mới, cấp độ mới và các bài toán quy mô lớn hơn.

---

## 2. DANH SÁCH THÀNH PHẦN & THÔNG SỐ CÁC ĐẾ CHẾ (EMPIRES)

Mỗi thành phần sở hữu các thuộc tính nền tảng:
- **Base Cost**: Chi phí tính theo đơn vị thời gian ($/giờ).
- **Processing Capacity (RPS)**: Khả năng xử lý tối đa trước khi nghẽn.
- **Added Latency ($T_{proc}$)**: Độ trễ xử lý nội tại của node (chưa tính thời gian xếp hàng).
- **Queue Limit / Concurrency**: Số request tối đa có thể giữ trong hàng đợi trước khi drop (HTTP 503 / Timeout).
- **Failure Mode**: Hiện tượng xảy ra khi quá tải (OOM crash, Thread starvation, Cascading failure).

### 2.1. Bảng đối chiếu thành phần giữa 4 Đế chế

| Thành phần chung | Freestyle (Tự host / FOSS) | AWS Ecosystem | Azure Ecosystem | GCP Ecosystem |
| :--- | :--- | :--- | :--- | :--- |
| **Edge / DNS** | BIND9 / Cloudflare Free | Route 53 | Azure DNS / Front Door | Cloud DNS |
| **CDN** | Varnish / Caddy edge | CloudFront | Azure CDN | Cloud CDN |
| **Load Balancer (L7)** | Nginx / HAProxy | Application Load Balancer (ALB) | Azure App Gateway | Cloud HTTP(S) LB |
| **API Gateway** | Kong / Traefik | API Gateway | API Management (APIM) | Apigee / Cloud Endpoints |
| **App Compute (VM)** | Custom Linux Server (Debian) | EC2 Instance | Azure VM | Compute Engine (GCE) |
| **App Compute (Container)** | Docker Compose / k3s | ECS / EKS | AKS / Container Apps | Cloud Run / GKE |
| **Serverless Function** | OpenFaaS / Knative | AWS Lambda | Azure Functions | Cloud Run Functions |
| **In-Memory Cache** | Redis Cluster / Memcached | ElastiCache (Redis) | Azure Cache for Redis | Cloud Memorystore |
| **Relational DB (SQL)** | PostgreSQL / MySQL | Amazon RDS / Aurora | Azure Database for PG | Cloud SQL / AlloyDB |
| **NoSQL (Document/KV)** | MongoDB / ScyllaDB | DynamoDB / DocumentDB | Cosmos DB | Cloud Firestore / Bigtable |
| **Message Queue** | RabbitMQ / Redis Streams | Amazon SQS | Azure Service Bus | Cloud Pub/Sub |
| **Event Streaming** | Apache Kafka | Amazon Kinesis / MSK | Azure Event Hubs | Managed Kafka / Pub/Sub |
| **Object Storage** | MinIO Cluster | Amazon S3 | Azure Blob Storage | Cloud Storage (GCS) |
| **Search Engine** | Elasticsearch / Meilisearch | Amazon OpenSearch | Azure AI Search | Cloud Search / Vertex AI |

---

### 2.2. Bảng thông số chi tiết của các thành phần cốt lõi

*Quy ước đơn vị: Giá chuẩn hóa ($/tháng mô phỏng), RPS = Requests Per Second, Latency = ms.*

#### A. Cụm Edge, Routing & Compute

| Thành phần & Đế chế | Giá ($/tháng) | Capacity (RPS) | Latency nội tại | Hàng đợi (Queue) | Điểm yếu / Cơ chế sập |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Nginx Reverse Proxy** (Freestyle) | $15 | 8,000 | 2ms | 4,000 req | Sập khi cạn Worker Connections; cấu hình tay reload chậm. |
| **AWS ALB** (AWS) | $25 + usage | 15,000 | 4ms | Auto-scale | Khởi tạo scale out chậm (mất 2–3 phút nếu spike đột ngột). |
| **Azure App Gateway** (Azure) | $35 | 12,000 | 5ms | Auto-scale | Latency p99 dao động cao khi SSL termination tải nặng. |
| **GCP Cloud LB** (GCP) | $22 | 25,000 | 2ms | Cực lớn | Single Anycast IP, định tuyến tốt nhưng tốn phí Egress. |
| **Linux VM 2C/4GB** (Freestyle) | $20 | 500 | 25ms | 250 req | Dễ sập CPU/RAM nếu code rò rỉ bộ nhớ; không tự hồi phục. |
| **AWS EC2 (t4g.large)** (AWS) | $48 | 800 | 20ms | 400 req | Bị bóp hiệu năng nếu cạn CPU Credit (burstable limit). |
| **Azure VM (B2ms)** (Azure) | $45 | 750 | 22ms | 350 req | IOPS ổ cứng OS disk bị bóp nghẹt nếu ghi log quá nhiều. |
| **GCP Cloud Run** (GCP) | $0 + $0.00002/req | 3,000 | 15ms (+120ms cold) | 1,000 req | Cold start cao nếu đột ngột scale từ 0 lên 100 instance. |

#### B. Cụm Caching & Database

| Thành phần & Đế chế | Giá ($/tháng) | Capacity (RPS) | Latency nội tại | Cơ chế phân tán / Giới hạn | Điểm yếu chí tử |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Redis Standalone** (Freestyle) | $25 | 20,000 | 1ms | In-memory đơn luồng | SPOF (Single Point of Failure). OOM crash nếu đầy RAM không evict. |
| **AWS ElastiCache Cluster** (AWS) | $85 | 45,000 | 1.5ms | Multi-AZ tự failover | Failover mất 15–30s gây rớt kết nối tạm thời. |
| **PostgreSQL Master** (Freestyle) | $40 | 600 Write / 1,500 Read | 15ms | ACID full, max 100 conn | Cạn pool connection; Disk I/O bão hòa khi table scan lớn. |
| **PostgreSQL Read Replica** (Free) | $25 | 2,500 Read | 12ms | Asynchronous replica | **Replication Lag**: Dữ liệu đọc có thể bị trễ so với Master 50–500ms. |
| **Amazon Aurora PG** (AWS) | $120 | 2,000 W / 10,000 R | 8ms | Shared distributed storage | Rất đắt; phí I/O phát sinh không giới hạn nếu không cache. |
| **AWS DynamoDB** (AWS) | $30 (provisioned) | 10,000 (auto) | 4ms | Partition-key based NoSQL | **Hot Partition**: Key dồn 1 chỗ gây lỗi 429 Throttle lập tức. |
| **Azure Cosmos DB** (Azure) | $60 (400 RU/s base)| 8,000 | 3ms | Multi-model globally | Chi phí RU/s tăng phi mã nếu query thiếu partition key. |
| **GCP Cloud Spanner** (GCP) | $300 | 15,000 (Read+Write)| 6ms | Global distributed ACID | Giá sàn cực đắt, chỉ tối ưu cho các bài toán quy mô khổng lồ. |

#### C. Cụm Message Queue & Storage

| Thành phần & Đế chế | Giá ($/tháng) | Throughput | Latency | Buffer Limit | Điểm yếu |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RabbitMQ** (Freestyle) | $30 | 8,000 msg/s | 3ms | RAM/Disk bound | Hàng đợi phình to sẽ tràn RAM, làm tê liệt toàn bộ broker. |
| **AWS SQS (Standard)** (AWS) | $5 (usage base) | Gần như vô hạn | 25ms | Unbounded | At-least-once delivery (có thể trùng lặp tin); độ trễ cao hơn cache. |
| **Kafka Cluster 3-node** (Free) | $110 | 60,000 msg/s | 4ms | Disk bound | Vận hành cực khó; rebalance cluster làm đứng pipeline 1–5s. |
| **Cloudflare / CloudFront CDN** | $20 + Egress | 50,000 RPS | 8ms edge | Static cache | Không thể cache dynamic response nếu không cấu hình cache-key. |
| **MinIO / AWS S3** | $15 / 500GB | 2,000 RPS get | 35ms | Object storage | Latency cao, không dùng thay thế database query được. |

---

## 3. MÔ HÌNH MÔ PHỎNG TẢI & CÔNG THỨC CHẤM ĐIỂM

### 3.1. Mô hình mô phỏng dòng tải (Traffic Simulation Engine)
Game ứng dụng mô hình hàng đợi **M/M/c/K** cải biên kết hợp mô phỏng sự kiện rời rạc (Discrete Event Simulation - DES):
- Mỗi Request phát ra được gắn thẻ:
  - `ID`: Mã định danh.
  - `Type`: Read (Đọc) hoặc Write (Ghi).
  - `Payload Size`: Kích thước dữ liệu (KB/MB).
  - `Deadline (Timeout)`: Thời gian sống tối đa (mặc định 2,000ms; bài toán real-time 200ms).
- **Quy tắc trễ tích lũy**:
  $$\text{Latency}_{\text{request}} = \sum (\text{Wire Latency} + \text{Queue Wait Time} + \text{Processing Time})$$
- **Hiện tượng bão hòa phi tuyến (Saturation Curve)**:
  Khi $\rho = \frac{\text{RPS Arrival}}{\text{RPS Capacity}} \ge 0.8$, hàng đợi bắt đầu phình to theo hàm số mũ:
  $$\text{Wait Time} = \frac{\text{Processing Time}}{1 - \rho}$$
  Nếu $\rho \ge 1.0$, hàng đợi đạt giới hạn $K$, các request tiếp theo bị **Drop** ngay lập tức (Lỗi 503 Service Unavailable hoặc 504 Gateway Timeout).

- **Cơ chế Cache Hit/Miss & DB Amplification**:
  - Khi request qua Cache:
    - Nếu Hit: Trả lời ngay với $T = 1\text{ms}$.
    - Nếu Miss: Forward xuống App Server $\rightarrow$ Database.
    $$\text{RPS}_{\text{DB}} = \text{RPS}_{\text{Write}} + (\text{RPS}_{\text{Read}} \times (1 - \text{Hit Rate}))$$
  - Hiệu ứng **Cache Stampede (Thundering Herd)**: Khi một cache key có lượng truy cập lớn hết hạn (TTL expire), hàng nghìn request cùng ập xuống Database trong một tick $\rightarrow$ Database sập dây chuyền (Cascading Failure).

---

### 3.2. Công thức tính điểm tổng hợp (Scoring Formula)

Điểm tổng được chuẩn hóa trên thang điểm **1,000 Điểm**:

$$\text{Total Score} = S_{\text{Throughput}} + S_{\text{Latency}} + S_{\text{Cost}} + S_{\text{Reliability}} - \text{Penalties}$$

#### Trọng số chi tiết:
1. **Điểm Tải Thành Công (Throughput Score - Tối đa 350đ)**:
   $$S_{\text{Throughput}} = 350 \times \left( \frac{\text{Total Requests Succeeded}}{\text{Total Requests Generated}} \right)$$

2. **Điểm Độ Trễ (Latency Score - Tối đa 250đ)**:
   Dựa trên P95 Latency so với mục tiêu đề bài ($L_{\text{target}}$):
   - Nếu $P95 \le L_{\text{target}}$: $S_{\text{Latency}} = 250$ điểm.
   - Nếu $L_{\text{target}} < P95 \le 2 \times L_{\text{target}}$:
     $$S_{\text{Latency}} = 250 \times \left(1 - \frac{P95 - L_{\text{target}}}{L_{\text{target}}}\right)$$
   - Nếu $P95 > 2 \times L_{\text{target}}$: 0 điểm.

3. **Điểm Hiệu Quả Chi Phí (Cost Efficiency Score - Tối đa 250đ)**:
   Dựa trên chi phí thực tế ($C_{\text{actual}}$) so với Ngân sách trần của màn ($C_{\text{budget}}$):
   - Nếu $C_{\text{actual}} \le 0.5 \times C_{\text{budget}}$: Tối đa 250 điểm.
   - Nếu $0.5 \times C_{\text{budget}} < C_{\text{actual}} \le C_{\text{budget}}$:
     $$S_{\text{Cost}} = 250 \times \left(1 - \frac{C_{\text{actual}} - 0.5 \times C_{\text{budget}}}{0.5 \times C_{\text{budget}}} \times 0.5\right)$$
   - Nếu $C_{\text{actual}} > C_{\text{budget}}$: Trừ điểm nặng theo tỷ lệ thâm hụt ngân sách.

4. **Điểm Sẵn Sàng & Vượt Thảm Họa (Reliability Score - Tối đa 150đ)**:
   $$S_{\text{Reliability}} = 150 \times \left(\frac{\text{Uptime seconds during incidents}}{\text{Total incident seconds}}\right)$$

5. **Hình Phạt (Penalties)**:
   - Data Loss (Ghi dữ liệu thất bại không có hàng đợi bù): Trừ 100đ/lần.
   - Vi phạm SLA Uptime (< 99.0%): Trừ 150đ.
   - Database Master Crash: Trừ 80đ.

#### Phân định Sao (Star Rating):
- **3 Sao (Kiến trúc Sư Xuất Sắc)**: Score $\ge 850$, Không vi phạm SLA, Chi phí $< 75\%$ Budget, Không có Data Loss.
- **2 Sao (Đạt Chuẩn Sản Xuất)**: $700 \le \text{Score} < 850$, Đáp ứng đủ tải đỉnh, Uptime $\ge 99.0\%$.
- **1 Sao (MVP Sống Sót)**: $500 \le \text{Score} < 700$, Hệ thống sống qua đợt test cơ bản, có thể rớt ở đợt spike nhưng không sập vĩnh viễn.
- **Thất Bại (0 Sao)**: Score $< 500$, hoặc hệ thống sập hoàn toàn (100% 5xx trong > 10s), hoặc vượt quá Budget trần $> 20\%$.

---

### 3.3. Ví dụ tính toán số liệu cụ thể

**Kịch bản bài toán**:
- Tổng request phát ra trong màn: 100,000 req.
- Đích SLA đề bài: $L_{\text{target}} = 100\text{ms}$, Ngân sách trần $C_{\text{budget}} = \$200$/tháng.

**Kết quả mô phỏng của người chơi**:
- Thành công: 98,500 req (Tỉ lệ 98.5%). Rớt 1,500 req do traffic spike.
- $P95 \text{ Latency} = 120\text{ms}$.
- Chi phí hệ thống đã lắp đặt: $C_{\text{actual}} = \$140$/tháng.
- Thời gian sống sót qua thảm họa sập node: 18s / 20s (90%).
- Không xảy ra Data Loss.

**Các bước tính điểm**:
1. $S_{\text{Throughput}} = 350 \times 0.985 = \mathbf{344.75}$
2. $S_{\text{Latency}} = 250 \times \left(1 - \frac{120 - 100}{100}\right) = 250 \times 0.8 = \mathbf{200.00}$
3. $S_{\text{Cost}}$: $140$ nằm giữa $\$100$ và $\$200$.
   $$S_{\text{Cost}} = 250 \times \left(1 - \frac{140 - 100}{100} \times 0.5\right) = 250 \times (1 - 0.2) = \mathbf{200.00}$$
4. $S_{\text{Reliability}} = 150 \times 0.90 = \mathbf{135.00}$
5. Penalty: Uptime $= 98.5\% < 99.0\% \rightarrow$ Trừ 50đ vi phạm nhẹ SLA.

$$\mathbf{\text{Total Score}} = 344.75 + 200.00 + 200.00 + 135.00 - 50 = \mathbf{829.75} \text{ điểm}$$
**Xếp hạng**: **2 SAO** (Rất sát ngưỡng 3 sao, cần tối ưu thêm cache để giảm P95 xuống $< 100\text{ms}$ và giữ 99% request lúc spike).

---

## 4. THIẾT KẾ CHI TIẾT 10 MÀN CHƠI (LEVELS 1 - 10)

Game gồm 5 bậc tiến trình (Tier 1 đến Tier 5), trải dài qua 10 màn chơi kinh điển.

---

### MÀN 1: THE LOCAL BAKERY (CƠ BẢN - MONOLITH ĐƠN LẺ)
- **Cấp độ**: Tier 1 (Khái niệm cơ bản).
- **Bối cảnh**: Website đặt bánh ngọt gia đình.
- **Thông số tải**:
  - DAU: 5,000 | Concurrent: 50.
  - RPS: Trung bình 20 RPS, Đỉnh 50 RPS.
  - Tỉ lệ: 80% Read (xem menu), 20% Write (đặt bánh).
  - Payload: Nhỏ (2KB/req).
- **Ràng buộc**:
  - Budget tối đa: $35/tháng.
  - Latency: P95 < 200ms.
  - SLA Uptime: 99.0%.
- **Sự kiện bất ngờ**: Tiệm bánh lên story Instagram, lượng truy cập nhảy đột ngột lên 120 RPS trong 15 giây.
- **Lời giải tham khảo**:
  - *Kiến trúc*: 1 Small VM (2 Core, 2GB RAM) chứa cả Web Server và Database SQLite/Postgres.
  - *Vượt spike*: Tăng connection queue lên 150 để hứng tạm thời gian ngắn thay vì drop ngay.
- **Bài học rút ra**: Một server đơn lẻ đủ rẻ cho tải nhỏ, nhưng là Single Point of Failure (SPOF). Khi spike, nếu không có queue đệm, server sẽ sập vì cạn CPU.

---

### MÀN 2: BREAKING TECH NEWS (TỐI ƯU READ VỚI CACHE & CDN)
- **Cấp độ**: Tier 1.
- **Bối cảnh**: Trang tin tức công nghệ vừa đăng tin độc quyền về chip bán dẫn.
- **Thông số tải**:
  - DAU: 200,000.
  - RPS: Trung bình 300 RPS, Đỉnh 2,500 RPS.
  - Tỉ lệ: 99% Read (đọc báo), 1% Write (bình luận).
  - Payload: HTML + Hình ảnh (trung bình 150KB/req).
- **Ràng buộc**:
  - Budget: $100/tháng.
  - Latency: P95 < 80ms.
  - SLA: 99.5%.
- **Sự kiện bất ngờ**: **Cache Stampede / Thundering Herd** — Cache trang chủ hết hạn vào đúng lúc cao điểm 2,500 RPS.
- **Lời giải tham khảo**:
  - *Kiến trúc*: Thêm CDN (CloudFront/Cloudflare) ở ngoài cùng để cache ảnh/bài viết tĩnh (Hit rate 90%). Phía sau là App Server và 1 Redis Cache đặt trước Database.
  - *Chống thundering herd*: Bật cờ "Mutex Lock" hoặc "Probabilistic Early Expiration" trên Redis node để chỉ 1 worker query DB làm ấm cache lại.
- **Bài học rút ra**: Với hệ thống Read-heavy (99% đọc), CDN và Cache là chìa khóa vàng để giảm 90%+ tải cho Database với chi phí cực thấp.

---

### MÀN 3: FLASH DEALS FASHION (LOAD BALANCING & STATELESS APP)
- **Cấp độ**: Tier 2 (Phân tán tầng ứng dụng).
- **Bối cảnh**: Ứng dụng bán quần áo mở đợt flash sale cuối tuần.
- **Thông số tải**:
  - RPS: Trung bình 500 RPS, Đỉnh 4,000 RPS.
  - Tỉ lệ: 70% Read, 30% Write (bỏ giỏ hàng, cập nhật thông tin).
  - Session data: 50KB/user session.
- **Ràng buộc**:
  - Budget: $250/tháng.
  - Latency: P95 < 120ms.
  - SLA: 99.9%.
- **Sự kiện bất ngờ**: Một App Server bị crash do rò rỉ bộ nhớ (Memory Leak event).
- **Lời giải tham khảo**:
  - *Kiến trúc*: 1 Layer 7 Load Balancer (Round Robin hoặc Least Connections) chia tải cho 4 App Servers (Stateless).
  - *Lưu Session*: Tách Session ra khỏi App Server, lưu tập trung vào Redis Session Store.
  - *Health Check*: Cấu hình Load Balancer phát hiện server sập trong 3s để ngừng điều hướng request đến node đó.
- **Bài học rút ra**: Muốn scale ngang (scale-out) compute, App Server bắt buộc phải **Stateless**. Tách trạng thái (state/session) ra bộ nhớ ngoài.

---

### MÀN 4: TINYURL SERVICE (DATABASE SCALING & SHARDING)
- **Cấp độ**: Tier 2.
- **Bối cảnh**: Dịch vụ rút gọn link toàn cầu (1 tỷ link lưu trữ).
- **Thông số tải**:
  - RPS: 8,000 Read (redirect), 400 Write (tạo link mới).
  - Dung lượng lưu trữ: Tăng 20GB/ngày.
  - Tỉ lệ: 20:1 Read/Write.
- **Ràng buộc**:
  - Budget: $350/tháng.
  - Latency redirect: P99 < 30ms.
  - Dung lượng: Lưu trữ lâu dài không được xóa.
- **Sự kiện bất ngờ**: **Hot Key** — Một link của ca sĩ nổi tiếng được click 10,000 lần/giây, tập trung toàn bộ request vào đúng 1 node dữ liệu.
- **Lời giải tham khảo**:
  - *Kiến trúc*: Đổi từ RDBMS sang NoSQL Key-Value (DynamoDB / Cassandra / ScyllaDB) hoặc RDBMS sharding theo hash của Short URL.
  - *Tối ưu Hot Key*: Bổ sung Local In-Memory Cache (L1 Cache) ngay trên từng App Server với TTL ngắn (10 giây) để chặn đứng traffic hot key trước khi tới DB cluster.
  - 1 Read Replica cụm riêng cho redirect.
- **Bài học rút ra**: Khi dữ liệu vượt ngưỡng 1 máy chủ, Sharding hoặc NoSQL KV là bắt buộc. Luôn cần L1 in-process cache để triệt tiêu bài toán Hot Key.

---

### MÀN 5: BLACK FRIDAY CONCERT TICKET (ASYNC QUEUEING & DECOUPLING)
- **Cấp độ**: Tier 3 (Kiến trúc bất đồng bộ & Event-driven).
- **Bối cảnh**: Mở bán 10,000 vé xem liveshow âm nhạc. 50,000 người ấn "Thanh toán" trong 1 giây đầu tiên.
- **Thông số tải**:
  - Write Spike: 50,000 RPS tức thời (tất cả đều là Write giao dịch nhạy cảm).
  - Tỉ lệ: 10% Read, 90% Write.
- **Ràng buộc**:
  - Tuyệt đối không được bán trùng vé (No Double Booking / Overselling).
  - Không được rớt đơn (Zero Data Loss).
  - Budget: $400/tháng.
- **Sự kiện bất ngờ**: Cổng thanh toán bên thứ ba (Payment Gateway) bị nghẽn, thời gian phản hồi tăng từ 200ms lên 5,000ms.
- **Lời giải tham khảo**:
  - *Kiến trúc*: App Server nhận đơn $\rightarrow$ Đẩy job vào **Message Queue (RabbitMQ / SQS FIFO)** $\rightarrow$ Trả về ngay cho user "Đơn của bạn đang được xử lý".
  - *Tầng Worker*: Một cụm Worker pool kéo từng message từ queue ra xử lý với tốc độ ổn định (Rate Limiting 500 req/s), giữ lock vé bằng Redis Distributed Lock (Redlock).
  - *Circuit Breaker*: Tự động ngắt kết nối sang cổng thanh toán khi latency > 3s, chuyển sang hàng đợi Retry với exponential backoff.
- **Bài học rút ra**: Dùng Message Queue để "san phẳng" đỉnh nhọn lưu lượng (Traffic Leveling / Buffering). Đổi synchronous processing sang asynchronous để bảo vệ downstream database.

---

### MÀN 6: GLOBAL CHAT APP (WEBSOCKETS & STATEFUL CONNECTION MESH)
- **Cấp độ**: Tier 3.
- **Bối cảnh**: Ứng dụng chat realtime như Discord / Telegram.
- **Thông số tải**:
  - 100,000 người dùng online đồng thời (CCU) giữ kết nối liên tục.
  - 15,000 tin nhắn/giây.
- **Ràng buộc**:
  - Latency truyền tin giữa 2 user: < 50ms.
  - Budget: $500/tháng.
  - Bộ nhớ connection: Tiết kiệm RAM máy chủ.
- **Sự kiện bất ngờ**: Đứt cáp mạng giữa cụm Server Chat 1 và Cụm Server Chat 2.
- **Lời giải tham khảo**:
  - *Kiến trúc*: Gateway duy trì persistent connection qua **WebSocket**.
  - *Cầu nối liên server*: Sử dụng **Redis Pub/Sub** hoặc **Apache Kafka** làm message bus trung tâm. Khi User A ở Server 1 gửi tin cho User B ở Server 2, Server 1 publish vào topic, Server 2 subscribe và push qua websocket tới User B.
  - Bổ sung Presence Service lưu trạng thái online/offline vào Redis với Heartbeat 30s.
- **Bài học rút ra**: Hệ thống stateful connection đòi hỏi message broker trung tâm để đồng bộ gói tin giữa các node phân tán.

---

### MÀN 7: VIDEO STREAMING & TRANSCODING (PIPELINE XỬ LÝ FILE LỚN)
- **Cấp độ**: Tier 4 (Lưu trữ và Pipeline dữ liệu lớn).
- **Bối cảnh**: Nền tảng chia sẻ video người dùng (YouTube mini).
- **Thông số tải**:
  - 500 video upload mỗi phút (dung lượng trung bình 200MB/file).
  - 50,000 người xem video đồng thời.
- **Ràng buộc**:
  - Không để file video chạy qua App Server (tránh nghẽn băng thông app).
  - Budget: $800/tháng.
  - SLA xem video không buffer: 99.8%.
- **Sự kiện bất ngờ**: Một video của streamer nổi tiếng vừa upload xong có 20,000 người bấm xem đồng thời ở độ phân giải gốc 4K khi chưa kịp transcode.
- **Lời giải tham khảo**:
  - *Upload*: App Server chỉ cấp **Presigned URL** $\rightarrow$ Client đẩy trực tiếp file lên **Object Storage (S3 / GCS)**.
  - *Transcode*: S3 Event trigger thông điệp vào Queue $\rightarrow$ Cụm Auto-scaling Worker kéo file về băm nhỏ thành các phân đoạn HLS (.m3u8, 720p, 1080p).
  - *Phân phối*: Đặt CDN chuyên dụng cho Video Streaming phía trước Object Storage để cache các video chunks.
- **Bài học rút ra**: Không bao giờ trung chuyển payload lớn qua Web/App Server. Tận dụng Event-driven architecture trên Object Storage và phân phối qua CDN.

---

### MÀN 8: SOCIAL FEED (FAN-OUT READ VS WRITE ARCHITECTURE)
- **Cấp độ**: Tier 4.
- **Bối cảnh**: Mạng xã hội phong cách Twitter/X.
- **Thông số tải**:
  - 1,000,000 DAU.
  - 500 post/giây, 25,000 feed read/giây.
  - Có các tài khoản "Celebrity" với hơn 5 triệu follower.
- **Ràng buộc**:
  - Thời gian hiển thị post mới lên feed người theo dõi: < 2 giây.
  - Budget: $900/tháng.
- **Sự kiện bất ngờ**: Người nổi tiếng đăng bài "Tôi vừa đính hôn!", 5 triệu follower cùng lúc refresh app để xem.
- **Lời giải tham khảo**:
  - *Kiến trúc Hybrid Fan-out*:
    - Người dùng thông thường (< 5,000 followers): **Fan-out on Write** (Đẩy bài viết vào bảng Timeline cache của từng follower).
    - Người nổi tiếng (Celebrity): **Fan-out on Read** (Không đẩy cho 5 triệu người vì sẽ nghẽn queue; khi follower load feed, hệ thống sẽ merge bài của celebrity vào timeline trong lúc đọc).
- **Bài học rút ra**: Thiết kế hệ thống phụ thuộc sâu vào phân bố dữ liệu (Data skew). Phải phối hợp nhịp nhàng giữa Push Model và Pull Model để tránh bùng nổ tài nguyên.

---

### MÀN 9: RIDE-HAILING DISPATCH (GEOSPATIAL & LOW-LATENCY MATCHING)
- **Cấp độ**: Tier 5 (Hệ thống phức tạp thời gian thực).
- **Bối cảnh**: Hệ sinh thái gọi xe công nghệ (Grab/Uber mini).
- **Thông số tải**:
  - 30,000 tài xế phát tọa độ GPS liên tục mỗi 3 giây (10,000 Write GPS/s).
  - 2,000 yêu cầu tìm xe xung quanh mỗi giây (Read Geospatial).
- **Ràng buộc**:
  - Bán kính tìm kiếm tài xế chuẩn xác: 3km.
  - Latency tìm xe: P99 < 50ms.
  - Budget: $1,200/tháng.
- **Sự kiện bất ngờ**: Mưa bão lớn tại một quận trung tâm, nhu cầu đặt xe tăng vọt gấp 10 lần tại duy nhất một tọa độ địa lý hẹp.
- **Lời giải tham khảo**:
  - *Kiến trúc*: Không dùng RDBMS thông thường để ghi GPS. Sử dụng **Redis với cấu trúc dữ liệu GeoHash (GEOADD, GEORADIUS)** hoặc Không gian dữ liệu dạng QuadTree / H3 Hexagon.
  - Định vị xe được cập nhật hoàn toàn trên bộ nhớ RAM. Chỉ khi cuốc xe hoàn tất mới ghi log xuống Database lâu dài.
- **Bài học rút ra**: Dữ liệu có vòng đời ngắn (Ephemeral Data) như vị trí GPS không nên đi thẳng vào ổ cứng. Tận dụng bộ nhớ in-memory kết hợp thuật toán phân vùng không gian (Spatial Indexing).

---

### MÀN 10: GLOBAL BANKING DISASTER RECOVERY (MULTI-REGION ACTIVE-ACTIVE)
- **Cấp độ**: Tier 5 (Đỉnh cao kiến trúc chịu lỗi).
- **Bối cảnh**: Hệ thống ngân hàng lõi phục vụ giao dịch tài chính toàn cầu.
- **Thông số tải**:
  - 20,000 giao dịch/giây phân bổ tại 2 khu vực: Bắc Mỹ (US-East) và Châu Âu (EU-West).
- **Ràng buộc**:
  - RPO = 0 (Recovery Point Objective: Tuyệt đối không mất mát 1 byte giao dịch nào).
  - RTO < 5s (Recovery Time Objective: Tự hồi phục dưới 5 giây khi có sự cố).
  - Budget: $3,000/tháng.
- **Sự kiện bất ngờ (Thảm họa kép)**:
  1. Toàn bộ Data Center khu vực US-East bị sét đánh sập hoàn toàn (AZ Disaster).
  2. Đồng thời xuất hiện cuộc tấn công DDoS 100,000 RPS vào cổng API Gateway EU.
- **Lời giải tham khảo**:
  - *Kiến trúc Multi-Region*:
    - Global Anycast DNS / Cloudflare Magic Transit chống DDoS ở vòng ngoài.
    - 2 Region chạy **Active-Active**. Database sử dụng phân tán toàn cầu hỗ trợ Consensus Raft/Paxos (Google Cloud Spanner hoặc CockroachDB / YugabyteDB).
    - Global Load Balancer tự động reroute 100% traffic từ US sang EU qua Health Check trong 3 giây.
    - Cụm Autoscaler tại EU tự động kích hoạt scale up x3 số lượng Node Compute để gánh tải dồn về.
- **Bài học rút ra**: Để đạt độ sẵn sàng cao nhất (99.999%), bắt buộc phải chấp nhận chi phí đắt đỏ cho Multi-Region, đồng bộ dữ liệu đa vùng và cơ chế đồng thuận phân tán (Distributed Consensus).

---

## 5. CÂN BẰNG GIỮA CÁC ĐẾ CHẾ (EMPIRE BALANCE)

Để tăng tính chiến thuật và giá trị chơi lại, 4 phe phái được thiết kế theo ma trận điểm mạnh/yếu rõ rệt:

```
[Freestyle]  <--->  Cực rẻ, Tự do tối đa       vs   Dễ sập, Tốn công cấu hình
[AWS]        <--->  Toàn diện, Tooling vô đối   vs   Phí truyền dữ liệu (Data Egress) đắt
[Azure]      <--->  Mạnh Enterprise & Hybrid    vs   RU/s Cosmos khó chỉnh, dễ bị Throttle
[GCP]        <--->  Mạng nhanh, Spanner bá đạo  vs   Chi phí base cao, ít dịch vụ ngách
```

### 5.1. Đặc trưng chi tiết từng phe

| Tiêu chí | Freestyle (Open-Source) | Amazon Web Services (AWS) | Microsoft Azure | Google Cloud (GCP) |
| :--- | :--- | :--- | :--- | :--- |
| **Hệ số chi phí phần cứng** | **1.0x (Rẻ nhất)** | 1.8x | 1.7x | 1.6x |
| **Phí phụ trội ngầm** | $0 Data transfer | Phí Cross-AZ & NAT Gateway rất cao | Phí Egress trung bình | Phí Premium Network Tier |
| **Tốc độ Auto-scale** | Thủ công / Rất chậm (3–5m)| Trung bình (1–2 phút) | Trung bình (2–3 phút) | **Rất nhanh (10–30 giây)** |
| **Khả năng chịu lỗi tự động** | Thấp (Cần setup tay) | Rất cao | Rất cao | Cực cao |
| **"Vũ khí tối thượng"** | Cấu hình Kernel Linux tùy biến (epoll, sysctl) | DynamoDB Single-digit latency, Lambda ecosystem | Cosmos DB Multi-master write toàn cầu | Cloud Spanner (Global ACID), BigQuery |
| **Nhược điểm cốt lõi** | **DevOps Penalty**: Không có kỹ năng cấu hình sẽ sập node ngẫu nhiên. | **Bill Shock**: Rất dễ vượt ngân sách nếu scale không kiểm soát. | **Throttle 429**: Nếu không tính đúng RU/s cho Cosmos DB sẽ bị bóp nghẽn. | **Cold start**: Giá khởi điểm của các cụm cluster tối thiểu khá chát. |

### 5.2. Cơ chế Buff/Debuff theo màn chơi
- Tại **Màn 1-4 (Tải nhỏ, tối ưu chi phí)**: Phe **Freestyle** có lợi thế tuyệt đối về điểm Cost Efficiency để dễ đạt 3 sao.
- Tại **Màn 5-7 (Hàng đợi & Serverless)**: Phe **AWS** vượt trội nhờ hệ sinh thái SQS + Lambda xử lý burst tải mượt mà.
- Tại **Màn 8-9 (Dữ liệu lớn, NoSQL)**: Phe **Azure** và **GCP** cân tài cân sức; Cosmos DB đa model hỗ trợ tốt đồ thị social, Memorystore của GCP tối ưu routing.
- Tại **Màn 10 (Multi-region)**: Phe **GCP** áp đảo nhờ đường truyền mạng backbone riêng và Cloud Spanner giải quyết bài toán chống chia cắt dữ liệu (Split-Brain) tốt nhất.

---

## 6. THIẾT KẾ UI/UX CHÍNH

### 6.1. Bố cục màn hình (Screen Layout - 3 Khối chính)

```
+---------------------------------------------------------------------------------------+
|  [SysArchitect] Level 4: TinyURL   |  Clock: 14:20 (x2)  |  RPS: 4,200  |  Cost: $180/m|
+---------------------------------------------------------------------------------------+
| TOOLBOX DOCK (Trái) |             CANVAS CHÍNH (Ở giữa - Node Graph)                   |
| [Search...]         |                                                                 |
| > Edge & Routing    |     [Client Group] ===== (HTTP) =====> [Load Balancer]          |
|   - DNS             |                                             ||                  |
|   - ALB             |                           +-----------------+-----------------+ |
| > Compute           |                           |                                   | |
|   - App Server      |                           v                                   v |
|   - Worker          |                   [App Server 1]                      [App Server 2]
| > Storage & Cache   |                           |                                   | |
|   - Redis Cache     |                           +-----------------+-----------------+ |
|   - Postgres DB     |                                             v                   |
| > Messaging         |                                     [Redis Cache Cluster]       |
|   - Message Queue   |                                             | (Cache Miss)      |
|                     |                                             v                   |
| [Stats Overview]    |                                     [Postgres Master]           |
| Budget: $250 max    |                                                                 |
| P95: 28ms (SLA 50)  |-----------------------------------------------------------------|
| Error: 0.02%        | INSPECTOR PANEL (Góc phải dưới: Cấu hình Node đang chọn)         |
| [RUN] [PAUSE] [x5]  | Node: Redis Cache 1 | Memory: 4GB | Eviction: AllKeys-LRU       |
+---------------------------------------------------------------------------------------+
```

### 6.2. Phản hồi thị giác trực quan (Visual Feedback & Animation)
1. **Dòng hạt Packet Flow**:
   - Hạt màu **Xanh lá**: Request thành công (200 OK).
   - Hạt màu **Vàng cam**: Request phản hồi chậm (> P95 SLA).
   - Hạt màu **Đỏ rực**: Request lỗi (4xx, 5xx) hoặc bị Drop do đầy hàng đợi.
   - Hạt màu **Tím**: Lưu lượng nội bộ bất đồng bộ (Async Queue / DB Replication stream).
2. **Trạng thái Node (Component Status Glow)**:
   - Viền xanh tĩnh: Node chạy bình thường, tải dưới 70%.
   - Nhấp nháy vàng kèm icon đồng hồ cát: Hàng đợi đang dâng cao (Warning Bottleneck).
   - Đỏ rực kèm khói/tia lửa: Node quá tải 100%, bắt đầu crash hoặc drop request.
3. **Heatmap đường truyền (Wire Congestion)**: Dây cáp mạng nối giữa các node sẽ tự động phình to ra và chuyển từ màu xám sang màu đỏ cam khi băng thông tiệm cận giới hạn.

### 6.3. Bảng điều khiển Inspector (Component Property Inspector)
Khi click vào bất kỳ thành phần nào trên Canvas:
- **Tab Cấu hình**: Chỉnh Instance size (vCPU, RAM), số lượng replica, thông số timeout (ms), thuật toán phân tải (Round Robin / IP Hash / Least Conn).
- **Tab Realtime Metric**: Biểu đồ mini hiển thị CPU Utilization, Memory usage, Network I/O và Queue Depth của riêng node đó.

---

## 7. KIẾN TRÚC KỸ THUẬT, TECH STACK MVP & LỘ TRÌNH TRIỂN KHAI

### 7.1. Kiến trúc kỹ thuật của Web App (100% Client-Side Simulation)

Để tối ưu chi phí vận hành (tiến tới **$0 chi phí máy chủ** ở giai đoạn MVP), toàn bộ logic mô phỏng dòng tải và chấm điểm sẽ chạy trực tiếp trên trình duyệt của người chơi:

```
[Main UI Thread: React + Svelte Flow Canvas]
       |  (PostMessage: Node Graph Config & Control Commands)
       v
[Dedicated Web Worker: Discrete Event Simulation (DES) Engine]
  - Tích hợp Queueing Model (M/M/c/K)
  - Tính toán lưu lượng theo chu kỳ Tick 50ms
  - Cập nhật Packet Positions, Node Loads, Error Counts
       |  (PostMessage: Compressed State Snapshot 20 FPS)
       v
[Canvas Render Layer: PixiJS Particle System]
  - Vẽ hàng nghìn hạt packet 60 FPS mượt mà bằng WebGL
```

### 7.2. Tech Stack đề xuất cho MVP

| Hạng mục | Công nghệ đề xuất | Lý do lựa chọn |
| :--- | :--- | :--- |
| **Frontend Framework** | **React (Next.js)** hoặc **Vite + React** | Hệ sinh thái thư viện phong phú, dễ tuyển dụng và bảo trì. |
| **Canvas Node Editor** | **React Flow (@xyflow/react)** | Thư viện kéo-thả node-graph mạnh mẽ nhất hiện nay, tùy biến node cực dễ. |
| **Particle & Flow Render** | **PixiJS** (hoặc Canvas API overlay) | Xử lý hàng nghìn hạt packet chuyển động 60fps qua WebGL mà không gây lag DOM. |
| **State Management** | **Zustand** | Siêu nhẹ, hiệu năng cao, cập nhật state từ Web Worker mượt mà. |
| **CSS & Design System** | **Vanilla CSS / CSS Modules** | Đảm bảo tính linh hoạt, theme tối (Dark Mode / Cyberpunk / Cloud Console). |
| **Simulation Core** | **TypeScript trong Web Worker** | Chạy độc lập, không block UI thread khi mô phỏng tải hàng chục nghìn RPS. |
| **Backend & Database (MVP)**| **Supabase (Free Tier)** | Lưu trữ User Account, Game Progress và Global Leaderboard. Chi phí $0. |

---

### 7.3. Lộ trình triển khai (Implementation Roadmap)

```
[Tháng 1: Prototype] ---> [Tháng 2: Core Gameplay] ---> [Tháng 3: Content & Polish] ---> [Tháng 4: Launch]
```

#### Giai đoạn 1: Prototype & Simulation Engine (Tuần 1 – Tuần 4)
- **Mục tiêu**: Xây dựng khung kéo-thả và kiểm chứng mô hình toán học dòng tải.
- **Deliverables**:
  - Tích hợp React Flow: Đặt được Node và nối dây cơ bản.
  - Xây dựng Web Worker mô phỏng: Tính toán được tải đơn giản qua 1 LB $\rightarrow$ 1 App Server $\rightarrow$ 1 DB.
  - Render hạt packet chuyển động theo đường cong Bezier của dây nối.
  - Chơi thử nghiệm được **Màn 1 & Màn 2**.

#### Giai đoạn 2: Game Mechanics & Scoring System (Tuần 5 – Tuần 8)
- **Mục tiêu**: Hoàn thiện toàn bộ hệ thống tính toán, bộ thông số các node và logic chấm điểm.
- **Deliverables**:
  - Bổ sung đủ các node: Cache, Read Replica, Queue, Worker, CDN.
  - Cơ chế Chaos / Incident ngẫu nhiên (sập node, traffic spike).
  - Hoàn thiện công thức tính điểm (P95 latency, Budget, SLA, trao 1-3 sao).
  - Triển khai **Màn 3, 4, 5**.

#### Giai đoạn 3: Hệ thống Đế chế & Nội dung nâng cao (Tuần 9 – Tuần 12)
- **Mục tiêu**: Đa dạng hóa lối chơi và mở rộng nội dung màn chơi.
- **Deliverables**:
  - Thiết lập thuộc tính riêng cho 4 phe: Freestyle, AWS, Azure, GCP.
  - Thiết kế hoàn thiện toàn bộ **Màn 6 đến Màn 10**.
  - Âm thanh: Hiệu ứng click, dây nối, tiếng server quá tải nhấp nháy, nhạc nền synthwave/lo-fi.
  - Lưu trữ tiến độ người chơi lên LocalStorage và Supabase.

#### Giai đoạn 4: Beta Testing, Leaderboard & Launch (Tuần 13 – Tuần 16)
- **Mục tiêu**: Cân bằng game (Game Balancing) và phát hành cộng đồng.
- **Deliverables**:
  - Mở tính năng Bảng xếp hạng (Global Leaderboard theo điểm số và chi phí thấp nhất).
  - Chế độ **Sandbox Mode**: Cho phép người chơi tự tạo bài toán và chia sẻ link kiến trúc cho bạn bè.
  - Đóng gói bản Web hoàn chỉnh, phát hành trên Product Hunt, Hacker News, Reddit (r/programming, r/systemdesign).

---
*Tài liệu Game Design Document này là kim chỉ nam duy nhất cho toàn bộ đội ngũ phát triển (Product Owner, Architect, Developers, UI Designer, Tester) trong suốt quá trình xây dựng SysArchitect.*
