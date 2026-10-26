# Threat Model: S-015 Hệ Thống 4 Đế Chế Đám Mây & Kho Linh Kiện Nhà Cung Cấp

## Asset & Trust Boundaries
- **Assets**: Node component definitions, pricing accuracy, simulation classification integrity.
- **Threat Actors**: Cross-provider misconfigurations, unhandled provider key lookups leading to UI crash.

## Threats & Mitigations (STRIDE)
1. **Denial of Service / UI Crash via Invalid Provider Key**:
   - *Threat*: Selecting an undefined provider or dragging a node with undefined provider property causes runtime `TypeError`.
   - *Mitigation*: Fallback to `'freestyle'` provider default; exhaustive type checks with `CloudProvider` union type.
2. **Component Role Misclassification in Simulation Engine**:
   - *Threat*: A provider-specific component (e.g. `GCP Cloud Memorystore` or `AWS SQS`) is not recognized by regex patterns in `engineMath.ts`, causing traffic drops or routing errors.
   - *Mitigation*: Centralize provider pattern matching with exhaustive regex tests covering all 4 cloud ecosystems.

## Security Acceptance Criteria
- [x] Runtime does not throw on switching providers or dragging nodes from any of the 4 empires.
- [x] Node serialization in React Flow retains `provider` field securely.
