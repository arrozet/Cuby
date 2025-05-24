import { Platform, Spike, Trampoline, Goal } from '../components/GameElements/GameElements';

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
export const level2 = {
  name: "2: Producción",
  
  // Posición inicial del jugador en este nivel
  playerStart: {
    x: 50,
    y: 450
  },
  
  /**
   * Plataformas del nivel
   * Cada plataforma tiene:
   * - Posición (x, y)
   * - Dimensiones (width, height)
   * - Color (black/white) - Solo son sólidas las del color actual
   */
  platforms: [
    // Suelo principal (tiene versión en ambos colores)
    new Platform({ x: 0, y: 550, width: 800, height: 50, color: 'black' }),
    new Platform({ x: 0, y: 550, width: 800, height: 50, color: 'white' }),
    
    // Plataforma izquierda (blanca)
    new Platform({ x: 100, y: 350, width: 150, height: 20, color: 'white' }),
    
    // Plataforma flotante central (negra)
    new Platform({ x: 350, y: 300, width: 100, height: 20, color: 'black' }),
    
    // Plataforma vertical bloqueante (ambos colores)
    new Platform({ x: 550, y: 50, width: 20, height: 200, color: 'white' }),
    new Platform({ x: 550, y: 50, width: 20, height: 200, color: 'black' }),
  ],

  /**
   * Obstáculos que hacen daño al jugador
   * Los picos reinician la posición del jugador al tocarlos
   */
  obstacles: [
    // Pico blanco (usando tamaño predeterminado)
    new Spike({ x: 500, y: 530, color: 'white' }),
  ],

  /**
   * Trampolines que impulsan al jugador hacia arriba
   * La fuerza es negativa porque el eje Y crece hacia abajo
   */
  trampolines: [
    // Trampolín negro (usando tamaño y fuerza predeterminados)
    new Trampoline({ x: 300, y: 530, color: 'black' }),
  ],

  // Initialize as empty array to avoid undefined errors
  portals: [],

  /**
   * Meta del nivel
   * Al alcanzarla, se completa el nivel
   */
  goal: new Goal({ x: 720, y: 500 })
};