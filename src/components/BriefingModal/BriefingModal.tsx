import React from 'react';
import { LevelDefinition } from '../../levels/level01';
import styles from './BriefingModal.module.css';

interface BriefingModalProps {
  isOpen: boolean;
  level: LevelDefinition;
  onClose: () => void;
  onStartDesign: () => void;
}

export const BriefingModal: React.FC<BriefingModalProps> = ({
  isOpen,
  level,
  onClose,
  onStartDesign,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="briefing-title">
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <div className={styles.iconBadge}>🧁</div>
            <div>
              <div className={styles.subtitle}>{level.badge}</div>
              <h2 id="briefing-title" className={styles.title}>
                {level.title}
              </h2>
            </div>
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Đóng"
            title="Đóng"
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>{level.description}</p>

          <div className={styles.grid}>
            <div className={styles.gridItem}>
              <span className={styles.itemLabel}>Lưu lượng mục tiêu</span>
              <span className={styles.itemValue}>{level.baseRps} RPS ({level.targetUsers})</span>
            </div>
            <div className={styles.gridItem}>
              <span className={styles.itemLabel}>Ngân sách trần</span>
              <span className={styles.itemValue}>${level.budgetMax} / tháng</span>
            </div>
            <div className={styles.gridItem}>
              <span className={styles.itemLabel}>Mục tiêu P95 Latency</span>
              <span className={styles.itemValue}>&lt; {level.latencyTargetMs} ms</span>
            </div>
            <div className={styles.gridItem}>
              <span className={styles.itemLabel}>Cam kết Uptime SLA</span>
              <span className={styles.itemValue}>&gt;= {level.slaTarget}%</span>
            </div>
          </div>

          <div className={styles.alertBox}>
            <span>⚡</span>
            <span>
              <strong>Cảnh báo sự cố:</strong> Lưu lượng đột biến (Spike {level.spikeRps} RPS trong {level.spikeDurationSeconds}s) có thể xảy ra khi website lên báo!
            </span>
          </div>
        </div>

        <div className={styles.footer}>
          <button
            className={styles.primaryButton}
            onClick={() => {
              onStartDesign();
              onClose();
            }}
          >
            Bắt đầu thiết kế kiến trúc
          </button>
        </div>
      </div>
    </div>
  );
};
