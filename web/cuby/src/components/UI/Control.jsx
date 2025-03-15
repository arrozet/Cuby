import React from 'react';

const Controls = () => {
  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '10px 15px',
      borderRadius: '5px',
      fontFamily: 'monospace',
      fontSize: '14px',
      zIndex: 100
    }}>
      <p>A/D: Move | Space: Jump | C: Invert Colors</p>
    </div>
  );
};

export default Controls;