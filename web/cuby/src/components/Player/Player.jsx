import React from 'react';

const Player = ({ x, y, size, isInverted }) => {
  return (
    <div style={{
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      left: `${x}px`,
      top: `${y}px`,
      backgroundColor: isInverted ? 'white' : 'black',
      transition: 'background-color 0.3s'
    }} />
  );
};

export default Player;