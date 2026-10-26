import React from 'react';
import { Layers } from 'lucide-react';
import styles from './CanvasArea.module.css';

export const CanvasArea: React.FC = () => {
  return (
    <main className={styles.canvasArea} role="main" aria-label="Architecture Canvas Grid">
      <div className={styles.placeholderPrompt}>
        <Layers size={36} color="var(--color-primary)" />
        <div className={styles.promptTitle}>Không gian Thiết kế Kiến trúc</div>
        <div className={styles.promptSubtitle}>
          Kéo các linh kiện từ hộp công cụ bên trái vào đây để xây dựng sơ đồ hệ thống đáp ứng bài toán
          <strong> Level 1: The Bakery</strong>.
        </div>
        <button className={styles.actionButton}>
          Tải kiến trúc mẫu (Monolith VM)
        </button>
      </div>
    </main>
  );
};
