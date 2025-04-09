import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Game from './components/Game/Game';
import StartScreen from './components/StartScreen/StartScreen';
import LevelSelect from './components/LevelSelect/LevelSelect';
import OrientationWarning from './components/common/OrientationWarning/OrientationWarning';
import { GlobalStyle } from './global.styles';
import { InversionProvider } from './context/InversionContext';

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
function App() {
  return (
    <>
      <GlobalStyle />
      <OrientationWarning />
      <InversionProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<StartScreen />} />
            <Route path="/levels" element={<LevelSelect />} />
            <Route path="/game/:levelId" element={<Game />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </HashRouter>
      </InversionProvider>
    </>
  );
}

export default App;