# Implementation Notes: S-013 Linh Kiện Message Queue (RabbitMQ) & Worker Pool (Async Processing)

## Summary of Changes
1. **SidebarDock Component Catalog (`src/components/SidebarDock/SidebarDock.tsx`)**:
   - Added `Layers` icon import from `lucide-react`.
   - Updated `msg-queue` configuration:
     - Name: `Message Queue (RabbitMQ)`
     - Cost: `$40/m`
     - Capacity: `30,000 RPS`
     - Added Latency: `5ms`
     - Category: `messaging`
     - Color: Amber/Orange `#f59e0b`
     - Icon: `Layers`
   - Added `worker-pool` configuration:
     - Name: `Worker Pool (Async Consumer)`
     - Cost: `$30/m`
     - Capacity: `2,000 RPS`
     - Added Latency: `15ms`
     - Category: `compute`
     - Color: Purple `#a855f7`
     - Icon: `Cpu`
     - Description: "Async queue consumer draining tasks to storage without dropping spikes"

2. **Component Inspector (`src/components/Inspector/Inspector.tsx` & `Inspector.module.css`)**:
   - Added `Layers` icon import and node icon rendering.
   - Added specific architectural badges:
     - `.queueBadge`: "Message Queue (FIFO)" (`#f59e0b` text, `rgba(245, 158, 11, 0.12)` bg).
     - `.workerBadge`: "Async Consumer" (`#a855f7` text, `rgba(168, 85, 247, 0.12)` bg).
   - Displayed async buffering and leveling capability parameters.

3. **Simulation Math Engine (`src/simulation/engineMath.ts`)**:
   - Converted graph processing to **Kahn's Topological Sort Algorithm** across the reachable DAG subgraph, eliminating premature node evaluation in multi-hop diamond topologies.
   - Added `isQueueNode` and `isWorkerNode` pattern matching.
   - Updated write traffic routing:
     - App servers route `writePart` to Message Queue when available.
     - Message Queue buffers burst traffic up to 30,000 RPS without dropping packets (`totalSuccessfulRps += rpsOut`).
     - Message Queue levels traffic downstream to Worker Pools up to total worker capacity (`Math.min(rpsOut, totalWorkerCapacity)`).
     - Worker Pools forward leveled write stream to downstream Master Database.
     - Implemented `asyncWriteRpsMap` to prevent double counting while accurately tracking synchronous read fulfillment at storage nodes.

## How to Test
- `npx vitest run tests/unit/messageQueueWorker.test.tsx`
- `npm test`
- `npm run build`
