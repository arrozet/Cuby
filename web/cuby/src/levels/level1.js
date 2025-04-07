import { Platform, Spike, Trampoline, Portal, Goal } from '../components/GameElements/GameElements';

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
    new Platform({ x: 0, y: 550, width: 800, height: 50, color: 'white' }),
    new Platform({ x: 0, y: 550, width: 800, height: 50, color: 'black' }),
    
    // Plataforma izquierda (negra)
    new Platform({ x: 100, y: 350, width: 150, height: 20, color: 'black' }),
    
    // Plataforma flotante central (blanca)
    new Platform({ x: 350, y: 300, width: 100, height: 20, color: 'white' }),
    
    // Plataforma vertical bloqueante (ambos colores)
    new Platform({ x: 550, y: 50, width: 20, height: 200, color: 'black' }),
    new Platform({ x: 550, y: 50, width: 20, height: 200, color: 'white' }),
    
    // Plataforma derecha (ambos colores)
    new Platform({ x: 550, y: 250, width: 150, height: 20, color: 'black' }),
    new Platform({ x: 550, y: 250, width: 150, height: 20, color: 'white' }),
    
    // Pared derecha (ambos colores)
    new Platform({ x: 700, y: 250, width: 20, height: 300, color: 'white' }),
    new Platform({ x: 700, y: 250, width: 20, height: 300, color: 'black' }),
  ],

  /**
   * Obstáculos que hacen daño al jugador
   * Los picos reinician la posición del jugador al tocarlos
   */
  obstacles: [
    // Pico negro (usando tamaño predeterminado)
    new Spike({ x: 500, y: 530, color: 'black' }),
  ],

  /**
   * Trampolines que impulsan al jugador hacia arriba
   * La fuerza es negativa porque el eje Y crece hacia abajo
   */
  trampolines: [
    // Trampolín blanco (usando tamaño y fuerza predeterminados)
    new Trampoline({ x: 300, y: 530, color: 'white' }),
  ],

  /**
   * Portales que teletransportan al jugador
   * Cada portal tiene un destino definido por coordenadas x,y
   */
  portals: [
    // Portal de entrada negro (usando tamaño predeterminado)
    new Portal({ 
      x: 150, 
      y: 275, 
      color: 'black', 
      destination: { x: 600, y: 200 } 
    }),
    // Portal de salida blanco (usando tamaño predeterminado)
    new Portal({ 
      x: 600, 
      y: 200, 
      color: 'white', 
      destination: { x: 150, y: 275 } 
    }),
  ],

  /**
   * Meta del nivel
   * Al alcanzarla, se completa el nivel
   */
  goal: new Goal({ x: 720, y: 200 })
};