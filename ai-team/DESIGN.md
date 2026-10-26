# Design System

How the product looks and feels. The ui-designer owns this file and writes it at kickoff, after the stakeholder chooses a visual style. Every UI spec and every screen follows it. Products without a user interface leave it empty.

## Direction
- **Phong cách đã chọn**: [DEC-001 Option B: Modern Cloud Console (Enterprise Dark)](decisions/DEC-001-visual-direction.md)
- **Cảm hứng & Cảm xúc**: Mang lại cảm giác chuyên nghiệp, bóng bẩy và đáng tin cậy như đang vận hành hệ thống đám mây quy mô lớn trên AWS/Datadog/Stripe Console, nhưng vẫn có các tương tác nhanh nhẹn và thỏa mãn của một tựa game giải đố mô phỏng cao cấp.
- **Màn hình ưu tiên**: Desktop-first (1280px đến 1920px+), hỗ trợ co giãn tối thiểu ở 1024px.

## Design Tokens

### Colors
```css
:root {
  /* Nền và Bề mặt */
  --bg-app: #0b1120;
  --bg-surface: #1e293b;
  --bg-surface-raised: #334155;
  --bg-canvas: #0f172a;
  
  /* Đường viền */
  --border-subtle: #1e293b;
  --border-default: #334155;
  --border-focus: #6366f1;
  
  /* Điểm nhấn & Trạng thái */
  --color-primary: #6366f1;       /* Indigo 500 */
  --color-primary-hover: #4f46e5; /* Indigo 600 */
  --color-success: #10b981;       /* Emerald 500 - 200 OK, Healthy */
  --color-warning: #f59e0b;       /* Amber 500 - High queue, High latency */
  --color-danger: #ef4444;        /* Rose 500 - 5xx Error, Node crash */
  --color-info: #06b6d4;          /* Cyan 500 - Cache / Read flow */
  --color-stream: #8b5cf6;        /* Purple 500 - Async queue flow */

  /* Chữ và biểu tượng */
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --text-dim: #64748b;
  --text-inverse: #0f172a;
}
```

### Typography
- **Font gia đình chính (UI/Heading)**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Font số liệu kỹ thuật & Metrics**: `'JetBrains Mono', 'Fira Code', 'Roboto Mono', monospace`
- **Thang kích thước**:
  - `xs`: 11px (line-height: 14px) - Badges, sub-labels
  - `sm`: 13px (line-height: 18px) - Metric pills, tooltips
  - `base`: 14px (line-height: 20px) - Body text, dock items
  - `md`: 16px (line-height: 24px) - Node titles, card headers
  - `lg`: 18px (line-height: 26px) - Section headers, modal titles
  - `xl`: 22px (line-height: 28px) - Topbar level title

### Spacing & Radius
- **Spacing**: `4px (1)`, `8px (2)`, `12px (3)`, `16px (4)`, `20px (5)`, `24px (6)`, `32px (8)`
- **Radius**: `4px (sm)`, `6px (md)`, `8px (lg)`, `12px (xl)`, `9999px (full)`
- **Shadows**:
  - `shadow-sm`: `0 1px 2px 0 rgba(0, 0, 0, 0.25)`
  - `shadow-node`: `0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3)`
  - `shadow-active`: `0 0 0 2px var(--color-primary), 0 8px 16px -2px rgba(99, 102, 241, 0.3)`

## Component Library
- Dùng **React Flow (`@xyflow/react`)** cho Canvas đồ thị với custom theme.
- Xây dựng component hệ thống chuẩn hóa:
  - `Button`: Primary, Secondary, Danger, Ghost.
  - `Badge`: Success (200), Warning (Slow), Error (5xx), Neutral (Role).
  - `MetricPill`: Chứa icon + nhãn + giá trị nổi bật.
  - `NodeCard`: Khung linh kiện hạ tầng (header icon, status indicator, input/output port handles).
  - `InspectorPanel`: Ngăn kéo cấu hình linh kiện ở góc phải dưới.

## Layout Patterns
- **Header TopBar (Chiều cao 56px)**: Cố định trên cùng, nền `--bg-surface`, viền dưới `--border-default`. Chứa Title, Level Badge, Metric Pills (RPS, Latency, Cost), và Nút mô phỏng (Play/Pause/Speed).
- **Sidebar Dock (Độ rộng 260px)**: Cố định bên trái, danh mục linh kiện phân nhóm có thể cuộn.
- **Main Canvas Grid**: Lưới điểm chấm hoặc kẻ ô mờ 20px x 20px, chiếm toàn bộ không gian còn lại.
- **Bottom-Right Inspector (Độ rộng 320px)**: Nổi trên canvas khi click vào node để chỉnh thông số.

## Visual Check Commands
- Start the app: `npm run dev`
- Screenshot: `npm run screenshot` (hoặc chụp qua browser subagent)
- Accessibility: `npm run lint` & kiểm tra contrast chuẩn WCAG AA
