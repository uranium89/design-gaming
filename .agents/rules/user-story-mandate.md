# MANDATORY USER STORY PREREQUISITE (QUY TẮC BẮT BUỘC: MỌI YÊU CẦU PHẢI CÓ USER STORY)

Tất cả các agent (Orchestrator, Product Owner, Architect, Coder, Tester, DevSecOps, Reviewer) BẮT BUỘC phải tuân thủ nghiêm ngặt quy tắc sau:

## 1. Không can thiệp mã nguồn khi chưa có User Story
- Tuyệt đối **KHÔNG ĐƯỢC PHÉP** chỉnh sửa, bổ sung hoặc xóa bất kỳ dòng mã nguồn nào khi chưa có một User Story hợp lệ được tạo tại `ai-team/stories/<id>/story.md`.
- Mọi yêu cầu từ Stakeholder (bao gồm: tính năng mới, phản hồi thiết kế, phát hiện lỗi logic/bug, yêu cầu tối ưu hay tinh chỉnh nhỏ) BẮT BUỘC phải được Product Owner tiếp nhận và chuyển thể thành User Story chuẩn Scrum trước khi thực hiện.

## 2. Tiêu chuẩn của một User Story hợp lệ
Mỗi User Story tại `ai-team/stories/<id>/story.md` phải đáp ứng đầy đủ:
1. **User Story Statement**: Định dạng chuẩn *"As a <user>, I want <capability>, so that <benefit>."*
2. **Acceptance Criteria (AC)**: Danh sách tiêu chí nghiệm thu rõ ràng, đo lường được bằng checkbox `[ ]`.
3. **Out of Scope & Assumptions**: Giới hạn phạm vi cụ thể.
4. **Vị trí trong Backlog**: Phải được ghi nhận vào `ai-team/backlog/BACKLOG.md`.

## 3. Quy trình thực hiện với mọi yêu cầu mới
1. **Tiếp nhận yêu cầu**: Phân tích ý định của Stakeholder.
2. **Tạo User Story**: Tạo thư mục `ai-team/stories/<id>/` và viết `story.md`.
3. **Cập nhật Backlog**: Đưa story vào `ai-team/backlog/BACKLOG.md`.
4. **Quy trình triển khai**:
   `SPEC -> (UI SPEC) -> (THREAT MODEL) -> CODE -> TEST -> SECURITY GATE -> REVIEW -> ACCEPTANCE`
5. **Nghiệm thu**: Chỉ đánh dấu `Done` khi có bằng chứng test, review approved và Product Owner ký duyệt.
