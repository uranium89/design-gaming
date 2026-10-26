# Technical Specification: S-013

## Status: APPROVED
## Risk Level: 🟡 Med

## Overview
Introduce `Message Queue (RabbitMQ)` and `Worker Pool (Async Consumer)` components and implement asynchronous decoupled traffic processing (Traffic Buffering & Leveling) in `src/simulation/engineMath.ts`.

## Architecture Decision Record (ADR-005: Asynchronous Queue Buffering)
- **Context**: Under high-volume write spikes (such as flash sales or ticket drops where 90% of requests are writes), traditional synchronous architectures overwhelm relational database connection pools, causing catastrophic database crashes and permanent data loss.
- **Decision**: Decouple the write path using an asynchronous Message Queue (RabbitMQ).
  1. **Ingestion & Receipt**: App Server pushes write payloads to Message Queue (capacity 30,000 RPS, 5ms latency) and immediately returns an asynchronous acknowledgment (`202 Accepted`) to the client.
  2. **Buffering**: If ingress traffic exceeds consumer drain rate, messages safely accumulate in the queue without being dropped (Zero Data Loss).
  3. **Traffic Leveling**: Worker Pool instances poll messages from the queue and write them to PostgreSQL Master DB at a controlled, sustainable rate (2,000 RPS per worker), shielding the database.
- **Challenge & Trade-offs**:
  - Reviewer agreement: Eventual consistency is acceptable for ticket reservation queuing. The system must account for queue component cost ($40/m) and worker pool cost ($30/m per node).

## Components Design
1. **`Message Queue (RabbitMQ)`**:
   - `id`: `queue-rabbitmq`
   - `name`: `Message Queue (RabbitMQ)`
   - `category`: `storage` (or `queue`)
   - `cost`: $40/month
   - `capacityRps`: 30,000 RPS
   - `addedLatencyMs`: 5ms
   - `icon`: `Layers`
2. **`Worker Pool (Async Consumer)`**:
   - `id`: `worker-pool`
   - `name`: `Worker Pool (Async Consumer)`
   - `category`: `compute`
   - `cost`: $30/month
   - `capacityRps`: 2,000 RPS
   - `addedLatencyMs`: 15ms
   - `icon`: `Cpu`

## Simulation Math Engine Routing (`src/simulation/engineMath.ts`)
- In Compute -> Storage routing:
  - If targets include a Queue node:
    - Write traffic (`rpsOut * writeRatio`) is routed to the Queue node.
    - Queue accepts up to 30,000 RPS.
    - Write requests buffered in the Queue are marked as successfully accepted receipts (`totalSuccessfulRps += queueTraffic`).
  - From Queue node -> downstream targets:
    - If targets include Worker Pool(s):
      - Ingress traffic is distributed across healthy Worker Pools.
      - Each Worker Pool consumes up to its capacity (2,000 RPS each).
      - Excess traffic is held in buffer (not dropped!).
    - Worker Pool forwards leveled traffic to Master DB (within DB capacity).
  - Direct Compute -> DB without Queue:
    - If `writeTraffic > dbCapacity`, excess writes are dropped, incurring Data Loss penalties.
