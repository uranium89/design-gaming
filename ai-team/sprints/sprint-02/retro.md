# Sprint 02 Retrospective

- **Facilitator**: Reviewer
- **Date**: 2026-10-26

## 1. What Went Well (Những điểm làm tốt)
- **Kiến trúc Trực quan hóa Dòng hạt (S-004)**: Tận dụng trực tiếp Native SVG `animateMotion` tích hợp thẳng vào React Flow edge component giúp tái sử dụng hoàn toàn tọa độ Bezier curve của React Flow, không cần đồng bộ tọa độ phức tạp ra Canvas ngoài và tiết kiệm đáng kể CPU.
- **Hiện thực hóa Công thức Chấm điểm (S-005)**: Chuyển thể trực tiếp công thức toán 4 trụ cột và ví dụ kiểm chứng số liệu từ GDD Section 3.2 & 3.3 vào TypeScript pure function, cho phép kiểm thử tự động tức thì trong vòng 3ms.
- **Trải nghiệm Người chơi (Game Loop)**: Đã tạo nên vòng lặp khép kín: Briefing $\rightarrow$ Kéo thả thiết kế $\rightarrow$ Mô phỏng chạy tải có sự cố $\rightarrow$ Chấm điểm trao sao $\rightarrow$ Nạp kiến trúc mẫu để học hỏi.

## 2. What Could Be Improved (Những điểm cần cải thiện)
- **Tùy chỉnh thông số Node trực tiếp từ Inspector**: Người chơi hiện mới chỉ xem được thông số tĩnh trong Inspector Panel. Ở Sprint tiếp theo, nên cho phép người chơi tùy chỉnh instance size (ví dụ: đổi từ 1 VM $20 lên VM lớn hơn hoặc tăng số replica) trực tiếp từ Inspector.
- **Âm thanh và Phản hồi Giác quan**: Nên bổ sung âm thanh click nhẹ, âm thanh hạt request bay và hiệu ứng chuông reo nhận sao (⭐⭐⭐) để tăng tính kích thích cho người chơi.

## 3. Action Items cho Sprint tiếp theo (Sprint 03)
1. **S-006: Component Inspector tương tác cao**: Cho phép click vào Node để đổi tier (ví dụ: VM 2C/4GB sang 4C/8GB) và xem realtime metric chart.
2. **S-007: Màn 2 - URL Shortener (Cơ chế Caching & Database Sharding)**: Bổ sung Redis Cache và kịch bản Cache Hit/Miss bão hòa DB.
