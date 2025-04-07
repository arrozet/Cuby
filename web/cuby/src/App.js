import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Game from './components/Game/Game';
import StartScreen from './components/StartScreen/StartScreen';
import LevelSelect from './components/LevelSelect/LevelSelect';
import { GlobalStyle } from './global.styles';

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartScreen />} />
          <Route path="/levels" element={<LevelSelect />} />
          <Route path="/game/:levelId" element={<Game />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;