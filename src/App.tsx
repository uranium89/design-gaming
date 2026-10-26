import { useState } from 'react';
import { TopBar } from './components/TopBar/TopBar';
import { SidebarDock } from './components/SidebarDock/SidebarDock';
import { CanvasArea } from './components/CanvasArea/CanvasArea';
import { LiveMetrics, SimulationState } from './types';
import './styles/global.css';

export function App() {
  const [metrics] = useState<LiveMetrics>({
    throughputRps: 20,
    p95LatencyMs: 35,
    costPerMonth: 20,
    budgetLimit: 35,
    errorRate: 0.0,
    activeRequests: 4,
  });

  const [simulation, setSimulation] = useState<SimulationState>({
    isRunning: false,
    speed: 1,
    elapsedSeconds: 0,
  });

  const handleToggleSimulation = () => {
    setSimulation((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const handleSetSpeed = (speed: 1 | 2 | 5) => {
    setSimulation((prev) => ({ ...prev, speed }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
      <TopBar
        metrics={metrics}
        simulation={simulation}
        onToggleSimulation={handleToggleSimulation}
        onSetSpeed={handleSetSpeed}
      />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <SidebarDock />
        <CanvasArea />
      </div>
    </div>
  );
}

export default App;
