# Sprint 05 Plan: Database Read Replicas, Read/Write Splitting & Level 04 (Global TinyURL)

- **Sprint Goal**: Cung cấp linh kiện Database Read Replica và cơ chế Phân tách Đọc/Ghi (Read/Write Splitting) tự động, đồng thời phát hành Màn 4 (Global TinyURL Service - 8,000 RPS, Hot Key 10,000 RPS, $350 budget) để người chơi làm chủ kỹ thuật mở rộng cơ sở dữ liệu quy mô lớn.
- **Trạng thái**: Draft (Chờ Stakeholder phê duyệt)

## Danh sách User Stories trong Sprint 05

| Thứ tự | Mã Story | Tiêu đề | Trạng thái | Ước lượng rủi ro | Điểm cốt lõi |
|---|---|---|---|---|---|
| 1 | S-011 | [Phân tách Đọc/Ghi & Linh kiện Database Read Replica](../stories/S-011-database-read-replicas-read-write-splitting/story.md) | Ready | 🟡 Med | Bổ sung linh kiện Read Replica ($25, 1,500 RPS). Engine tự động tách luồng: Write (ghi) vào Master DB, Read (đọc) vào các Read Replicas. |
| 2 | S-012 | [Màn 4: Rút Gọn Link Toàn Cầu & Xử lý Hot Key (Level 04: Global TinyURL)](../stories/S-012-level-04-global-tinyurl-hot-key/story.md) | Ready | 🟢 Low | Tải đỉnh 8,000 RPS (95% Read, 5% Write), ngân sách $350/tháng, P95 < 50ms, sự kiện Hot Key 10,000 RPS; kiến trúc Master + Replicas + Caching đạt 3★. |

## Những gì Stakeholder có thể trải nghiệm sau Sprint 05
1. **Kiến trúc Phân tách Đọc/Ghi (Read/Write Splitting)**:
   - Người chơi kéo `Database Read Replica` vào bảng vẽ, kết nối với App Server.
   - Quan sát luồng phân tách rõ rệt: Các yêu cầu ghi (Write) đi thẳng vào Master DB; hàng nghìn yêu cầu đọc redirect (Read) phân tán đều sang các Read Replicas, giảm 90% tải cho Master DB.
2. **Trải nghiệm Màn 4 hoàn chỉnh (Global TinyURL)**:
   - Thử thách dịch vụ rút gọn link toàn cầu với tải 8,000 RPS và sự cố bùng nổ **Hot Key** (1 link viral của ngôi sao nhận 10,000 lượt click/giây).
   - Thấy rõ sự sụp đổ nếu dồn hết traffic vào 1 Database duy nhất, và cách giải quyết bằng cụm Read Replicas kết hợp In-Memory Caching để ẵm trọn **3 Sao (★★★)**!
