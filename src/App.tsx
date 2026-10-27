import { useState, useCallback } from 'react';
import { TopBar } from './components/TopBar/TopBar';
import { SidebarDock } from './components/SidebarDock/SidebarDock';
import { CanvasArea } from './components/CanvasArea/CanvasArea';
import { BriefingModal } from './components/BriefingModal/BriefingModal';
import { ScoreModal } from './components/ScoreModal/ScoreModal';
import { useSimulation } from './simulation/useSimulation';
import { useGraphStore } from './state/graphStore';
import { ALL_LEVELS, LEVEL_01, LevelDefinition } from './levels';
import { calculateScore, ScoreBreakdown } from './simulation/scoring';
import { loadProgress, saveLevelProgress, isLevelUnlocked, resetProgress } from './services/progressStorage';
import './styles/global.css';

export function App() {
  const [currentLevel, setCurrentLevel] = useState<LevelDefinition>(LEVEL_01);
  const [progress, setProgress] = useState(loadProgress);
  const [sandboxRps, setSandboxRps] = useState(1000);
  const [sandboxWriteRatio, setSandboxWriteRatio] = useState(0.20);

  const customParams =
    currentLevel.id === 'sandbox'
      ? { baseRps: sandboxRps, writeRatio: sandboxWriteRatio }
      : undefined;

  const { metrics, simulation, stats, toggleSimulation, setSpeed, triggerSpike, resetSimulation } =
    useSimulation(currentLevel, customParams);

  const loadArchitecture = useGraphStore((state) => state.loadArchitecture);

  const [isBriefingOpen, setIsBriefingOpen] = useState(true);
  const [isScoreOpen, setIsScoreOpen] = useState(false);
  const [currentScore, setCurrentScore] = useState<ScoreBreakdown | null>(null);

  const handleSelectLevel = useCallback(
    (levelId: string) => {
      if (!isLevelUnlocked(progress, levelId)) return;
      const selected = ALL_LEVELS.find((l) => l.id === levelId);
      if (selected && selected.id !== currentLevel.id) {
        resetSimulation();
        setCurrentLevel(selected);
        loadArchitecture(selected.initialNodes, selected.initialEdges);
        setIsBriefingOpen(true);
      }
    },
    [currentLevel.id, loadArchitecture, progress, resetSimulation]
  );

  const handleResetProgress = useCallback(() => {
    const fresh = resetProgress();
    setProgress(fresh);
    resetSimulation();
    setCurrentLevel(LEVEL_01);
    loadArchitecture(LEVEL_01.initialNodes, LEVEL_01.initialEdges);
    setIsBriefingOpen(true);
  }, [loadArchitecture, resetSimulation]);

  const handleOpenScore = () => {
    const nodes = useGraphStore.getState().nodes;
    const edges = useGraphStore.getState().edges;

    // Architecture validation: cannot connect User / routing directly to storage
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

    const isDatabaseNode = (name: string, category: string) =>
      category === 'storage' &&
      !name.toLowerCase().includes('cache') &&
      !name.toLowerCase().includes('redis');

    const hasStorageLayer = nodes.some(
      (n) => isDatabaseNode(n.data.name, n.data.category) && edges.some((e) => e.target === n.id)
    );

    const totalReq = stats?.totalRequestsGenerated || (simulation.isRunning ? 1000 : 500);
    const successReq = hasDirectClientToStorage
      ? 0
      : stats?.totalRequestsSucceeded || (simulation.isRunning ? Math.round(totalReq * (1 - metrics.errorRate)) : 500);

    const score = calculateScore({
      totalRequests: totalReq,
      successfulRequests: successReq,
      p95LatencyMs: metrics.p95LatencyMs,
      targetLatencyMs: currentLevel.latencyTargetMs,
      actualCost: metrics.costPerMonth,
      budgetMax: currentLevel.budgetMax,
      incidentUptimeSeconds: stats?.incidentUptimeSeconds ?? 15,
      totalIncidentSeconds: stats?.totalIncidentSeconds ?? 15,
      slaTarget: currentLevel.slaTarget,
      hasDirectClientToStorage,
      hasComputeLayer,
      hasStorageLayer,
      writeRatio: currentLevel.writeRatio ?? 0.20,
    });

    setCurrentScore(score);
    setIsScoreOpen(true);
    if (currentLevel.id !== 'sandbox') {
      const updated = saveLevelProgress(currentLevel.id, score.stars, score.totalScore);
      setProgress(updated);
    }
  };

  const handleRetry = () => {
    resetSimulation();
    loadArchitecture(currentLevel.initialNodes, currentLevel.initialEdges);
    setIsScoreOpen(false);
  };

  const handleLoadReference = () => {
    resetSimulation();
    loadArchitecture(currentLevel.referenceNodes, currentLevel.referenceEdges);
    setIsScoreOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
      <TopBar
        metrics={metrics}
        simulation={simulation}
        levels={ALL_LEVELS}
        currentLevelId={currentLevel.id}
        progress={progress}
        sandboxTrafficRps={sandboxRps}
        sandboxWriteRatio={sandboxWriteRatio}
        onSetSandboxTrafficRps={setSandboxRps}
        onSetSandboxWriteRatio={setSandboxWriteRatio}
        onSelectLevel={handleSelectLevel}
        onResetProgress={handleResetProgress}
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
        level={currentLevel}
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
