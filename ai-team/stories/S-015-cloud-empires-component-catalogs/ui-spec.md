# UI Specification: S-015 Hệ Thống 4 Đế Chế Đám Mây & Kho Linh Kiện Nhà Cung Cấp

## Visual Theme & Layout
1. **SidebarDock Tabs**:
   - Placed at the top of SidebarDock:
     ```
     [ 🌐 Free ] [ 🟧 AWS ] [ 🟦 Azure ] [ 🟥 GCP ]
     ```
   - Segmented buttons with icons and provider brand colors:
     - Freestyle: `#10b981` (Emerald green).
     - AWS: `#ff9900` (AWS Amazon Orange).
     - Azure: `#0078d4` (Microsoft Blue).
     - GCP: `#4285f4` (Google Cloud Blue).
   - Smooth animated active tab transition with subtle bottom border highlight.

2. **Component Cards in Dock**:
   - Each component displays:
     - Provider miniature tag (e.g., `AWS`, `AZURE`, `GCP`, `FOSS`).
     - Component name and category icon.
     - Price tag badge (e.g. `$25/m`) and Capacity pill (e.g. `15k RPS`).
     - Tooltip with detailed description and failure modes.

3. **Canvas Node Card**:
   - Header badge displaying the provider name with distinctive brand color.
   - Status indicators (Healthy green, Warning yellow, Overloaded red, Crashed).

4. **Inspector Panel**:
   - Header indicates selected node's provider badge (e.g. `AWS ECOSYSTEM`, `AZURE ECOSYSTEM`, `GOOGLE CLOUD`, `OPEN SOURCE`).
   - Provider-tailored styling accentuating the dark console aesthetics.

## Responsive Design & Accessibility
- Tabs wrapped with accessible ARIA tablist/tab attributes.
- High contrast compliant typography on dark `#0d1117` background.
