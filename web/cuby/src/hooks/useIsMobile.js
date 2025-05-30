import { useState, useEffect } from 'react';

/**
 * Hook para detectar si el dispositivo es móvil
 * @returns {boolean} true si es móvil, false si es escritorio
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      // Verificar por ancho de pantalla (hasta 1024px consideramos móvil)
      const isSmallScreen = window.innerWidth <= 1024;
      
      // Verificar si tiene capacidades táctiles
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Verificar user agent para dispositivos móviles conocidos
      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Considerar móvil si cumple al menos una condición (pantalla pequeña es la más importante)
      const mobile = isSmallScreen || (isTouchDevice && isMobileUserAgent);
      
      setIsMobile(mobile);
    };

    // Verificar al cargar
    checkIsMobile();

    // Verificar cuando cambie el tamaño de ventana
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};
