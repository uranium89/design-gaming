# Implementation Notes: S-012

## Summary of Changes
Implemented Level 4: Global TinyURL Service (`LEVEL_04`), supporting read-heavy workloads (95% Read, 5% Write, 20:1 ratio), Database Read Replicas, Caching with Redis, and the viral "Hot Key" traffic surge.

### 1. Level Definition (`src/levels/level04.ts` & `src/levels/index.ts`)
- **ID**: `level-04-tinyurl`
- **Title**: `Dịch Vụ Rút Gọn Link Toàn Cầu (Global TinyURL Service)`
- **Badge**: `Level 4: TinyURL`
- **Parameters**:
  - `baseRps`: 1,000 RPS
  - `spikeRps`: 8,000 RPS
  - `spikeDurationSeconds`: 15s
  - `budgetMax`: $350/tháng
  - `latencyTargetMs`: 70ms
  - `slaTarget`: 99.9%
  - `writeRatio`: 0.05
  - `hasHotKeyEvent`: true
- **Reference Architecture (3★)**:
  - 1 Load Balancer ($25)
  - 3 App Servers Medium ($45 x 3 = $135)
  - 1 Redis Cache ($25)
  - 1 PostgreSQL Master DB ($40)
  - 2 Database Read Replicas ($25 x 2 = $50)
  - **Total Cost**: $275/month (<= 80% of $350 budget, earning 3 stars)

### 2. Physical DAG Path Latency (`src/simulation/engineMath.ts`)
- Upgraded the latency accumulation algorithm:
  - Rather than incorrectly summing every visited parallel node serially, the engine now computes path latency along edges (`pathLatency[target] = Math.max(pathLatency[target], currentPathLatency)`).
  - Parallel server clusters and read replica pools now correctly model concurrent execution latency rather than serial accumulation.

### 3. Hot Key Chaos Event (`src/simulation/simulationWorker.ts` & `useSimulation.ts`)
- Enabled `hasHotKeyEvent` flag in `simulationWorker.ts`.
- During seconds 35-45, generates a 10,000 RPS viral surge.
- Verifies that architectures without Redis drop thousands of requests on Read Replicas, while architectures with Redis absorb 90% of reads at 1ms.

### 4. Automated Verification (`tests/unit/level04TinyUrl.test.tsx`)
- 6 unit tests validating parameter export, 8,000 RPS peak, Hot Key event with and without cache, 3-star score, and TopBar selector.
