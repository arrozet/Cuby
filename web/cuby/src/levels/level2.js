import { Platform, Spike, Portal, Goal } from '../components/GameElements/GameElements';

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
  "name": "Dizzymensional",
  "playerStart": {
    "x": 50,
    "y": 450
  },
  "platforms": [
    new Platform({
      "x": 0,
      "y": 550,
      "width": 800,
      "height": 50,
      "color": "black"
    }),
    new Platform({
      "x": 0,
      "y": 550,
      "width": 800,
      "height": 50,
      "color": "white"
    }),
    new Platform({
      "x": 650,
      "y": 52,
      "width": 20,
      "height": 500,
      "color": "white"
    }),
    new Platform({
      "x": 650,
      "y": 52,
      "width": 20,
      "height": 500,
      "color": "black"
    }),
    new Platform({
      "x": 669,
      "y": 245,
      "width": 281,
      "height": 21,
      "color": "white"
    }),
    new Platform({
      "x": 669,
      "y": 245,
      "width": 281,
      "height": 21,
      "color": "black"
    }),
    new Platform({
      "x": 263,
      "y": 52,
      "width": 20,
      "height": 500,
      "color": "white"
    }),
    new Platform({
      "x": 263,
      "y": 52,
      "width": 20,
      "height": 500,
      "color": "black"
    }),
    new Platform({
      "x": 281,
      "y": 246,
      "width": 370,
      "height": 21,
      "color": "white"
    }),
    new Platform({
      "x": 281,
      "y": 246,
      "width": 370,
      "height": 21,
      "color": "black"
    }),
    new Platform({
      "x": -106,
      "y": 247,
      "width": 370,
      "height": 21,
      "color": "white"
    }),
    new Platform({
      "x": -106,
      "y": 247,
      "width": 370,
      "height": 21,
      "color": "black"
    }),
    new Platform({
      "x": 123,
      "y": 440,
      "width": 140,
      "height": 21,
      "color": "white"
    }),
    new Platform({
      "x": 123,
      "y": 440,
      "width": 140,
      "height": 21,
      "color": "black"
    }),
    new Platform({
      "x": 123,
      "y": 143,
      "width": 140,
      "height": 21,
      "color": "white"
    }),
    new Platform({
      "x": 123,
      "y": 143,
      "width": 140,
      "height": 21,
      "color": "black"
    }),
    new Platform({
      "x": 282,
      "y": 143,
      "width": 98,
      "height": 21,
      "color": "white"
    }),
    new Platform({
      "x": 282,
      "y": 143,
      "width": 98,
      "height": 21,
      "color": "black"
    }),
    new Platform({
      "x": 552,
      "y": 144,
      "width": 98,
      "height": 21,
      "color": "white"
    }),
    new Platform({
      "x": 552,
      "y": 144,
      "width": 98,
      "height": 21,
      "color": "black"
    }),
    new Platform({
      "x": 282,
      "y": 441,
      "width": 98,
      "height": 21,
      "color": "white"
    }),
    new Platform({
      "x": 282,
      "y": 441,
      "width": 98,
      "height": 21,
      "color": "black"
    }),
    new Platform({
      "x": 551,
      "y": 442,
      "width": 98,
      "height": 21,
      "color": "white"
    }),
    new Platform({
      "x": 551,
      "y": 442,
      "width": 98,
      "height": 21,
      "color": "black"
    }),
    new Platform({
      "x": 283,
      "y": 334,
      "width": 98,
      "height": 21,
      "color": "white"
    }),
    new Platform({
      "x": 283,
      "y": 334,
      "width": 98,
      "height": 21,
      "color": "black"
    }),
    new Platform({
      "x": 552,
      "y": 335,
      "width": 98,
      "height": 21,
      "color": "white"
    }),
    new Platform({
      "x": 552,
      "y": 335,
      "width": 98,
      "height": 21,
      "color": "black"
    }),
    new Platform({
      "x": 263,
      "y": -36,
      "width": 20,
      "height": 90,
      "color": "white"
    }),
    new Platform({
      "x": 263,
      "y": -36,
      "width": 20,
      "height": 90,
      "color": "black"
    }),
    new Platform({
      "x": 650,
      "y": -36,
      "width": 20,
      "height": 90,
      "color": "white"
    }),
    new Platform({
      "x": 650,
      "y": -36,
      "width": 20,
      "height": 90,
      "color": "black"
    })
  ],
  "obstacles": [
    new Spike({
      "x": 670,
      "y": 226,
      "width": 50,
      "height": 20,
      "color": "white",
      "type": "spike"
    }),
    new Spike({
      "x": 670,
      "y": 226,
      "width": 50,
      "height": 20,
      "color": "black",
      "type": "spike"
    }),
    new Spike({
      "x": 745,
      "y": 226,
      "width": 50,
      "height": 20,
      "color": "white",
      "type": "spike"
    }),
    new Spike({
      "x": 745,
      "y": 226,
      "width": 50,
      "height": 20,
      "color": "black",
      "type": "spike"
    })
  ],
  "trampolines": [],
  "portals": [
    new Portal({
      "x": 167,
      "y": 359,
      "width": 40,
      "height": 60,
      "color": "white",
      "destination": {
        "x": 730,
        "y": 151
      }
    }),
    new Portal({
      "x": 166,
      "y": 472,
      "width": 40,
      "height": 60,
      "color": "black",
      "destination": {
        "x": 24,
        "y": 163
      }
    }),
    new Portal({
      "x": 166,
      "y": 182,
      "width": 40,
      "height": 60,
      "color": "black",
      "destination": {
        "x": 721,
        "y": 135
      }
    }),
    new Portal({
      "x": 164,
      "y": 66,
      "width": 40,
      "height": 60,
      "color": "white",
      "destination": {
        "x": 446,
        "y": 95
      }
    }),
    new Portal({
      "x": 573,
      "y": 68,
      "width": 40,
      "height": 60,
      "color": "white",
      "destination": {
        "x": 728,
        "y": 88
      }
    }),
    new Portal({
      "x": 311,
      "y": 177,
      "width": 40,
      "height": 60,
      "color": "white",
      "destination": {
        "x": 724,
        "y": 121
      }
    }),
    new Portal({
      "x": 302,
      "y": 68,
      "width": 40,
      "height": 60,
      "color": "black",
      "destination": {
        "x": 445,
        "y": 361
      }
    }),
    new Portal({
      "x": 575,
      "y": 179,
      "width": 40,
      "height": 60,
      "color": "black",
      "destination": {
        "x": 747,
        "y": 152
      }
    }),
    new Portal({
      "x": 594,
      "y": 271,
      "width": 40,
      "height": 60,
      "color": "black",
      "destination": {
        "x": 719,
        "y": 380
      }
    }),
    new Portal({
      "x": 593,
      "y": 473,
      "width": 40,
      "height": 60,
      "color": "black",
      "destination": {
        "x": 739,
        "y": 123
      }
    }),
    new Portal({
      "x": 290,
      "y": 368,
      "width": 40,
      "height": 60,
      "color": "black",
      "destination": {
        "x": 738,
        "y": 143
      }
    }),
    new Portal({
      "x": 592,
      "y": 369,
      "width": 40,
      "height": 60,
      "color": "white",
      "destination": {
        "x": 742,
        "y": 129
      }
    }),
    new Portal({
      "x": 288,
      "y": 273,
      "width": 40,
      "height": 60,
      "color": "white",
      "destination": {
        "x": 739,
        "y": 116
      }
    }),
    new Portal({
      "x": 296,
      "y": 475,
      "width": 40,
      "height": 60,
      "color": "white",
      "destination": {
        "x": 742,
        "y": 120
      }
    })
  ],
  "goal": new Goal({
    "x": 700,
    "y": 500,
    "width": 50,
    "height": 50
  }),
  "id": "user_level_1748877816875",
  "created": "2025-06-02T15:23:36.875Z",
  "lastModified": "2025-06-02T15:37:06.292Z"
}