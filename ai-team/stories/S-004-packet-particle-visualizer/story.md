# S-004: Trực quan hóa Hạt Lưu lượng Thời gian thực (Packet Particle Visualizer)

Status: Draft

## User Story
As a player,  
I want to see visual packets streaming along the network wires between components,  
So that I can intuitively observe traffic flow, bottlenecks, and error drops.

## Acceptance Criteria
- [ ] Render các hạt packet chuyển động mượt mà 60 FPS theo đường cong của các dây nối giữa các node.
- [ ] Phân định màu sắc theo trạng thái:
  - Xanh lá: Gói tin thành công (200 OK).
  - Vàng cam: Gói tin xử lý chậm (> P95 SLA target).
  - Đỏ rực: Gói tin lỗi hoặc bị drop do quá tải hàng đợi.
- [ ] Dây nối tự động đổi màu / phình to khi lưu lượng tiệm cận giới hạn băng thông.
- [ ] Hiệu năng ổn định (không tụt FPS) khi có tối thiểu 2,000 hạt cùng xuất hiện trên màn hình.

## Out of Scope
- Âm thanh và hiệu ứng nổ server (thuộc giai đoạn Polish).

## Assumptions
- Sử dụng Canvas 2D overlay tối ưu hóa với Particle Pooling.

## Acceptance
_Filled by the product-owner after testing and visual review._
