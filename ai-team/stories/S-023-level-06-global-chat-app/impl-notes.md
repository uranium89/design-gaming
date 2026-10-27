# Implementation Notes - S-023: Level 06 Global Chat App (WebSockets & Redis Pub/Sub)

## Summary of Changes
1. **`src/levels/level06.ts`**:
   - Created `LEVEL_06`: "Phòng Chat Toàn Cầu (Global Chat App)".
   - Challenge: 100,000 Users / 50,000 CCU, 10,000 messages/s (60% write ratio), Target latency 50ms, Budget $500/month, SLA 99.9%.
   - Reference Architecture (3★):
     - 1 Load Balancer ($25).
     - 2 Stateful Gateway App Servers ($90).
     - 1 Redis Cache / Pub/Sub Broker ($25) for real-time inter-server broadcast.
     - 1 Message Queue (RabbitMQ, $40) + 1 Worker Pool ($30) for asynchronous chat persistence.
     - 1 PostgreSQL Master DB ($40) message store.
     - Total Cost: $250/month ($\le 0.8 \times \$500$, scoring 3 stars).
2. **`src/levels/index.ts`**:
   - Exported `LEVEL_06` and included it in `ALL_LEVELS`.
3. **`src/services/progressStorage.ts`**:
   - Extended `CAMPAIGN_LEVEL_SEQUENCE` to include `'level-06-global-chat'`.
   - Sequential progression enforces that Level 6 requires Level 5 (`level-05-ticket-rush`) to be completed with $\ge 1★$.
4. **`tests/unit/campaignProgression.test.tsx` & `tests/unit/level06GlobalChat.test.tsx`**:
   - Updated sequence assertions for 6 campaign levels.
   - Added unit tests verifying Level 06 definition, reference architecture capacity & cost, sequential lock gating, and 3-star scoring evaluation.
