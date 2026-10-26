import { TopBar } from './components/TopBar/TopBar';
import { SidebarDock } from './components/SidebarDock/SidebarDock';
import { CanvasArea } from './components/CanvasArea/CanvasArea';
import { useSimulation } from './simulation/useSimulation';
import './styles/global.css';

export function App() {
  const { metrics, simulation, toggleSimulation, setSpeed } = useSimulation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
      <TopBar
        metrics={metrics}
        simulation={simulation}
        onToggleSimulation={toggleSimulation}
        onSetSpeed={setSpeed}
      />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <SidebarDock />
        <CanvasArea />
      </div>
    </div>
  );
}

export default App;
