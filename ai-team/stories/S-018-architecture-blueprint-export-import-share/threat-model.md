# Threat Model: S-018 Xuất, Nhập & Chia Sẻ Bản Vẽ Kiến Trúc (Architecture Blueprint Export, Import & Shareable Link)

## Asset & Trust Boundaries
- **Assets**: DOM security, React Flow canvas state, Web Worker simulation integrity.
- **Trust Boundaries**:
  - Untrusted external input from URL Hash (`#blueprint=...`).
  - Untrusted external input from uploaded `.json` files.

## Threats & Mitigations (STRIDE)
1. **Tampering / Stored & Reflected XSS**:
   - *Threat*: Malicious blueprint contains `<script>alert(1)</script>` or `javascript:` URLs in node labels or properties, triggering script execution when loaded or shared.
   - *Mitigation*:
     - React JSX automatically escapes string interpolations.
     - In `blueprintService.ts`, all string fields are sanitized to remove `<script>` and HTML markup.
     - Custom node components only render sanitized string primitives.
2. **Prototype Pollution**:
   - *Threat*: Specially crafted JSON containing `__proto__` or `constructor.prototype` attempts to overwrite JavaScript prototype objects.
   - *Mitigation*: JSON parsing uses explicit key filtering / reconstruction of clean objects without copying prototype keys.
3. **Denial of Service via Payload Bombs**:
   - *Threat*: An attacker uploads a 50MB JSON file or crafts a URL with 10,000 nodes to freeze the UI thread and crash the simulation worker.
   - *Mitigation*:
     - Strict size limit: JSON strings exceeding 250KB are immediately rejected.
     - Node count limit: maximum 50 nodes and 100 edges per blueprint.
     - Coordinates and numerical values are clamped to finite safe ranges (`isFinite`, NaN check).

## Security Acceptance Criteria
- [ ] Uploading or loading a JSON file with `__proto__` does not pollute the `Object.prototype`.
- [ ] Payloads with script tags or invalid structure fail gracefully with human-readable error messages without crashing the application.
- [ ] Excessive payloads (> 50 nodes or > 250KB) are safely rejected.
