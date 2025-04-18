/**
 * Constantes fundamentales del juego
 * Este archivo contiene todas las constantes que definen el comportamiento base del juego
 */

/**
 * Dimensiones del juego
 * Se inicializan con el tamaño de la ventana para un juego responsivo
 */
export let GAME_WIDTH = window.innerWidth;
export let GAME_HEIGHT = window.innerHeight;

/**
 * Física del juego
 */
// La gravedad determina qué tan rápido caen los objetos
// Valor positivo porque en canvas Y aumenta hacia abajo
export const GRAVITY = 5000; // pixels per second squared

// Fuerza del salto (negativa porque salta hacia arriba)
// Adjusted jump force to a more reasonable value
export const JUMP_FORCE = -1150; // pixels per second

// Velocidad de movimiento horizontal
export const MOVEMENT_SPEED = 600;

/**
 * Dimensiones del jugador
 */
// Tamaño del cubo del jugador (ancho y alto son iguales)
export const PLAYER_SIZE = 40;

// Base dimensions for scaling
export const BASE_GAME_WIDTH = 800;
export const BASE_GAME_HEIGHT = 600;

// Add other constants as needed
export const TRAMPOLINE_BOUNCE_FORCE = 800;