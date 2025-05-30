import { Platform, Portal, Goal } from '../components/GameElements/GameElements';

export const level3 = {
  name: "lerolero",
  playerStart: { x: 50, y: 450 },
  platforms: [
    new Platform({ x: 0, y: 550, width: 800, height: 50, color: "black" }),
    new Platform({ x: 0, y: 550, width: 800, height: 50, color: "white" }),
    new Platform({ x: 149, y: 262, width: 100, height: 290, color: "white" }),
    new Platform({ x: 149, y: 262, width: 100, height: 290, color: "black" }),
    new Platform({ x: -55, y: 262, width: 205, height: 69, color: "white" }),
    new Platform({ x: -55, y: 262, width: 205, height: 69, color: "black" }),
    new Platform({ x: 427, y: -53, width: 20, height: 500, color: "white" }),
    new Platform({ x: 427, y: -53, width: 20, height: 500, color: "black" }),
    new Platform({ x: 323, y: 309, width: 106, height: 21, color: "white" }),
    new Platform({ x: 323, y: 309, width: 106, height: 21, color: "black" }),
    new Platform({ x: 248, y: 378, width: 106, height: 21, color: "white" }),
    new Platform({ x: 248, y: 378, width: 106, height: 21, color: "black" }),
    new Platform({ x: 342, y: 446, width: 106, height: 21, color: "white" }),
    new Platform({ x: 342, y: 446, width: 106, height: 21, color: "black" }),
    new Platform({ x: 425, y: 445, width: 106, height: 21, color: "white" }),
    new Platform({ x: 425, y: 445, width: 106, height: 21, color: "black" }),
    new Platform({ x: 605, y: 349, width: 106, height: 21, color: "white" }),
    new Platform({ x: 605, y: 349, width: 106, height: 21, color: "black" }),
    new Platform({ x: 447, y: 282, width: 106, height: 21, color: "white" }),
    new Platform({ x: 447, y: 282, width: 106, height: 21, color: "black" }),
    new Platform({ x: 612, y: 175, width: 106, height: 21, color: "white" }),
    new Platform({ x: 612, y: 175, width: 106, height: 21, color: "black" }),
    new Platform({ x: 445, y: 101, width: 106, height: 21, color: "white" }),
    new Platform({ x: 445, y: 101, width: 106, height: 21, color: "black" })
  ],
  obstacles: [],
  trampolines: [],
  portals: [
    new Portal({ x: 77, y: 360, width: 40, height: 60, color: "black", destination: { x: 70, y: 202 } })
  ],
  goal: new Goal({ x: 469, y: 33, width: 50, height: 50 })
};
