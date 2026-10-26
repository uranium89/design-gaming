# Technical Specification: S-012

## Status: APPROVED
## Risk Level: 🟢 Low

## Overview
Implement Level 4: Global TinyURL Service (`LEVEL_04`) to educate players on read-heavy architectural patterns (95% Read, 5% Write, 20:1 ratio), Database Read Replicas, Caching with Redis, and handling unpredictable "Hot Key" traffic spikes.

## Level Configuration (`src/levels/level04.ts`)
- **ID**: `level-04-tinyurl`
- **Title**: `Dịch Vụ Rút Gọn Link Toàn Cầu (Global TinyURL Service)`
- **Badge**: `Level 4: TinyURL`
- **Description**: High-scale URL shortener facing 8,000 RPS peak and a viral 10,000 RPS Hot Key event.
- **Metrics**:
  - `baseRps`: 1,000 RPS
  - `spikeRps`: 8,000 RPS
  - `spikeDurationSeconds`: 15s
  - `budgetMax`: $350/month
  - `latencyTargetMs`: 50ms
  - `slaTarget`: 99.9%
  - `writeRatio`: 0.05
  - `hasHotKeyEvent`: true

## Chaos Hot Key Mechanism
- During simulation seconds 35-45, when `hasHotKeyEvent` is true, generated traffic surges to 10,000 RPS.
- **Without Redis Cache**:
  - 95% of 10,000 RPS = 9,500 RPS reads hit Read Replicas (total capacity 3,000 RPS).
  - Causes severe connection exhaustion: > 6,000 RPS dropped, P95 latency > 150ms, SLA < 50%, resulting in 0-1 star fail.
- **With Redis Cache**:
  - 10,000 RPS is processed by 2 Large App Servers (5,000 RPS each, within 6,000 RPS capacity).
  - Redis Cache absorbs 90% of reads (8,550 RPS at 1ms).
  - 500 RPS writes route to Master DB (within 2,000 RPS capacity).
  - 950 RPS cache misses route across 2 Read Replicas (475 RPS each, within 1,500 RPS capacity).
  - Zero dropped requests, P95 < 25ms, SLA 100%, earning 3 stars.

## Reference Architecture (3★)
- **1 Load Balancer**: $25/m, 15,000 RPS
- **2 App Servers Large**: $90 x 2 = $180/m, 6,000 RPS each
- **1 Redis Cache**: $25/m, 20,000 RPS, 1ms
- **1 PostgreSQL Master DB**: $40/m, 2,000 RPS
- **2 Database Read Replicas**: $25 x 2 = $50/m, 1,500 RPS each
- **Total Operational Cost**: $320/month (Budget limit $350)
- **P95 Latency**: ~20-25ms (Target < 50ms)
- **SLA**: 100% (Target 99.9%)
