/**
 * Define los colores base del juego
 */
export const GameColors = {
  DEFAULT: 'white',
  INVERSED: 'black',
};

/**
 * Determina si un elemento está activo basado en su color y el estado de inversión
 * @param {string} elementColor - Color del elemento ('white' o 'black')
 * @param {boolean} isInverted - Estado de inversión del juego
 * @returns {boolean} - true si el elemento está activo
 */
export const isElementActive = (elementColor, isInverted) => {
  const activeColor = isInverted ? GameColors.INVERSED : GameColors.DEFAULT;
  return elementColor === activeColor;
};

/**
 * Obtiene el color activo actual basado en el estado de inversión
 * @param {boolean} isInverted - Estado de inversión del juego
 * @returns {string} - Color activo ('white' o 'black')
 */
export const getActiveColor = (isInverted) => {
  return isInverted ? GameColors.INVERSED : GameColors.DEFAULT;
};

/**
 * Obtiene el color inactivo actual basado en el estado de inversión
 * @param {boolean} isInverted - Estado de inversión del juego
 * @returns {string} - Color inactivo ('white' o 'black')
 */
export const getInactiveColor = (isInverted) => {
  return isInverted ? GameColors.DEFAULT : GameColors.INVERSED;
};