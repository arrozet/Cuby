import React from 'react';
import Game from './components/Game/Game';
import { GlobalStyle } from './global.styles';

function App() {
  return (
    <>
      <GlobalStyle />
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Cuby</h1>
      <Game />
    </>
  );
}

export default App;
