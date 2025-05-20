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
export const GRAVITY = 5500; // pixels per second squared (Increased from 5000)

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

/**
 * Constantes para tolerancia de tiempo de salto
 */
// Tiempo durante el cual el jugador puede saltar después de dejar una plataforma
export const COYOTE_TIME_DURATION = 0.05; // seconds (Reduced from 0.12)
// Tiempo durante el cual se almacena en búfer una solicitud de salto
export const JUMP_BUFFER_DURATION = 0.1; // seconds

/**
 * Constantes de niveles
 */
// Número máximo de niveles disponibles en el juego
export const MAX_LEVEL_NUMBER = 2; // Actualizar este valor cuando se añadan nuevos niveles