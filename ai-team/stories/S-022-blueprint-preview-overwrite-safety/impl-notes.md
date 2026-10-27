# Implementation Notes - S-022: Blueprint Preview Modal & Overwrite Safety

## Summary of Changes
1. **`src/services/blueprintService.ts`**:
   - Added `summarizeBlueprint(blueprint: ArchitectureBlueprint): BlueprintSummary` helper function:
     - Extracts total nodes, total edges, total estimated cost ($/mo), target level, active empire, and component count breakdown.
2. **`src/components/BlueprintModal/BlueprintModal.tsx`**:
   - Upgraded file import workflow:
     - When a JSON file is selected, it is parsed and validated into `pendingBlueprint`.
     - Displays the `BlueprintPreviewCard` displaying target level badge, empire badge, 3-metric grid (Nodes, Edges, Cost), and component chips.
     - If the active Canvas contains $\ge 1$ nodes, displays a prominent safety warning (`AlertTriangle`):
       *"Cảnh báo: Bản vẽ này sẽ thay thế ${nodes.length} linh kiện hiện tại trên Canvas của bạn."*
     - Provides two clear actions:
       - "Hủy / Chọn file khác": clears `pendingBlueprint` and restores file input.
       - "Xác nhận nạp bản vẽ": calls `onImportBlueprint(pendingBlueprint)` and notifies success.
3. **`src/components/BlueprintModal/BlueprintModal.module.css`**:
   - Added modern cyberpunk dark console styling for the preview card, badges, metrics grid, chips, warning banner, and actions.
4. **`tests/unit/blueprintSharing.test.tsx`**:
   - Added 3 unit tests for `summarizeBlueprint`, preview card rendering with overwrite warning, confirm import action, and cancel action.
