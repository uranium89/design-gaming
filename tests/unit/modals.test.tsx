import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BriefingModal } from '../../src/components/BriefingModal/BriefingModal';
import { ScoreModal } from '../../src/components/ScoreModal/ScoreModal';
import { LEVEL_01 } from '../../src/levels/level01';
import { ScoreBreakdown } from '../../src/simulation/scoring';

describe('Level 1 Modals', () => {
  describe('BriefingModal', () => {
    it('renders level briefing information and constraints', () => {
      const handleClose = vi.fn();
      const handleStartDesign = vi.fn();

      render(
        <BriefingModal
          isOpen={true}
          level={LEVEL_01}
          onClose={handleClose}
          onStartDesign={handleStartDesign}
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Level 1: The Bakery')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Tiệm Bánh Ngọt Gia Đình/i })).toBeInTheDocument();
      expect(screen.getByText(/50 RPS/i)).toBeInTheDocument();
      expect(screen.getByText(/\$35 \/ tháng/i)).toBeInTheDocument();
      expect(screen.getByText(/< 200 ms/i)).toBeInTheDocument();
    });

    it('invokes callbacks on button clicks', () => {
      const handleClose = vi.fn();
      const handleStartDesign = vi.fn();

      render(
        <BriefingModal
          isOpen={true}
          level={LEVEL_01}
          onClose={handleClose}
          onStartDesign={handleStartDesign}
        />
      );

      const startBtn = screen.getByRole('button', { name: /Bắt đầu thiết kế kiến trúc/i });
      fireEvent.click(startBtn);

      expect(handleStartDesign).toHaveBeenCalledTimes(1);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('ScoreModal', () => {
    it('renders 3-star score breakdown and handles actions', () => {
      const sampleScore: ScoreBreakdown = {
        throughputScore: 350,
        latencyScore: 250,
        costScore: 220,
        reliabilityScore: 150,
        penalties: 0,
        totalScore: 970,
        stars: 3,
        feedback: ['Kiến trúc xuất sắc tối ưu chi phí.'],
      };

      const handleClose = vi.fn();
      const handleRetry = vi.fn();
      const handleLoadRef = vi.fn();

      render(
        <ScoreModal
          isOpen={true}
          score={sampleScore}
          onClose={handleClose}
          onRetry={handleRetry}
          onLoadReference={handleLoadRef}
        />
      );

      expect(screen.getByText(/970 \/ 1000 Điểm/i)).toBeInTheDocument();
      expect(screen.getByText(/Kiến Trúc Sư Xuất Sắc \(3 Sao\)/i)).toBeInTheDocument();
      expect(screen.getByText(/350 \/ 350/i)).toBeInTheDocument();
      expect(screen.getByText(/Kiến trúc xuất sắc tối ưu chi phí/i)).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /Thử lại/i }));
      expect(handleRetry).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole('button', { name: /Nạp kiến trúc mẫu/i }));
      expect(handleLoadRef).toHaveBeenCalledTimes(1);
    });

    it('verifies Level 1 reference architecture includes DB and stays within $35 budget', () => {
      const totalCost = LEVEL_01.referenceNodes
        .filter((n) => n.data.name !== 'User Traffic')
        .reduce((sum, n) => sum + (n.data.cost || 0), 0);

      expect(totalCost).toBe(30); // VM ($20) + SQLite / Micro DB ($10)
      expect(totalCost).toBeLessThanOrEqual(LEVEL_01.budgetMax); // 30 <= 35
      expect(LEVEL_01.referenceNodes.some((n) => n.data.name.includes('SQLite / Micro DB'))).toBe(true);
      expect(LEVEL_01.referenceEdges.length).toBe(2);
    });
  });
});

