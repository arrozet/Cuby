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
export const GRAVITY = 1500;

// Fuerza del salto (negativa porque salta hacia arriba)
export const JUMP_FORCE = -8000;

// Velocidad de movimiento horizontal
export const MOVEMENT_SPEED = 600;

/**
 * Dimensiones del jugador
 */
// Tamaño del cubo del jugador (ancho y alto son iguales)
export const PLAYER_SIZE = 40;