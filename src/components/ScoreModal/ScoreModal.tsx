import React from 'react';
import { ScoreBreakdown } from '../../simulation/scoring';
import styles from './ScoreModal.module.css';

interface ScoreModalProps {
  isOpen: boolean;
  score: ScoreBreakdown;
  onClose: () => void;
  onRetry: () => void;
  onLoadReference: () => void;
}

export const ScoreModal: React.FC<ScoreModalProps> = ({
  isOpen,
  score,
  onClose,
  onRetry,
  onLoadReference,
}) => {
  if (!isOpen) return null;

  const getStarRatingText = (stars: number) => {
    switch (stars) {
      case 3:
        return 'Kiến Trúc Sư Xuất Sắc (3 Sao)';
      case 2:
        return 'Đạt Chuẩn Sản Xuất (2 Sao)';
      case 1:
        return 'Hệ Thống Sống Sót - MVP (1 Sao)';
      default:
        return 'Chưa Đạt Yêu Cầu (0 Sao)';
    }
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="score-title">
      <div className={styles.modal}>
        <div className={styles.header}>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Đóng"
            title="Đóng"
          >
            ✕
          </button>

          <div className={styles.starsRow} aria-label={`${score.stars} trên 3 sao`}>
            <span className={score.stars >= 1 ? styles.starEarned : styles.starEmpty}>★</span>
            <span className={score.stars >= 2 ? styles.starEarned : styles.starEmpty}>★</span>
            <span className={score.stars >= 3 ? styles.starEarned : styles.starEmpty}>★</span>
          </div>

          <div id="score-title" className={styles.scoreValue}>
            {score.totalScore} / 1000 Điểm
          </div>
          <div className={styles.scoreSubtitle}>{getStarRatingText(score.stars)}</div>
        </div>

        <div className={styles.content}>
          <div className={styles.pillarList}>
            {/* Throughput */}
            <div className={styles.pillarItem}>
              <div className={styles.pillarMeta}>
                <span className={styles.pillarLabel}>Tải Thành Công (Throughput)</span>
                <span className={styles.pillarScore}>{score.throughputScore} / 350</span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFillThroughput}
                  style={{ width: `${(score.throughputScore / 350) * 100}%` }}
                />
              </div>
            </div>

            {/* Latency */}
            <div className={styles.pillarItem}>
              <div className={styles.pillarMeta}>
                <span className={styles.pillarLabel}>Độ Trễ Phản Hồi (Latency P95)</span>
                <span className={styles.pillarScore}>{score.latencyScore} / 250</span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFillLatency}
                  style={{ width: `${(score.latencyScore / 250) * 100}%` }}
                />
              </div>
            </div>

            {/* Cost Efficiency */}
            <div className={styles.pillarItem}>
              <div className={styles.pillarMeta}>
                <span className={styles.pillarLabel}>Hiệu Quả Chi Phí (Cost)</span>
                <span className={styles.pillarScore}>{score.costScore} / 250</span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFillCost}
                  style={{ width: `${(score.costScore / 250) * 100}%` }}
                />
              </div>
            </div>

            {/* Reliability */}
            <div className={styles.pillarItem}>
              <div className={styles.pillarMeta}>
                <span className={styles.pillarLabel}>Độ Sẵn Sàng & Vượt Thảm Họa (Reliability)</span>
                <span className={styles.pillarScore}>{score.reliabilityScore} / 150</span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFillReliability}
                  style={{ width: `${(score.reliabilityScore / 150) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {score.penalties > 0 && (
            <div className={styles.penaltiesNotice}>
              <span>⚠️ Hình phạt vi phạm (SLA / Data Loss)</span>
              <span>-{score.penalties} điểm</span>
            </div>
          )}

          {score.feedback.length > 0 && (
            <div className={styles.feedbackBox}>
              <div className={styles.feedbackTitle}>Nhận xét kiến trúc</div>
              {score.feedback.map((item, idx) => (
                <p key={idx} className={styles.feedbackItem}>
                  • {item}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.retryButton} onClick={onRetry}>
            Thử lại
          </button>
          <button className={styles.referenceButton} onClick={onLoadReference}>
            Nạp kiến trúc mẫu (3★)
          </button>
        </div>
      </div>
    </div>
  );
};
