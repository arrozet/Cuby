/**
 * Clase base para todos los elementos del juego
 */
class GameObject {
  constructor({ x, y, width, height, color }) {
    this.x = x;
    this.y = y;
    this.width = width || this.defaultWidth;
    this.height = height || this.defaultHeight;
    this.color = color;
  }
}

/**
 * Plataforma: Elemento básico sobre el que el jugador puede estar
 */
export class Platform extends GameObject {
  static defaultWidth = 200;
  static defaultHeight = 20;

  constructor({ x, y, color, width, height }) {
    super({ x, y, width: width || Platform.defaultWidth, height: height || Platform.defaultHeight, color });
  }
}

/**
 * Obstáculo (Pinchos): Elemento que daña al jugador
 */
export class Spike extends GameObject {
  static defaultWidth = 50;
  static defaultHeight = 20;

  constructor({ x, y, color, width, height }) {
    super({ x, y, width: width || Spike.defaultWidth, height: height || Spike.defaultHeight, color });
    this.type = 'spike';
  }
}

/**
 * Trampolín: Elemento que impulsa al jugador hacia arriba
 */
export class Trampoline extends GameObject {
  static defaultWidth = 50;
  static defaultHeight = 20;
  static defaultForce = -10000;

  constructor({ x, y, color, width, height, force }) {
    super({ x, y, width: width || Trampoline.defaultWidth, height: height || Trampoline.defaultHeight, color });
    this.force = force || Trampoline.defaultForce;
  }
}

/**
 * Portal: Elemento que teletransporta al jugador
 */
export class Portal extends GameObject {
  static defaultWidth = 40;
  static defaultHeight = 60;

  constructor({ x, y, color, width, height, destination }) {
    super({ x, y, width: width || Portal.defaultWidth, height: height || Portal.defaultHeight, color });
    this.destination = destination;
  }
}

/**
 * Meta: Elemento que marca el final del nivel
 */
export class Goal extends GameObject {
  static defaultWidth = 50;
  static defaultHeight = 50;

  constructor({ x, y, width, height }) {
    super({ x, y, width: width || Goal.defaultWidth, height: height || Goal.defaultHeight });
  }
}