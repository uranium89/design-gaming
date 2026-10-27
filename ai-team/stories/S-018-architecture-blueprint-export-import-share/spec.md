# Technical Specification: S-018 Xuất, Nhập & Chia Sẻ Bản Vẽ Kiến Trúc (Architecture Blueprint Export, Import & Shareable Link)

Status: Spec Complete  
Risk Level: 🟢 Low (Client-side JSON serialization, file download/upload, and Base64 URL hash decoding)

## 1. Architecture Overview
1. **Blueprint Service (`src/services/blueprintService.ts`)**:
   - Provides pure functions to serialize, validate, encode, and decode architecture blueprints.
   - **Data Schema (`ArchitectureBlueprint`)**:
     - `version`: number (`1`)
     - `timestamp`: string (ISO date)
     - `levelId`: string
     - `activeEmpire`: `'freestyle' | 'aws' | 'azure' | 'gcp'`
     - `nodes`: `CustomNodeType[]`
     - `edges`: `Edge[]`
   - **Validation & Sanitization**:
     - `parseAndValidateBlueprint(raw: string)`:
       - Validates JSON format.
       - Ensures `version === 1`, `nodes` is Array, `edges` is Array.
       - Sanitizes node IDs, labels, numbers (clamps NaN/Infinity, strips dangerous HTML tags).
       - Returns `{ success: true, blueprint }` or `{ success: false, error: string }`.
   - **URL Hash Sharing**:
     - `encodeBlueprintToHash(blueprint)`: serializes and encodes blueprint to URL-safe Base64.
     - `decodeBlueprintFromHash(hash)`: decodes `#blueprint=<base64>` and validates with `parseAndValidateBlueprint`.
   - **File Download & Upload**:
     - `downloadBlueprintFile(jsonContent, filename)`: creates an in-memory `Blob` and triggers automatic browser download.

2. **Blueprint Modal & TopBar UI (`src/components/BlueprintModal/BlueprintModal.tsx` & `TopBar.tsx`)**:
   - TopBar adds a "Bản vẽ" (Blueprint) button with `Share2` icon.
   - Clicking opens `BlueprintModal`:
     - **Xuất File JSON**: Download button to export current canvas architecture.
     - **Nhập File JSON**: File input (`.json`) with immediate validation and error feedback.
     - **Sao chép Liên kết Chia sẻ**: Generates shareable URL with `#blueprint=...`, copies to clipboard via `navigator.clipboard.writeText`, and shows a copy confirmation badge.
   - URL hash loader on mount in `App.tsx`:
     - Checks `window.location.hash` on load; if `#blueprint=...` is present, parses and imports nodes/edges directly into Canvas.

## 2. API Contract & Data Types
```ts
export interface ArchitectureBlueprint {
  version: 1;
  timestamp: string;
  levelId: string;
  activeEmpire?: 'freestyle' | 'aws' | 'azure' | 'gcp';
  nodes: CustomNodeType[];
  edges: Edge[];
}

export interface ValidationResult {
  success: boolean;
  blueprint?: ArchitectureBlueprint;
  error?: string;
}
```
