import React from 'react';
import { Play, Pause, Server, Zap, BookOpen, Trophy, Flame, Sliders, RotateCcw, Share2, Volume2, VolumeX } from 'lucide-react';
import styles from './TopBar.module.css';
import { LiveMetrics, SimulationState } from '../../types';
import { LevelDefinition } from '../../levels/level01';
import {
  loadProgress,
  renderStarString,
  GameProgress,
  isLevelUnlocked,
  getUnlockRequirementText,
} from '../../services/progressStorage';
import { audioService } from '../../services/audioService';

interface TopBarProps {
  metrics: LiveMetrics;
  simulation: SimulationState;
  levels?: LevelDefinition[];
  currentLevelId?: string;
  progress?: GameProgress;
  sandboxTrafficRps?: number;
  sandboxWriteRatio?: number;
  onSetSandboxTrafficRps?: (rps: number) => void;
  onSetSandboxWriteRatio?: (ratio: number) => void;
  onSelectLevel?: (levelId: string) => void;
  onResetProgress?: () => void;
  onOpenBlueprint?: () => void;
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
  progress,
  sandboxTrafficRps = 1000,
  sandboxWriteRatio = 0.20,
  onSetSandboxTrafficRps,
  onSetSandboxWriteRatio,
  onSelectLevel,
  onResetProgress,
  onOpenBlueprint,
  onToggleSimulation,
  onSetSpeed,
  onOpenBriefing,
  onOpenScoring,
  onTriggerSpike,
}) => {
  const currentProgress = progress || loadProgress();
  const isSandbox = currentLevelId === 'sandbox';
  const isSpikeActive = simulation.stats?.isSpikeActive || false;
  const elapsed = simulation.elapsedSeconds || 0;
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const [isMuted, setIsMuted] = React.useState(() => audioService.isMuted());

  React.useEffect(() => {
    return audioService.onMuteChange((muted) => setIsMuted(muted));
  }, []);

  return (
    <header className={styles.topBar}>
      <div className={styles.leftSection}>
        <div className={styles.brand}>
          <Server className={styles.brandIcon} size={20} />
          <span>Design Gaming</span>
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
              {levels.map((lvl) => {
                const stars = currentProgress[lvl.id]?.stars || 0;
                const unlocked = isLevelUnlocked(currentProgress, lvl.id);
                const starStr = renderStarString(stars);
                let displayTitle = starStr ? `${lvl.badge} ${starStr}` : lvl.badge;

                if (!unlocked) {
                  const reqText = getUnlockRequirementText(lvl.id);
                  displayTitle = `🔒 ${lvl.badge} (${reqText})`;
                }

                return (
                  <option key={lvl.id} value={lvl.id} disabled={!unlocked}>
                    {displayTitle}
                  </option>
                );
              })}
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
            <BookOpen size={14} /> <span className={styles.btnText}>Đề bài</span>
          </button>
        )}
        {onOpenBlueprint && (
          <button
            className={styles.ghostBtn}
            onClick={onOpenBlueprint}
            aria-label="Bản vẽ kiến trúc và chia sẻ"
            title="Xuất, nhập và chia sẻ bản vẽ kiến trúc"
          >
            <Share2 size={14} /> <span className={styles.btnText}>Bản vẽ</span>
          </button>
        )}
        {onResetProgress && (
          <button
            className={styles.iconBtn}
            onClick={() => {
              if (
                window.confirm(
                  'Bạn có chắc chắn muốn đặt lại toàn bộ sao và khóa các màn chơi về trạng thái ban đầu không?'
                )
              ) {
                onResetProgress();
              }
            }}
            aria-label="Đặt lại tiến trình chơi"
            title="Đặt lại toàn bộ tiến trình và thành tích"
          >
            <RotateCcw size={13} />
          </button>
        )}
        <button
          className={styles.iconBtn}
          onClick={() => audioService.toggleMute()}
          aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          title={isMuted ? 'Âm thanh: Đang tắt (Nhấn để bật)' : 'Âm thanh: Đang bật (Nhấn để tắt)'}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} style={{ color: '#38bdf8' }} />}
        </button>
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

        {isSandbox ? (
          <div className={styles.sandboxControls}>
            <div className={styles.sandboxField}>
              <span className={styles.sandboxLabel}>
                <Sliders size={12} style={{ display: 'inline', marginRight: 3 }} />
                Tải:
              </span>
              <input
                type="range"
                min="100"
                max="50000"
                step="500"
                value={sandboxTrafficRps}
                onChange={(e) => onSetSandboxTrafficRps?.(Number(e.target.value))}
                className={styles.sandboxSlider}
                aria-label="Điều chỉnh RPS Sandbox"
              />
              <span className={styles.sandboxValue}>{sandboxTrafficRps.toLocaleString()} RPS</span>
            </div>
            <div className={styles.sandboxField}>
              <span className={styles.sandboxLabel}>Ghi:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sandboxWriteRatio}
                onChange={(e) => onSetSandboxWriteRatio?.(Number(e.target.value))}
                className={styles.sandboxSlider}
                aria-label="Điều chỉnh tỉ lệ ghi Sandbox"
              />
              <span className={styles.sandboxValue}>{Math.round(sandboxWriteRatio * 100)}%</span>
            </div>
          </div>
        ) : (
          onTriggerSpike && (
            <button
              className={`${styles.spikeBtn} ${isSpikeActive ? styles.spikeActive : ''}`}
              onClick={onTriggerSpike}
              title={isSpikeActive ? 'Đang xảy ra bùng nổ lưu lượng!' : 'Kích hoạt thử nghiệm Spike'}
            >
              <Flame size={13} /> {isSpikeActive ? 'Spike Đang Diễn Ra!' : 'Thử Spike'}
            </button>
          )
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
            {metrics.budgetLimit >= 999999 ? '∞ /mo' : `$${metrics.budgetLimit} /mo`}
          </span>
        </div>

        {onOpenScoring && (
          <button
            className={styles.evalBtn}
            onClick={onOpenScoring}
            aria-label="Chấm điểm kiến trúc"
            title="Đánh giá kiến trúc và nhận sao"
          >
            <Trophy size={14} /> <span className={styles.btnText}>Chấm điểm</span>
          </button>
        )}
      </div>
    </header>
  );
};
