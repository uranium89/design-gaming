import { useState } from 'react';
import { TopBar } from './components/TopBar/TopBar';
import { SidebarDock } from './components/SidebarDock/SidebarDock';
import { CanvasArea } from './components/CanvasArea/CanvasArea';
import { BriefingModal } from './components/BriefingModal/BriefingModal';
import { ScoreModal } from './components/ScoreModal/ScoreModal';
import { useSimulation } from './simulation/useSimulation';
import { useGraphStore } from './state/graphStore';
import { LEVEL_01 } from './levels/level01';
import { calculateScore, ScoreBreakdown } from './simulation/scoring';
import './styles/global.css';

export function App() {
  const { metrics, simulation, stats, toggleSimulation, setSpeed, triggerSpike, resetSimulation } =
    useSimulation();

  const loadArchitecture = useGraphStore((state) => state.loadArchitecture);
  const resetGraph = useGraphStore((state) => state.resetGraph);

  const [isBriefingOpen, setIsBriefingOpen] = useState(true);
  const [isScoreOpen, setIsScoreOpen] = useState(false);
  const [currentScore, setCurrentScore] = useState<ScoreBreakdown | null>(null);

  const handleOpenScore = () => {
    const nodes = useGraphStore.getState().nodes;
    const edges = useGraphStore.getState().edges;

    // Architecture validation
    const hasDirectClientToStorage = edges.some((e) => {
      const srcNode = nodes.find((n) => n.id === e.source);
      const tgtNode = nodes.find((n) => n.id === e.target);
      return (
        (srcNode?.data.name === 'User Traffic' || srcNode?.data.category === 'routing') &&
        tgtNode?.data.category === 'storage'
      );
    });

    const hasComputeLayer = nodes.some(
      (n) => n.data.category === 'compute' && edges.some((e) => e.target === n.id)
    );

    const hasStorageLayer = nodes.some(
      (n) => n.data.category === 'storage' && edges.some((e) => e.target === n.id)
    );

    const totalReq = stats?.totalRequestsGenerated || (simulation.isRunning ? 1000 : 500);
    const successReq = hasDirectClientToStorage
      ? 0
      : stats?.totalRequestsSucceeded || (simulation.isRunning ? Math.round(totalReq * (1 - metrics.errorRate)) : 500);

    const score = calculateScore({
      totalRequests: totalReq,
      successfulRequests: successReq,
      p95LatencyMs: metrics.p95LatencyMs,
      targetLatencyMs: LEVEL_01.latencyTargetMs,
      actualCost: metrics.costPerMonth,
      budgetMax: LEVEL_01.budgetMax,
      incidentUptimeSeconds: stats?.incidentUptimeSeconds ?? 15,
      totalIncidentSeconds: stats?.totalIncidentSeconds ?? 15,
      slaTarget: LEVEL_01.slaTarget,
      hasDirectClientToStorage,
      hasComputeLayer,
      hasStorageLayer,
      writeRatio: 0.20,
    });

    setCurrentScore(score);
    setIsScoreOpen(true);
  };

  const handleRetry = () => {
    resetSimulation();
    resetGraph();
    setIsScoreOpen(false);
  };

  const handleLoadReference = () => {
    resetSimulation();
    loadArchitecture(LEVEL_01.referenceNodes, LEVEL_01.referenceEdges);
    setIsScoreOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
      <TopBar
        metrics={metrics}
        simulation={simulation}
        onToggleSimulation={toggleSimulation}
        onSetSpeed={setSpeed}
        onOpenBriefing={() => setIsBriefingOpen(true)}
        onOpenScoring={handleOpenScore}
        onTriggerSpike={triggerSpike}
      />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <SidebarDock />
        <CanvasArea />
      </div>

      <BriefingModal
        isOpen={isBriefingOpen}
        level={LEVEL_01}
        onClose={() => setIsBriefingOpen(false)}
        onStartDesign={() => setIsBriefingOpen(false)}
      />

      {currentScore && (
        <ScoreModal
          isOpen={isScoreOpen}
          score={currentScore}
          onClose={() => setIsScoreOpen(false)}
          onRetry={handleRetry}
          onLoadReference={handleLoadReference}
        />
      )}
    </div>
  );
}

export default App;
