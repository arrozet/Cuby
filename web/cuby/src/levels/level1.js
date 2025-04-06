export const level1 = {
  name: "Level 1: Introduction",
  platforms: [
    // Ground hay que ponerlo en negro y blanco
    { x: 0, y: 550, width: 800, height: 50, color: 'white' },
    { x: 0, y: 550, width: 800, height: 50, color: 'black' },
    
    // Left platform (black)
    { x: 100, y: 350, width: 150, height: 20, color: 'black' },
    
    // Middle floating platform (white)
    { x: 350, y: 300, width: 100, height: 20, color: 'white' },
    
    // Blocking vertical platform (black)
    { x: 550, y: 50, width: 20, height: 200, color: 'black' },
    { x: 550, y: 50, width: 20, height: 200, color: 'white' },
    
    // Right platform (black)
    { x: 550, y: 250, width: 150, height: 20, color: 'black' },
    { x: 550, y: 250, width: 150, height: 20, color: 'white' },
    
    // Wall (white)
    { x: 700, y: 250, width: 20, height: 300, color: 'white' },
    { x: 700, y: 250, width: 20, height: 300, color: 'black' },
  ],
  obstacles: [
    // Spike (black)
    { x: 500, y: 530, width: 50, height: 20, type: 'spike', color: 'black' },
  ],
  trampolines: [
    // Trampoline (white)
    { x: 300, y: 530, width: 50, height: 20, color: 'white', force: -10000 },
  ],
  portals: [
    // Portal de entrada (negro)
    { x: 150, y: 275, width: 40, height: 60, color: 'black', destination: { x: 600, y: 200 } },
    // Portal de salida (blanco)
    { x: 600, y: 200, width: 40, height: 60, color: 'white', destination: { x: 150, y: 275 } }
  ],
  goal: { x: 720, y: 200, width: 50, height: 50 }
};