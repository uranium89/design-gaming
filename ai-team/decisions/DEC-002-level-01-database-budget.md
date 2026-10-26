# DEC-002: Giải quyết bài toán Database và Ngân sách Màn 1 (Level 01)

Status: DECIDED: A
Decided Option: A - Bổ sung Micro DB / SQLite ($10/tháng)

Why this needs you: Đề bài Màn 1 yêu cầu nhận đơn đặt bánh (Write dữ liệu), nhưng nếu người chơi thêm node PostgreSQL ($40/tháng) thì tổng chi phí ($60) sẽ vượt ngân sách tối đa $35/tháng, gây cảm giác vô lý về mặt thiết kế hệ thống.

| Option | Chi phí Màn 1 | Ảnh hưởng trải nghiệm game | Rủi ro nếu chọn sai | Khó sửa sau này? |
|---|---|---|---|---|
| **A (Khuyến nghị): Bổ sung Micro DB / SQLite ($10/tháng)** | $30/tháng (App $20 + DB $10 <= $35) | Rất tốt: Người chơi được kéo-thả dây nối vào Database riêng biệt, đúng tinh thần học System Design với chi phí tiết kiệm. | Hầu như không có; component này tái sử dụng tốt cho các màn sau. | Rất dễ thay đổi |
| **B: Nâng ngân sách trần Màn 1 lên $65/tháng** | $60/tháng (App $20 + Postgres $40 <= $65) | Tốt: Dùng luôn PostgreSQL chuẩn, nhưng mất đi tính thử thách "thắt lưng buộc bụng" của một tiệm bánh nhỏ. | Màn 1 trở nên hơi dễ, không làm nổi bật giải pháp tiết kiệm chi phí. | Rất dễ thay đổi |
| **C: Đổi tên thành "Monolith (App + SQLite nhúng)" ($20/tháng)** | $20/tháng (Chỉ 1 node) | Trung bình: Khớp lý thuyết Monolith thực tế, nhưng màn đầu tiên người chơi chỉ kéo đúng 1 node server đơn lẻ. | Người chơi ít được trải nghiệm thao tác nối dây nhiều tầng ở màn mở đầu. | Rất dễ thay đổi |

Recommendation: **Chọn Phương án A** vì vừa giải quyết triệt để tính hợp lý của việc lưu đơn hàng đặt bánh, vừa giữ được sự thú vị của thao tác kéo-thả nhiều tầng (Client $\rightarrow$ App $\rightarrow$ DB), vừa dạy đúng bài học System Design: *"Tải nhỏ thì dùng DB cấu hình nhỏ để không bị lãng phí ngân sách"*.

Reply with: A, B, hoặc C
