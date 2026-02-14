import { h, render } from 'preact';
import { useState, useCallback } from 'preact/hooks';
import { Sidebar, Header, SettingsPanel } from './panels/Layout';
import { ErrorHandler } from './utils/errorHandler';
import { showErrorToast } from './components/Toast';
import './styles/base.css';

ErrorHandler.init();

window.showErrorToast = showErrorToast;

const panels = {
  toolPanel: () => <div class="panel">Tool Panel</div>,
  textPanel: () => <div class="panel">Text Panel</div>,
  pptPanel: () => <div class="panel">PPT Panel</div>,
  refinerPanel: () => <div class="panel">Refiner Panel</div>,
  theoryPanel: () => <div class="panel">Theory Panel</div>,
  settingsPanel: SettingsPanel,
};

function App() {
  const [currentPanel, setCurrentPanel] = useState('toolPanel');
  
  const handlePanelChange = useCallback((panel: string) => {
    setCurrentPanel(panel);
  }, []);
  
  const PanelComponent = panels[currentPanel as keyof typeof panels] || panels.toolPanel;
  
  return (
    <div class="app">
      <Sidebar currentPanel={currentPanel} onPanelChange={handlePanelChange} />
      <main class="main-content">
        <PanelComponent />
      </main>
    </div>
  );
}

render(<App />, document.body);
