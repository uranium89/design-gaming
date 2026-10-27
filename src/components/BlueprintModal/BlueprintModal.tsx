import React, { useState, useRef, useMemo } from 'react';
import { Share2, Download, Upload, Copy, Check, AlertCircle, CheckCircle, X, AlertTriangle } from 'lucide-react';
import styles from './BlueprintModal.module.css';
import { CustomNodeType } from '../../state/graphStore';
import { Edge } from '@xyflow/react';
import { CloudProvider } from '../../types';
import {
  ArchitectureBlueprint,
  exportBlueprintToJson,
  downloadBlueprintFile,
  parseAndValidateBlueprint,
  encodeBlueprintToHash,
  summarizeBlueprint,
} from '../../services/blueprintService';

interface BlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  levelId: string;
  activeEmpire?: CloudProvider;
  nodes: CustomNodeType[];
  edges: Edge[];
  onImportBlueprint: (blueprint: ArchitectureBlueprint) => void;
}

export const BlueprintModal: React.FC<BlueprintModalProps> = ({
  isOpen,
  onClose,
  levelId,
  activeEmpire,
  nodes,
  edges,
  onImportBlueprint,
}) => {
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [pendingBlueprint, setPendingBlueprint] = useState<ArchitectureBlueprint | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const blueprint: ArchitectureBlueprint = useMemo(
    () => ({
      version: 1,
      timestamp: new Date().toISOString(),
      levelId,
      activeEmpire,
      nodes,
      edges,
    }),
    [levelId, activeEmpire, nodes, edges]
  );

  const previewSummary = useMemo(() => {
    if (!pendingBlueprint) return null;
    return summarizeBlueprint(pendingBlueprint);
  }, [pendingBlueprint]);

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const hash = encodeBlueprintToHash(blueprint);
    return `${window.location.origin}${window.location.pathname}${hash}`;
  }, [blueprint]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('input');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Failed to copy share link:', err);
    }
  };

  const handleExportJson = () => {
    const json = exportBlueprintToJson(levelId, activeEmpire, nodes, edges);
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadBlueprintFile(json, `sysarchitect-${levelId}-${dateStr}.json`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const result = parseAndValidateBlueprint(text);

      if (result.success && result.blueprint) {
        setPendingBlueprint(result.blueprint);
        setImportStatus(null);
      } else {
        setPendingBlueprint(null);
        setImportStatus({
          type: 'error',
          message: result.error || 'File bản vẽ không đúng định dạng.',
        });
      }
    };
    reader.onerror = () => {
      setImportStatus({ type: 'error', message: 'Không thể đọc file đã chọn.' });
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmImport = () => {
    if (!pendingBlueprint) return;
    onImportBlueprint(pendingBlueprint);
    setImportStatus({
      type: 'success',
      message: `Nạp thành công bản vẽ (${pendingBlueprint.nodes.length} nodes, ${pendingBlueprint.edges.length} edges)!`,
    });
    setPendingBlueprint(null);
  };

  const handleCancelPending = () => {
    setPendingBlueprint(null);
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Bản vẽ kiến trúc">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <Share2 className={styles.headerIcon} size={20} />
          <h2 className={styles.headerTitle}>Bản Vẽ Kiến Trúc (Blueprint & Share)</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Đóng cửa sổ">
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
          {importStatus && (
            <div
              className={`${styles.alertBox} ${
                importStatus.type === 'error' ? styles.alertError : styles.alertSuccess
              }`}
            >
              {importStatus.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
              <span>{importStatus.message}</span>
            </div>
          )}

          {/* Card 1: Share Link */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <Share2 size={16} />
              <span>Sao chép Liên kết Chia sẻ</span>
            </div>
            <p className={styles.sectionDesc}>
              Tạo đường dẫn URL nén chứa toàn bộ kiến trúc để gửi cho bạn bè hoặc mở trên thiết bị khác.
            </p>
            <div className={styles.shareLinkRow}>
              <input
                type="text"
                readOnly
                value={shareUrl}
                className={styles.shareInput}
                aria-label="Đường dẫn chia sẻ bản vẽ"
              />
              <button
                className={`${styles.btnPrimary} ${copied ? styles.btnSuccess : ''}`}
                onClick={handleCopyLink}
                aria-label={copied ? 'Đã sao chép' : 'Sao chép liên kết'}
              >
                {copied ? (
                  <>
                    <Check size={14} /> Đã chép!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Sao chép
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 2: Export JSON */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <Download size={16} />
              <span>Xuất Bản vẽ (Export JSON)</span>
            </div>
            <p className={styles.sectionDesc}>
              Tải file cấu trúc bản vẽ ({nodes.length} nodes, {edges.length} edges) về máy tính để lưu trữ dự phòng.
            </p>
            <div>
              <button className={styles.btnSecondary} onClick={handleExportJson} aria-label="Tải xuống JSON">
                <Download size={14} /> Tải xuống .json
              </button>
            </div>
          </div>

          {/* Card 3: Import JSON */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <Upload size={16} />
              <span>Nhập Bản vẽ (Import JSON)</span>
            </div>
            <p className={styles.sectionDesc}>
              Nạp lại file `.json` bản vẽ đã xuất trước đó lên vùng vẽ Canvas hiện tại.
            </p>

            {pendingBlueprint && previewSummary ? (
              <div className={styles.previewCard} data-testid="blueprint-preview-card">
                <div className={styles.previewHeader}>
                  <h3 className={styles.previewTitle}>Xem trước bản vẽ</h3>
                  <div className={styles.badgeRow}>
                    <span className={`${styles.previewBadge} ${styles.levelBadge}`}>
                      {previewSummary.levelId}
                    </span>
                    {previewSummary.activeEmpire && (
                      <span className={`${styles.previewBadge} ${styles.empireBadge}`}>
                        {previewSummary.activeEmpire}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Linh kiện</span>
                    <span className={styles.metricItemValue}>{previewSummary.nodesCount}</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Kết nối</span>
                    <span className={styles.metricItemValue}>{previewSummary.edgesCount}</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Chi phí dự toán</span>
                    <span className={styles.metricItemValue}>${previewSummary.totalCost}/th</span>
                  </div>
                </div>

                {previewSummary.componentBreakdown.length > 0 && (
                  <div className={styles.chipsContainer}>
                    {previewSummary.componentBreakdown.map((item) => (
                      <span key={item.name} className={styles.chip}>
                        {item.name} × {item.count}
                      </span>
                    ))}
                  </div>
                )}

                {nodes.length > 0 && (
                  <div className={styles.warningBox} data-testid="overwrite-warning">
                    <AlertTriangle size={16} style={{ flexShrink: 0, color: '#f59e0b' }} />
                    <span>
                      Cảnh báo: Bản vẽ này sẽ thay thế {nodes.length} linh kiện hiện tại trên Canvas của bạn.
                    </span>
                  </div>
                )}

                <div className={styles.previewActions}>
                  <button
                    type="button"
                    className={styles.btnSecondary}
                    onClick={handleCancelPending}
                    aria-label="Hủy nạp bản vẽ"
                  >
                    Hủy / Chọn file khác
                  </button>
                  <button
                    type="button"
                    className={`${styles.btnPrimary} ${styles.btnSuccess}`}
                    onClick={handleConfirmImport}
                    aria-label="Xác nhận nạp bản vẽ"
                  >
                    <Check size={14} /> Xác nhận nạp bản vẽ
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  onChange={handleFileChange}
                  className={styles.hiddenFileInput}
                  id="blueprint-file-input"
                />
                <button
                  className={styles.btnSecondary}
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Chọn file JSON để nạp"
                >
                  <Upload size={14} /> Chọn file JSON
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
