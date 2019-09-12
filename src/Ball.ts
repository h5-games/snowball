import Unit from './Unit';

interface IConfig {
  id?: string;
  left?: number;
  top?: number;
  radius?: number;
  color?: string;
  zIndex?: number;
}

export default class Ball extends Unit {
  left: number = 0;
  top: number = 0;
  radius: number = 20;
  color: string = '#d2fdff';

  constructor(config?: IConfig) {
    super(config);
  }

  paint(ctx: CanvasRenderingContext2D) {
    const { color, left, top, radius } = this;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(left, top, radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}
