# Threat Model: S-012

## Status: APPROVED

## Asset & Flow Analysis
- **Asset**: URL redirection mapping, system availability under Hot Key surges.
- **Threat Scenario 1 (Denial of Service via Cache Exhaustion / Stampede)**:
  - Adversary triggers high-concurrency requests against non-cached or expired keys to overwhelm downstream storage.
  - *Mitigation*: Architecture mandates Redis Caching layer absorbing 90%+ of read requests before hitting Database Read Replicas.
- **Threat Scenario 2 (Write Overload on Primary DB)**:
  - High volume of link creation requests targeting master DB.
  - *Mitigation*: Read/Write Splitting enforces dedicated write channel to PostgreSQL Master DB while reads are safely isolated on Read Replicas.
- **Data Integrity & Secrets**:
  - Pure educational simulation on client-side; no real URLs or credentials stored or transmitted.
