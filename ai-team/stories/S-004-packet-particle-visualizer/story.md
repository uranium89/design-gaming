# S-004: Trực quan hóa Hạt Lưu lượng Thời gian thực (Packet Particle Visualizer)

Status: Done

## User Story
As a player,  
I want to see visual packets streaming along the network wires between components,  
So that I can intuitively observe traffic flow, bottlenecks, and error drops.

## Acceptance Criteria
- [x] Render các hạt packet chuyển động mượt mà 60 FPS theo đường cong của các dây nối giữa các node.
- [x] Phân định màu sắc theo trạng thái:
  - Xanh lá: Gói tin thành công (200 OK).
  - Vàng cam: Gói tin xử lý chậm (> P95 SLA target).
  - Đỏ rực: Gói tin lỗi hoặc bị drop do quá tải hàng đợi.
- [x] Dây nối tự động đổi màu / phình to khi lưu lượng tiệm cận giới hạn băng thông.
- [x] Hiệu năng ổn định (không tụt FPS) khi có tối thiểu 2,000 hạt cùng xuất hiện trên màn hình.

## Out of Scope
- Âm thanh và hiệu ứng nổ server (thuộc giai đoạn Polish).

## Assumptions
- Sử dụng SVG animateMotion tối ưu hóa GPU.

## Acceptance
- **Accepted by**: Product Owner (Loop 1)
- **Evidence**:
  - Criterion 1: Met - [test-result.md](test-result.md#acceptance-criteria-verification), `src/components/ParticleEdge/ParticleEdge.tsx`
  - Criterion 2: Met - [test-result.md](test-result.md#acceptance-criteria-verification), `tests/unit/particleEdge.test.tsx:L57-L89`
  - Criterion 3: Met - [test-result.md](test-result.md#acceptance-criteria-verification), `src/components/ParticleEdge/ParticleEdge.module.css:L8-L20`
  - Criterion 4: Met - Hardware-accelerated SVG animateMotion, build 147ms, tests 16/16 pass
  - Security Gate: PASS - [security.md](security.md)
  - Reviewer Verdict: APPROVED - [review.md](review.md)

