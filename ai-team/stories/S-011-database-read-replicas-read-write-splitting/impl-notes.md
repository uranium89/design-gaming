# Implementation Notes: S-011

## Summary of Changes
Implemented Database Read Replica component and automatic Read/Write Splitting routing logic in the simulation engine.

### 1. Component Registry (`src/components/SidebarDock/SidebarDock.tsx`)
- Added `db-replica` to the Storage section:
  - **Type**: `database` / `db-replica`
  - **Label**: `Database Read Replica`
  - **Cost**: `$25/month`
  - **Capacity**: `1,500 RPS`
  - **Latency**: `10ms`
  - **Icon**: Database icon with cyan/sky blue accent badge
  - **Description**: "Bản sao CSDL chỉ đọc, đồng bộ bất đồng bộ từ Master, mở rộng khả năng đọc."

### 2. Simulation Math Engine (`src/simulation/engineMath.ts`)
- Added specialized routing for Compute -> Storage nodes based on level `writeRatio`:
  - Separates downstream targets into `masterDbTargets` and `replicaTargets` (matching ID/label containing `replica`).
  - **Write Traffic** (`rpsOut * writeRatio`): Dispatched 100% to Master DB.
  - **Read Traffic** (`rpsOut * (1 - writeRatio)`): Distributed equally across healthy `replicaTargets`.
  - **Fallback / Graceful Degradation**: If no healthy Read Replicas are connected or all have crashed, all Read traffic automatically falls back to Master DB.
  - **Edge Traffic Labels**: Dynamic edge traffic visualization reflecting exact read/write distribution.

### 3. Component Inspector (`src/components/Inspector/Inspector.tsx` & `Inspector.module.css`)
- Added dedicated `"Read-Only Replica"` badge in `#0ea5e9` cyan styling.
- Clearly displays `1,500 RPS` read-only capacity.

### 4. Automated Tests (`tests/unit/readWriteSplitting.test.tsx`)
- 4 unit tests covering component presence in palette, math routing with read/write splitting, replica crash fallback, and Inspector badge.
