# Risk Register

Written for the stakeholder, in plain language. Updated by the product-owner and devsecops; summarized in every sprint review.

| ID | Level | Risk (what could happen to the business) | Source | What we're doing | Owner | Status |
|---|---|---|---|---|---|---|
| R-001 | 🟡 | Hiệu năng mô phỏng bị giật hạt packet trên máy cấu hình thấp nếu lượng request quá lớn | DevSecOps / Architect | Sử dụng Web Worker độc lập kết hợp Particle Pooling trên Canvas 2D | architect | Open |
| R-002 | 🟢 | Cân bằng độ khó giữa các màn: công thức tính điểm và thông số node chưa khớp thực tế | Product Owner | Viết unit tests kiểm thử các bài toán chuẩn trước khi phát hành màn | tester | Open |

Levels: 🟢 low, 🟡 medium, 🔴 high. Status: Open, Mitigated, Accepted (link the stakeholder's decision brief), Closed.
