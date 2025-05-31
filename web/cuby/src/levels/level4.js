import { Platform, Spike, Trampoline, Portal, Goal } from '../components/GameElements/GameElements';

export const level4 = {
  name: "Rampage",
  playerStart: { x: 728, y: 501 },
  platforms: [
    new Platform({ x: 0, y: 550, width: 800, height: 50, color: "black" }),
    new Platform({ x: 0, y: 550, width: 800, height: 50, color: "white" }),
    new Platform({ x: 342, y: -33, width: 500, height: 447, color: "black" }),
    new Platform({ x: 342, y: -33, width: 500, height: 447, color: "white" }),
    new Platform({ x: -158, y: -33, width: 500, height: 447, color: "black" }),
    new Platform({ x: -158, y: -33, width: 500, height: 447, color: "white" }),
    new Platform({ x: 595, y: 396, width: 36, height: 167, color: "black" }),
    new Platform({ x: 461, y: 396, width: 36, height: 167, color: "white" }),
    new Platform({ x: 116, y: 398, width: 36, height: 167, color: "black" }),
    new Platform({ x: 596, y: 392, width: 36, height: 55, color: "white" }),
    new Platform({ x: 597, y: 512, width: 36, height: 55, color: "white" }),
    new Platform({ x: 345, y: 464, width: 36, height: 87, color: "black" }),
    new Platform({ x: 230, y: 412, width: 36, height: 87, color: "black" }),
    new Platform({ x: 231, y: 464, width: 36, height: 87, color: "white" }),
    new Platform({ x: 115, y: 399, width: 36, height: 164, color: "white" })
  ],
  obstacles: [
    new Spike({ x: 520, y: 531, width: 50, height: 20, color: "white" })
  ],
  trampolines: [
    new Trampoline({ x: 281, y: 532, width: 50, height: 20, color: "black", force: -1700 })
  ],
  portals: [
    new Portal({ x: 178, y: 473, width: 40, height: 60, color: "black", destination: { x: 42, y: 450 } })
  ],
  goal: new Goal({ x: 27, y: 478, width: 50, height: 50 })
}; 