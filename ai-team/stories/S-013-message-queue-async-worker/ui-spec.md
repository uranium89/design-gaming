# UI Specification: S-013

## Status: APPROVED

## 1. SidebarDock Component Palette
- **Queue Section**:
  - `Message Queue (RabbitMQ)`:
    - Cost: `$40/month`, `30,000 RPS`, `+5 ms`.
    - Amber/Orange gradient border accent.
    - Icon: `Layers` from `lucide-react`.
- **Compute Section**:
  - `Worker Pool (Async Consumer)`:
    - Cost: `$30/month`, `2,000 RPS`, `+15 ms`.
    - Purple/Violet accent border.
    - Icon: `Cpu` or `Wrench`.

## 2. Component Inspector
- Selecting `Message Queue (RabbitMQ)`:
  - Header badge: `"Message Queue (FIFO)"` in `#f59e0b` amber styling.
  - Utilization bar shows incoming RPS vs 30,000 RPS capacity.
- Selecting `Worker Pool (Async Consumer)`:
  - Header badge: `"Async Consumer"` in `#a855f7` purple styling.
  - Utilization bar shows consumed RPS vs 2,000 RPS capacity.

## 3. Visual Flows on Canvas
- Dynamic particle edges from App Server to Message Queue stream rapidly (amber/warm colored particles).
- Dynamic edges from Message Queue to Worker Pools show smoothed, throttled traffic delivery.
