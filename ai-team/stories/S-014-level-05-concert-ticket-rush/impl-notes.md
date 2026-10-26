# Implementation Notes: S-014 Màn 5 - Săn Vé Concert Black Friday (Level 05: Concert Ticket Rush)

## Summary of Changes
1. **Level 5 Definition (`src/levels/level05.ts`)**:
   - `id`: `level-05-ticket-rush`
   - `title`: `Săn Vé Concert Black Friday (Concert Ticket Rush)`
   - `badge`: `Level 5: Ticket Rush`
   - `targetUsers`: `50,000 Tickets / 15,000 Peak Rush`
   - `baseRps`: 500
   - `spikeRps`: 15,000 (90% Write, 10% Read, `writeRatio: 0.90`)
   - `budgetMax`: $400/month
   - `latencyTargetMs`: 100ms
   - `slaTarget`: 99.9%
   - Clean initial canvas with User Traffic node ($0, 20,000 RPS).
   - Reference 3★ architecture:
     - 1 Load Balancer ($25, 20k RPS)
     - 2 App Servers Medium ($45 x 2 = $90, 8k RPS each)
     - 1 Redis Cache ($25, 20k RPS)
     - 1 Message Queue (RabbitMQ, $40, 30k RPS)
     - 2 Worker Pools ($30 x 2 = $60, 2k RPS each)
     - 1 PostgreSQL Master DB ($40, 6k RPS)
     - Total Cost: $280/m (<= 0.80 * $400 = $320/m, qualifying for 3★ bonus).

2. **Levels Registry (`src/levels/index.ts`)**:
   - Exported `LEVEL_05` and registered in `ALL_LEVELS` array.

3. **Simulation Routing Enhancement (`src/simulation/engineMath.ts`)**:
   - Added `cacheTargets` to read/write splitting logic.
   - Read traffic (`readPart`) routes to Cache when present, hits 90% in 1ms, and forwards 10% misses to downstream DB.
   - Write traffic (`writePart`) routes to Message Queue when present, buffering flash bursts up to 30,000 RPS.
   - Introduced `writeRpsMap` so Cache distinguishes pure read traffic from write-through traffic.

4. **Testing Suite (`tests/unit/level05ConcertTicket.test.tsx`)**:
   - 5 comprehensive tests validating parameters, 15,000 RPS flash crowd absorption, 3-star scoring, anti-pattern database crash without queue, and TopBar dropdown selection.

## How to Test
- `npx vitest run tests/unit/level05ConcertTicket.test.tsx`
- `npm test`
- `npm run build`
