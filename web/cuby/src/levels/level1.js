/**
 * Level 1: Introduction
 * 
 * Estructura del nivel tutorial que introduce los conceptos básicos del juego:
 * - Plataformas en blanco y negro
 * - Un obstáculo (pico)
 * - Un trampolín
 * - Un par de portales
 * - Una meta a alcanzar
 */
export const level1 = {
  name: "Level 1: Introduction",
  
  /**
   * Plataformas del nivel
   * Cada plataforma tiene:
   * - Posición (x, y)
   * - Dimensiones (width, height)
   * - Color (black/white) - Solo son sólidas las del color actual
   */
  platforms: [
    // Suelo principal (tiene versión en ambos colores)
    { x: 0, y: 550, width: 800, height: 50, color: 'white' },
    { x: 0, y: 550, width: 800, height: 50, color: 'black' },
    
    // Plataforma izquierda (negra)
    { x: 100, y: 350, width: 150, height: 20, color: 'black' },
    
    // Plataforma flotante central (blanca)
    { x: 350, y: 300, width: 100, height: 20, color: 'white' },
    
    // Plataforma vertical bloqueante (ambos colores)
    { x: 550, y: 50, width: 20, height: 200, color: 'black' },
    { x: 550, y: 50, width: 20, height: 200, color: 'white' },
    
    // Plataforma derecha (ambos colores)
    { x: 550, y: 250, width: 150, height: 20, color: 'black' },
    { x: 550, y: 250, width: 150, height: 20, color: 'white' },
    
    // Pared derecha (ambos colores)
    { x: 700, y: 250, width: 20, height: 300, color: 'white' },
    { x: 700, y: 250, width: 20, height: 300, color: 'black' },
  ],

  /**
   * Obstáculos que hacen daño al jugador
   * Los picos reinician la posición del jugador al tocarlos
   */
  obstacles: [
    // Pico (negro)
    { x: 500, y: 530, width: 50, height: 20, type: 'spike', color: 'black' },
  ],

  /**
   * Trampolines que impulsan al jugador hacia arriba
   * La fuerza es negativa porque el eje Y crece hacia abajo
   */
  trampolines: [
    // Trampolín (blanco)
    { x: 300, y: 530, width: 50, height: 20, color: 'white', force: -10000 },
  ],

  /**
   * Portales que teletransportan al jugador
   * Cada portal tiene un destino definido por coordenadas x,y
   */
  portals: [
    // Portal de entrada (negro)
    { x: 150, y: 275, width: 40, height: 60, color: 'black', destination: { x: 600, y: 200 } },
    // Portal de salida (blanco)
    { x: 600, y: 200, width: 40, height: 60, color: 'white', destination: { x: 150, y: 275 } }
  ],

  /**
   * Meta del nivel
   * Al alcanzarla, se completa el nivel
   */
  goal: { x: 720, y: 200, width: 50, height: 50 }
};