# Technical Specification - S-022: Blueprint Preview Modal & Overwrite Safety

Status: Ready
Risk Level: 🟢 Low (Confined to `BlueprintModal.tsx`, `blueprintService.ts`, and modal styling)

## 1. Overview
Nâng cấp trải nghiệm trong `BlueprintModal`: Thay vì lập tức ghi đè Canvas khi người chơi chọn file JSON, hệ thống sẽ mở màn hình Xem Trước (Blueprint Preview Card) hiển thị chi tiết các thông số của bản vẽ, kèm tính toán chi phí và cảnh báo an toàn nếu Canvas đang có linh kiện chưa lưu.

## 2. Technical Architecture & Data Flow
### A. Helper `summarizeBlueprint` trong `src/services/blueprintService.ts`:
```ts
export interface BlueprintSummary {
  name: string;
  description?: string;
  levelId: string;
  empire: string;
  nodesCount: number;
  edgesCount: number;
  totalCost: number;
  componentBreakdown: { name: string; count: number }[];
}

export function summarizeBlueprint(blueprint: ArchitectureBlueprint): BlueprintSummary;
```

### B. State Management trong `BlueprintModal.tsx`:
- State mới: `pendingBlueprint: ArchitectureBlueprint | null`.
- Prop nhận vào: `currentNodesCount?: number` để xác định Canvas có đang chứa linh kiện hay không.
- Khi người chơi chọn file qua `input[type="file"]`:
  - Thực hiện parse và validate qua `parseBlueprintJson(text)`.
  - Nếu hợp lệ: gán `setPendingBlueprint(parsed.blueprint)`.
  - Hiển thị màn hình Preview Card thay cho form upload thông thường.
- Khi người chơi bấm "Xác nhận nạp bản vẽ":
  - Gọi `onImport(pendingBlueprint)`.
  - Đóng modal hoặc reset `pendingBlueprint`.
- Khi người chơi bấm "Hủy / Chọn file khác":
  - Reset `pendingBlueprint` về `null`.

### C. Visual Preview Card Design:
- Thẻ Preview viền cyan/border glow tinh tế.
- Huy hiệu Level (ví dụ: `Level 3: Flash Deals`) và Huy hiệu Đám Mây (`AWS` / `Freestyle` / `Azure` / `GCP`).
- 3 chỉ số tóm tắt:
  - Linh kiện (Nodes)
  - Kết nối (Edges)
  - Chi phí dự toán ($/tháng)
- Danh sách badge các loại linh kiện sử dụng (ví dụ: `App Server (x2)`, `Redis Cache (x1)`, `PostgreSQL (x1)`).
- Khung cảnh báo màu vàng/cam (`AlertTriangle` icon) nếu `currentNodesCount > 0`:
  *"Cảnh báo: Bản vẽ này sẽ thay thế ${currentNodesCount} linh kiện hiện tại trên Canvas."*

## 3. Test Strategy
- Unit test trong `tests/unit/blueprintSharing.test.tsx` hoặc `tests/unit/blueprintPreview.test.tsx`:
  - Test helper `summarizeBlueprint` tính toán chính xác tổng chi phí, số lượng node, danh mục linh kiện.
  - Test `BlueprintModal` hiển thị Preview Card khi chọn file JSON.
  - Test cảnh báo ghi đè khi `currentNodesCount > 0`.
  - Test xác nhận nạp gọi `onImport` với dữ liệu chính xác.
  - Test nút hủy bỏ xóa `pendingBlueprint`.
