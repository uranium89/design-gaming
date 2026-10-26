export interface ScoringInput {
  totalRequests: number;
  successfulRequests: number;
  p95LatencyMs: number;
  targetLatencyMs: number;
  actualCost: number;
  budgetMax: number;
  incidentUptimeSeconds: number;
  totalIncidentSeconds: number;
  dataLossCount?: number;
  uptimePercent?: number;
  slaTarget?: number;
  dbMasterCrashed?: boolean;
  hasDirectClientToStorage?: boolean;
  hasComputeLayer?: boolean;
  hasStorageLayer?: boolean;
  writeRatio?: number;
}

export interface ScoreBreakdown {
  throughputScore: number;
  latencyScore: number;
  costScore: number;
  reliabilityScore: number;
  penalties: number;
  totalScore: number;
  stars: 0 | 1 | 2 | 3;
  feedback: string[];
}

export function calculateScore(input: ScoringInput): ScoreBreakdown {
  const {
    totalRequests,
    successfulRequests,
    p95LatencyMs,
    targetLatencyMs,
    actualCost,
    budgetMax,
    incidentUptimeSeconds,
    totalIncidentSeconds,
    dataLossCount = 0,
    slaTarget = 99.0,
    dbMasterCrashed = false,
    hasDirectClientToStorage = false,
    hasComputeLayer = true,
    hasStorageLayer = true,
    writeRatio = 0.20,
  } = input;

  const feedback: string[] = [];

  // Critical Architecture Violation 1: Direct Client to Storage without App Server
  if (hasDirectClientToStorage) {
    feedback.push(
      '🚨 LỖI BẢO MẬT & KIẾN TRÚC: Kết nối trực tiếp Client tới Database! Database không thể nhận raw HTTP request trực tiếp qua Internet mà không qua App Server.'
    );
    return {
      throughputScore: 0,
      latencyScore: 0,
      costScore: 0,
      reliabilityScore: 0,
      penalties: 500,
      totalScore: 0,
      stars: 0,
      feedback,
    };
  }

  // Critical Architecture Violation 2: Missing Compute Layer
  if (!hasComputeLayer) {
    feedback.push(
      '🚨 THIẾU TẦNG XỬ LÝ (COMPUTE): Không có App Server để chạy backend web và xử lý đơn hàng!'
    );
    return {
      throughputScore: 0,
      latencyScore: 0,
      costScore: 0,
      reliabilityScore: 0,
      penalties: 500,
      totalScore: 0,
      stars: 0,
      feedback,
    };
  }

  // 1. Throughput Score (Max: 350)
  let throughputScore = 0;
  const successRatio = totalRequests > 0 ? successfulRequests / totalRequests : 1;
  throughputScore = Math.max(0, Math.min(350, 350 * successRatio));
  if (successRatio >= 0.99) {
    feedback.push('Tỉ lệ đáp ứng tải xuất sắc (>= 99%).');
  } else if (successRatio >= 0.95) {
    feedback.push('Tỉ lệ đáp ứng đạt yêu cầu, một số gói bị drop khi tải đỉnh.');
  } else {
    feedback.push('Nhiều gói tin bị từ chối do quá tải hàng đợi.');
  }

  // 2. Latency Score (Max: 250)
  let latencyScore = 0;
  if (p95LatencyMs <= targetLatencyMs) {
    latencyScore = 250;
    feedback.push(`P95 Latency (${Math.round(p95LatencyMs)}ms) đạt mục tiêu đề bài (< ${targetLatencyMs}ms).`);
  } else if (p95LatencyMs <= 2 * targetLatencyMs) {
    const ratio = (p95LatencyMs - targetLatencyMs) / targetLatencyMs;
    latencyScore = Math.max(0, 250 * (1 - ratio));
    feedback.push(`P95 Latency (${Math.round(p95LatencyMs)}ms) hơi cao so với chuẩn (${targetLatencyMs}ms).`);
  } else {
    latencyScore = 0;
    feedback.push(`Độ trễ quá lớn (> ${targetLatencyMs * 2}ms), người dùng bị treo.`);
  }

  // 3. Cost Score (Max: 250)
  let costScore = 0;
  const halfBudget = 0.5 * budgetMax;
  if (actualCost <= halfBudget) {
    costScore = 250;
    feedback.push(`Chi phí cực kỳ tối ưu ($${actualCost}/tháng <= 50% ngân sách $${budgetMax}).`);
  } else if (actualCost <= budgetMax) {
    const ratio = (actualCost - halfBudget) / halfBudget;
    costScore = Math.max(0, 250 * (1 - ratio * 0.5));
    feedback.push(`Chi phí kiểm soát tốt trong ngân sách ($${actualCost}/$${budgetMax}).`);
  } else {
    costScore = 0;
    feedback.push(`Vượt ngân sách quy định ($${actualCost} > $${budgetMax})!`);
  }

  // 4. Reliability Score (Max: 150)
  let reliabilityScore = 0;
  if (totalIncidentSeconds <= 0) {
    reliabilityScore = 150;
  } else {
    const uptimeRatio = Math.max(0, Math.min(1, incidentUptimeSeconds / totalIncidentSeconds));
    reliabilityScore = 150 * uptimeRatio;
    if (uptimeRatio >= 0.9) {
      feedback.push('Hệ thống vững vàng vượt qua giai đoạn lưu lượng đột biến (Spike).');
    } else {
      feedback.push('Hệ thống bị chập chờn khi có lưu lượng tăng vọt.');
    }
  }

  // 5. Penalties
  let penalties = 0;
  let effectiveDataLoss = dataLossCount;

  // Missing Database while having Write requests causes Data Loss penalty
  if (!hasStorageLayer && writeRatio > 0) {
    effectiveDataLoss += 1;
    penalties += 150;
    feedback.push(
      `⚠️ MẤT DỮ LIỆU (DATA LOSS): Thiếu Database để lưu trữ ${Math.round(writeRatio * 100)}% đơn đặt bánh online! Trừ 150 điểm.`
    );
  }

  if (dataLossCount > 0) {
    const penalty = dataLossCount * 100;
    penalties += penalty;
    feedback.push(`Bị trừ ${penalty} điểm do làm mất dữ liệu (${dataLossCount} lần)!`);
  }

  const computedUptime = input.uptimePercent !== undefined ? input.uptimePercent : successRatio * 100;
  if (computedUptime < slaTarget) {
    const slaPenalty = computedUptime < 95.0 ? 150 : 50;
    penalties += slaPenalty;
    feedback.push(`Vi phạm SLA Uptime (${computedUptime.toFixed(1)}% < ${slaTarget}%): trừ ${slaPenalty} điểm.`);
  }

  if (dbMasterCrashed) {
    penalties += 80;
    feedback.push('Database Master bị sập: trừ 80 điểm.');
  }

  // Total Score (0 - 1000)
  const rawTotal = throughputScore + latencyScore + costScore + reliabilityScore - penalties;
  const totalScore = Math.max(0, Math.min(1000, Math.round(rawTotal * 100) / 100));

  // Determine Stars (0 - 3)
  let stars: 0 | 1 | 2 | 3 = 0;
  const isOverBudgetHard = actualCost > 1.2 * budgetMax;

  if (isOverBudgetHard || totalScore < 500 || effectiveDataLoss > 0 && totalScore < 700) {
    stars = 0;
  } else if (
    totalScore >= 850 &&
    computedUptime >= slaTarget &&
    actualCost <= 0.75 * budgetMax &&
    effectiveDataLoss === 0
  ) {
    stars = 3;
  } else if (totalScore >= 700 && computedUptime >= 95.0 && actualCost <= budgetMax) {
    stars = 2;
  } else {
    stars = 1;
  }

  return {
    throughputScore: Math.round(throughputScore * 100) / 100,
    latencyScore: Math.round(latencyScore * 100) / 100,
    costScore: Math.round(costScore * 100) / 100,
    reliabilityScore: Math.round(reliabilityScore * 100) / 100,
    penalties: Math.round(penalties * 100) / 100,
    totalScore,
    stars,
    feedback,
  };
}
