# Threat Model: S-014 Màn 5 - Săn Vé Concert Black Friday (Level 05: Concert Ticket Rush)

## Asset & Trust Boundaries
- **Assets**: Ticket order transaction records, database connection pool, queue buffer memory, financial integrity of ticket transactions.
- **Threat Actors**: Flash crowd surges, bot scalpers firing burst traffic, unthrottled concurrent write operations.

## Threats Identified (STRIDE)
1. **Denial of Service (DoS) on Storage Layer**:
   - *Threat*: 13,500 simultaneous write requests directly hitting PostgreSQL Master DB exhausts connection pool and storage I/O, causing full service crash.
   - *Mitigation*: App servers offload write requests asynchronously into Message Queue (RabbitMQ). Queue acts as shock absorber.
2. **Buffer Overflow & Message Loss**:
   - *Threat*: If Message Queue memory limit is reached without backpressure or persistent disk buffer, incoming messages could be dropped.
   - *Mitigation*: RabbitMQ node sized with 30,000 RPS ingestion capacity and persistent FIFO buffer semantics.
3. **Database Write Contention / Thundering Herd**:
   - *Threat*: Multiple workers overwhelming database with unthrottled parallel inserts.
   - *Mitigation*: Worker Pool acts as rate limiter, draining queue at controlled 2,000 RPS per worker pool.

## Security Acceptance Criteria
- [x] Level engine verifies zero data loss under 15,000 RPS write burst when queue and worker pool are deployed.
- [x] Simulation does not freeze or leak memory under 15,000 RPS load.
