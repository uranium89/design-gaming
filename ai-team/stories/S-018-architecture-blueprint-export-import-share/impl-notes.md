# Implementation Notes: S-018 Xuất, Nhập & Chia Sẻ Bản Vẽ Kiến Trúc (Architecture Blueprint Export, Import & Shareable Link)

## Loop 1

### Changes Made
1. **`src/services/blueprintService.ts`**:
   - Implemented `exportBlueprintToJson(levelId, activeEmpire, nodes, edges)` to serialize canvas architecture to standard JSON (version 1).
   - Implemented `downloadBlueprintFile(jsonContent, filename)` creating an in-memory `Blob` and triggering browser file download.
   - Implemented `parseAndValidateBlueprint(raw)` featuring size limits (250KB), node limits (50 nodes, 100 edges), XSS tag stripping (`<script>`, HTML tags), and prototype pollution rejection.
   - Implemented `encodeBlueprintToHash(blueprint)` and `decodeBlueprintFromHash(hash)` to encode minified architectures into URL hash (`#blueprint=...`) for instant sharing.
2. **`src/components/BlueprintModal/BlueprintModal.tsx` & `.module.css`**:
   - Modal matching Dark Console aesthetic.
   - 3 interactive cards:
     - **Sao chép Liên kết Chia sẻ**: Quick copy input with animated "Đã chép! ✓" feedback.
     - **Xuất Bản vẽ (Export JSON)**: Direct download of `.json` blueprint file.
     - **Nhập Bản vẽ (Import JSON)**: File upload input with format validation and error/success alert banners.
3. **`src/components/TopBar/TopBar.tsx`**:
   - Added "Bản vẽ" button with `Share2` icon next to "Đề bài".
4. **`src/App.tsx`**:
   - Added `isBlueprintOpen` modal trigger.
   - Added `useEffect` on mount to automatically detect `#blueprint=...` URL hash, decode architecture, and load nodes/edges into Canvas.
5. **`tests/unit/blueprintSharing.test.tsx`**:
   - 11 unit tests covering serialization, validation, XSS prevention, prototype pollution resilience, URL hash roundtrip encoding/decoding, and UI interaction.

### How to Run
```bash
npm test -- tests/unit/blueprintSharing.test.tsx
npm run build
```
17 test suites pass (96 tests total), Vite production build passes.
