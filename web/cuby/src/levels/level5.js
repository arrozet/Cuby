import { Platform, Spike, Trampoline, Portal, Goal } from '../components/GameElements/GameElements';

export const level5 = {
  name: "El Enigma de los Portales",
  playerStart: { x: 60, y: 500 }, // Abajo a la izquierda

  platforms: [
    // --- Delimitación Exterior (Bordes del Nivel) ---
    new Platform({ x: 0, y: 550, width: 800, height: 50, color: 'black' }),
    new Platform({ x: 0, y: 550, width: 800, height: 50, color: 'white' }),
    new Platform({ x: 0, y: 0, width: 800, height: 20, color: 'black' }),
    new Platform({ x: 0, y: 0, width: 800, height: 20, color: 'white' }),
    new Platform({ x: 0, y: 20, width: 20, height: 530, color: 'black' }),
    new Platform({ x: 0, y: 20, width: 20, height: 530, color: 'white' }),
    new Platform({ x: 780, y: 20, width: 20, height: 530, color: 'black' }),
    new Platform({ x: 780, y: 20, width: 20, height: 530, color: 'white' }),

    // --- Sección 1: Ascenso Izquierdo (Hacia Portal P1) ---
    // Plataformas iniciales bajas
    new Platform({ x: 20, y: 480, width: 100, height: 20, color: 'black' }),
    new Platform({ x: 150, y: 450, width: 80, height: 20, color: 'white' }),
    new Platform({ x: 20, y: 400, width: 100, height: 20, color: 'black' }),
    // Subida vertical con cambios de color
    new Platform({ x: 150, y: 350, width: 20, height: 100, color: 'white' }), // Pared para saltar
    new Platform({ x: 100, y: 320, width: 50, height: 20, color: 'black' }),
    new Platform({ x: 20, y: 280, width: 80, height: 20, color: 'white' }),
    new Platform({ x: 130, y: 230, width: 80, height: 20, color: 'black' }),
    new Platform({ x: 20, y: 180, width: 80, height: 20, color: 'white' }),
    // Plataforma del Portal P1 (arriba izquierda)
    new Platform({ x: 20, y: 100, width: 100, height: 20, color: 'black' }), 

    // --- Sección 2: Laberinto Central (Hacia Portal P2) ---
    // Fila inferior-media
    new Platform({ x: 250, y: 500, width: 150, height: 20, color: 'white' }),
    new Platform({ x: 430, y: 470, width: 150, height: 20, color: 'black' }),
    new Platform({ x: 280, y: 420, width: 200, height: 20, color: 'white' }),
    // Fila media (con vertical)
    new Platform({ x: 500, y: 350, width: 200, height: 20, color: 'black' }),
    new Platform({ x: 480, y: 280, width: 20, height: 140, color: 'white' }), // Pared vertical divisoria
    new Platform({ x: 300, y: 300, width: 150, height: 20, color: 'black' }),
    // Plataforma del Portal P2 (centro-arriba)
    new Platform({ x: 350, y: 150, width: 100, height: 20, color: 'white' }),
    new Platform({ x: 350, y: 170, width: 20, height: 100, color: 'black' }),//Soporte P2

    // --- Sección 3: Zona Inferior Derecha (Destino de P1) ---
    new Platform({ x: 600, y: 500, width: 180, height: 20, color: 'black' }), // Plataforma de llegada P1
    new Platform({ x: 700, y: 450, width: 20, height: 50, color: 'white' }), // Pequeña subida
    new Platform({ x: 600, y: 400, width: 100, height: 20, color: 'black' }), // Salida de esta zona

    // --- Sección 4: Zona Superior Derecha (Pre-Meta, Destino de P2) ---
    new Platform({ x: 600, y: 120, width: 180, height: 20, color: 'black' }), // Plataforma de llegada P2
    new Platform({ x: 650, y: 80, width: 100, height: 20, color: 'white' }), // Última plataforma antes de la meta
  ],

  obstacles: [
    // Sección 1 (Ascenso Izquierdo)
    new Spike({ x: 160, y: 430, color: 'white' }),
    new Spike({ x: 50, y: 380, color: 'black' }),
    new Spike({ x: 140, y: 210, color: 'black' }),
    new Spike({ x: 40, y: 160, color: 'white' }),

    // Sección 2 (Laberinto Central)
    new Spike({ x: 300, y: 480, color: 'white' }),
    new Spike({ x: 480, y: 450, color: 'black' }),
    new Spike({ x: 400, y: 280, color: 'black' }),
    new Spike({ x: 550, y: 330, color: 'black' }),

    // Sección 3 (Destino P1 - Inferior Derecha)
    new Spike({ x: 650, y: 480, color: 'black' }),
    new Spike({ x: 620, y: 380, color: 'black' }),

    // Sección 4 (Pre-Meta)
    new Spike({ x: 620, y: 100, color: 'black' }),
    new Spike({ x: 720, y: 60, color: 'white' }),
  ],

  trampolines: [
    // Trampolín para alcanzar una plataforma alta en Sección 2 o complicar un salto
    new Trampoline({ x: 740, y: 350, width: 30, height: 20, color: 'black', force: -1100 }),
    // Trampolín escondido para un atajo muy difícil en Sección 1
    new Trampoline({ x: 40, y: 305, width: 30, height: 15, color: 'white', force: -1350 }),
  ],

  portals: [
    // Portal P1: Izquierda arriba. Lleva a la sección inferior derecha (más desafíos).
    new Portal({ x: 50, y: 60, width: 40, height: 40, color: 'black', destination: { x: 680, y: 460 }, portalId: 1 }),
    // Portal P2: Centro-arriba. Lleva a la zona pre-meta.
    new Portal({ x: 400, y: 115, width: 40, height: 40, color: 'white', destination: { x: 620, y: 80 }, portalId: 2 }),
  ],

  goal: new Goal({ x: 740, y: 40, width: 30, height: 30 }) // Meta final, pequeña y protegida
};