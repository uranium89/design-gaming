import React from 'react';
import { Play, Pause, Server, Zap } from 'lucide-react';
import styles from './TopBar.module.css';
import { LiveMetrics, SimulationState } from '../../types';

interface TopBarProps {
  metrics: LiveMetrics;
  simulation: SimulationState;
  onToggleSimulation: () => void;
  onSetSpeed: (speed: 1 | 2 | 5) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  metrics,
  simulation,
  onToggleSimulation,
  onSetSpeed,
}) => {
  return (
    <header className={styles.topBar}>
      <div className={styles.leftSection}>
        <div className={styles.brand}>
          <Server className={styles.brandIcon} size={20} />
          <span>SysArchitect</span>
        </div>
        <div className={styles.levelBadge}>
          <Zap size={12} style={{ display: 'inline', marginRight: 4 }} />
          Level 1: The Bakery
        </div>
      </div>

      <div className={styles.centerSection}>
        <button
          className={`${styles.controlBtn} ${simulation.isRunning ? styles.pauseBtn : styles.runBtn}`}
          onClick={onToggleSimulation}
          aria-label={simulation.isRunning ? 'Pause simulation' : 'Run simulation'}
        >
          {simulation.isRunning ? (
            <>
              <Pause size={15} /> Pause
            </>
          ) : (
            <>
              <Play size={15} fill="currentColor" /> Run
            </>
          )}
        </button>

        <div className={styles.speedSelector}>
          {([1, 2, 5] as const).map((s) => (
            <button
              key={s}
              className={`${styles.speedBtn} ${simulation.speed === s ? styles.active : ''}`}
              onClick={() => onSetSpeed(s)}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.metricPill}>
          <span className={styles.metricLabel}>Throughput</span>
          <span className={`${styles.metricValue} ${styles.metricSuccess} mono-metric`}>
            {metrics.throughputRps.toLocaleString()} RPS
          </span>
        </div>

        <div className={styles.metricPill}>
          <span className={styles.metricLabel}>P95 Latency</span>
          <span className={`${styles.metricValue} ${styles.metricSuccess} mono-metric`}>
            {metrics.p95LatencyMs} ms
          </span>
        </div>

        <div className={styles.metricPill}>
          <span className={styles.metricLabel}>Cost</span>
          <span className={`${styles.metricValue} ${styles.metricWarning} mono-metric`}>
            ${metrics.costPerMonth} /mo
          </span>
        </div>

        <div className={styles.metricPill}>
          <span className={styles.metricLabel}>Budget Max</span>
          <span className={`${styles.metricValue} ${styles.metricNeutral} mono-metric`}>
            ${metrics.budgetLimit} /mo
          </span>
        </div>
      </div>
    </header>
  );
};
