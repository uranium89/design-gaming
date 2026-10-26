# Technical Specification: S-014 Màn 5 - Săn Vé Concert Black Friday (Level 05: Concert Ticket Rush)

## Status: Ready
Risk Level: 🟢 Low (Adds level content within existing engine and component capabilities)

## Architecture Overview
Level 05 challenges the player to design an event-driven ticket reservation system under extreme write-heavy burst conditions (flash crowd):
- **Base Traffic**: 500 RPS
- **Flash Crowd Spike**: 15,000 RPS (90% Write, 10% Read, `writeRatio: 0.90`)
- **Cost Ceiling**: $400/month (Budget bonus threshold <= $320/month for 3★)
- **SLA Target**: >= 99.9%
- **P95 Latency Target**: <= 100ms
- **Zero Data Loss Rule**: Dropping write orders fails the level or caps score at 1★.

### Solution Architectures
1. **Failing Synchronous Anti-Pattern (Direct Write to DB)**:
   - User Traffic (15k RPS) -> Load Balancer ($25) -> App Servers (2x Medium = 16k RPS, $90) -> Master DB ($40, 2k-4k RPS).
   - Database receives 13,500 write requests directly.
   - Master DB severely overloaded (ratio > 3.0), drops 9,500-11,500 requests, error rate exceeds 60%, SLA collapses to < 40%, 0-1 star.

2. **Winning Asynchronous Pattern (Queue + Worker Decoupling)**:
   - User Traffic (15k RPS) -> Load Balancer ($25) -> App Servers (2x Medium, $90).
   - Read Traffic (1,500 RPS, 10%): App Servers -> Redis Cache ($25, 90% hit rate, 1,350 hits served in 2ms) -> Master DB (150 reads).
   - Write Traffic (13,500 RPS, 90%): App Servers -> Message Queue (RabbitMQ, $40, accepts 30k RPS in 5ms without drop).
   - Message Queue -> 2x Worker Pools ($60 total, each draining 2,000 RPS).
   - 2x Worker Pools -> PostgreSQL Master DB ($40, receives 4,000 RPS leveled write stream + 150 read misses = 4,150 RPS).
   - Total Cost: $25 (LB) + $90 (2 App Servers) + $25 (Redis) + $40 (Queue) + $60 (2 Workers) + $40 (PostgreSQL) = **$280/month**.
   - $280 <= 0.80 * $400 ($320), qualifying for 3-star maximum budget bonus!

## File Modifications
1. `src/levels/level05.ts`: Level 5 definition with story, hints, requirements, and reference architecture.
2. `src/levels/index.ts`: Export `LEVEL_05` and include in `ALL_LEVELS`.
3. `tests/unit/level05ConcertTicket.test.tsx`: Comprehensive unit test suite.
