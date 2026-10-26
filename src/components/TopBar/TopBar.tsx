import React from 'react';
import { Play, Pause, Server, Zap, BookOpen, Trophy, Flame } from 'lucide-react';
import styles from './TopBar.module.css';
import { LiveMetrics, SimulationState } from '../../types';

import { LevelDefinition } from '../../levels/level01';

interface TopBarProps {
  metrics: LiveMetrics;
  simulation: SimulationState;
  levels?: LevelDefinition[];
  currentLevelId?: string;
  onSelectLevel?: (levelId: string) => void;
  onToggleSimulation: () => void;
  onSetSpeed: (speed: 1 | 2 | 5) => void;
  onOpenBriefing?: () => void;
  onOpenScoring?: () => void;
  onTriggerSpike?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  metrics,
  simulation,
  levels,
  currentLevelId,
  onSelectLevel,
  onToggleSimulation,
  onSetSpeed,
  onOpenBriefing,
  onOpenScoring,
  onTriggerSpike,
}) => {
  const isSpikeActive = simulation.stats?.isSpikeActive || false;
  const elapsed = simulation.elapsedSeconds || 0;
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <header className={styles.topBar}>
      <div className={styles.leftSection}>
        <div className={styles.brand}>
          <Server className={styles.brandIcon} size={20} />
          <span>SysArchitect</span>
        </div>
        {levels && levels.length > 0 ? (
          <div className={styles.levelSelectorContainer}>
            <Zap size={13} className={styles.levelIcon} />
            <select
              className={styles.levelSelect}
              value={currentLevelId}
              onChange={(e) => onSelectLevel?.(e.target.value)}
              aria-label="Chọn màn chơi"
            >
              {levels.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>
                  {lvl.badge}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className={styles.levelBadge}>
            <Zap size={12} style={{ display: 'inline', marginRight: 4 }} />
            Level 1: The Bakery
          </div>
        )}
        {onOpenBriefing && (
          <button
            className={styles.ghostBtn}
            onClick={onOpenBriefing}
            aria-label="Xem đề bài"
            title="Xem đề bài và ràng buộc mục tiêu"
          >
            <BookOpen size={14} /> Đề bài
          </button>
        )}
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

        <div className={styles.clockBadge} title="Thời gian mô phỏng">
          ⏱ {timeFormatted}
        </div>

        {onTriggerSpike && (
          <button
            className={`${styles.spikeBtn} ${isSpikeActive ? styles.spikeActive : ''}`}
            onClick={onTriggerSpike}
            title={isSpikeActive ? 'Đang xảy ra bùng nổ lưu lượng!' : 'Kích hoạt thử nghiệm Spike 120 RPS'}
          >
            <Flame size={13} /> {isSpikeActive ? 'Spike Đang Diễn Ra!' : 'Thử Spike'}
          </button>
        )}
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

        {onOpenScoring && (
          <button
            className={styles.evalBtn}
            onClick={onOpenScoring}
            aria-label="Chấm điểm kiến trúc"
            title="Đánh giá kiến trúc và nhận sao"
          >
            <Trophy size={14} /> Chấm điểm
          </button>
        )}
      </div>
    </header>
  );
};
