# UI Specification: S-012

## Status: APPROVED

## Overview
Defines user interface presentation, briefing modal content, TopBar level switcher entry, and canvas layout for Level 4: Global TinyURL Service.

## 1. TopBar Level Switcher
- Option label: `Level 4: TinyURL - Dịch Vụ Rút Gọn Link Toàn Cầu`
- Badge: `Level 4: TinyURL`
- When selected:
  - Resets active simulation.
  - Loads Level 4 parameters ($350 budget, 50ms latency target, 99.9% SLA).
  - Automatically opens Briefing Modal.

## 2. Briefing Modal (`BriefingModal.tsx`)
- **Title**: `Dịch Vụ Rút Gọn Link Toàn Cầu (Global TinyURL Service)`
- **Badge**: `Level 4: TinyURL`
- **Context**: Explains 20:1 read-to-write ratio, redirect workload, and the danger of viral hot key links exhausting database connection pools.
- **Objectives Checklist**:
  - [ ] Duy trì SLA >= 99.9% khi gặp đợt bùng nổ 8,000 RPS và Hot Key 10,000 RPS.
  - [ ] Giữ độ trễ P95 < 50ms (Redirect nhanh chóng cho người dùng toàn cầu).
  - [ ] Tối ưu chi phí hạ tầng dưới ngân sách $350/tháng.

## 3. Visual Layout of Reference Architecture
- Canvas visual layout from left to right:
  1. `user-client-1` (x: 60, y: 180)
  2. `ref-lb-1` (x: 280, y: 180)
  3. `ref-server-1` (x: 520, y: 90) & `ref-server-2` (x: 520, y: 270)
  4. `ref-cache-1` (x: 780, y: 180)
  5. `ref-db-master` (x: 1040, y: 90), `ref-db-replica-1` (x: 1040, y: 210), `ref-db-replica-2` (x: 1040, y: 320)
- Distinct cyan accents on Read Replicas distinguishing them from Master DB.
- Dynamic particle streams showing write traffic concentrating into Master DB and read traffic dividing across Replicas.
