import React, { createContext, useState, useContext } from 'react';

/**
 * CONTEXT API EN REACT
 * 
 * ¿Qué es un Contexto?
 * Un Contexto en React es un mecanismo que permite compartir datos entre componentes
 * sin tener que pasar props manualmente a través de cada nivel del árbol de componentes.
 * Funciona como un "estado global" pero controlado y encapsulado.
 * 
 * ¿Por qué usar Context en lugar de variables globales?
 * 
 * 1. Reactividad controlada: A diferencia de las variables globales, los cambios en un contexto
 *    provocan re-renderizados automáticos en los componentes que lo consumen, manteniendo
 *    la UI sincronizada con el estado.
 * 
 * 2. Encapsulamiento: El contexto encapsula tanto los datos como las funciones que los manipulan,
 *    evitando modificaciones no controladas que podrían ocurrir con variables globales.
 * 
 * 3. Testabilidad: Es mucho más fácil hacer tests unitarios cuando la lógica está encapsulada
 *    en un proveedor de contexto que se puede simular (mock) durante las pruebas.
 * 
 * 4. Previene efectos secundarios: Las variables globales pueden ser modificadas desde cualquier
 *    parte de la aplicación, lo que dificulta el seguimiento de los cambios y puede causar bugs difíciles de rastrear.
 * 
 * 5. Mejor mantenibilidad: Al tener un flujo de datos claro y predecible, es más fácil entender
 *    cómo se propaga la información en la aplicación.
 * 
 * Estructura del patrón Context:
 * - createContext(): Crea el objeto de contexto
 * - Provider: Componente que envuelve a otros y les proporciona acceso al contexto
 * - useContext(): Hook que permite a los componentes funcionales consumir el contexto
 * 
 * En este archivo implementamos un contexto para manejar la inversión de colores en la aplicación.
 */

// Crear el contexto para la inversión de colores
const InversionContext = createContext();

// Hook personalizado para acceder al contexto
export const useInversion = () => useContext(InversionContext);

// Proveedor del contexto que envuelve la aplicación
export const InversionProvider = ({ children }) => {
  const [isInverted, setIsInverted] = useState(false);

  // Función para cambiar el estado de inversión
  const toggleInversion = () => {
    setIsInverted(prev => !prev);
  };

  return (
    <InversionContext.Provider value={{ isInverted, toggleInversion }}>
      {children}
    </InversionContext.Provider>
  );
};