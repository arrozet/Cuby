import React, { createContext, useState, useContext } from 'react';

/**
 * CONTEXT API EN REACT
 * 
 * ¿Qué es un Contexto?
 * Un Contexto en React es un mecanismo que permite compartir datos entre componentes
 * sin tener que pasar props manualmente a través de cada nivel del árbol de componentes.
 * Funciona como un "estado global" pero controlado y encapsulado.
 * 
 * Estructura del patrón Context:
 * - createContext(): Crea el objeto de contexto
 * - Provider: Componente que envuelve a otros y les proporciona acceso al contexto
 * - useContext(): Hook que permite a los componentes funcionales consumir el contexto
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