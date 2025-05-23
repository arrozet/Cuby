import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Game from './components/Game/Game';
import StartScreen from './components/StartScreen/StartScreen';
import LevelSelect from './components/LevelSelect/LevelSelect';
import Settings from './components/Settings/Settings';
import OrientationWarning from './components/common/OrientationWarning/OrientationWarning';
import { GlobalStyle } from './global.styles';
import { InversionProvider } from './context/InversionContext';
import { SettingsProvider } from './context/SettingsContext';
import UserLevels from './components/UserLevels/UserLevels';
import LevelEditor from './components/LevelEditor/LevelEditor';
import { AudioProvider } from './context/AudioContext';
import { useBackgroundMusic } from './hooks/useBackgroundMusic';

/**
 * HashRouter se utiliza en lugar de BrowserRouter para GitHub Pages.
 * 
 * Normalización de URLs con #:
 * - El navegador trata '/Cuby#/levels' y '/Cuby/#/levels' como idénticos
 * - Todo lo que va después del # (el "hash" o fragmento) es manejado por el navegador
 * - El navegador no envía el fragmento al servidor, permitiendo que React Router
 *   maneje la navegación del lado del cliente
 * 
 * Ejemplo de normalización:
 * http://localhost:3000/Cuby#/levels
 * http://localhost:3000/Cuby/#/levels
 * Ambos son normalizados y funcionan de la misma manera
 */

// Componente interno que usa los hooks después de que los providers estén disponibles
function AppContent() {
  // Activar música de fondo globalmente
  useBackgroundMusic(true);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/levels" element={<LevelSelect />} />
        <Route path="/game/:levelId" element={<Game />} />
        <Route path="/game/user/:levelId" element={<Game />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* Nuevas rutas para el editor de niveles */}
        <Route path="/user-levels" element={<UserLevels />} />
        <Route path="/level-editor/:levelId" element={<LevelEditor />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
}

function App() {  
  return (
    <>
      <GlobalStyle />
      <SettingsProvider>
        <AudioProvider>
          <InversionProvider>
            <AppContent />
          </InversionProvider>
        </AudioProvider>
      </SettingsProvider>
      <OrientationWarning />
    </>
  );
}

export default App;