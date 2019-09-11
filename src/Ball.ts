import Unit from './Unit';

export interface BallInterface {
  left: number;
  top: number;
  radius: number;
  color: string;
  paint: (ctx: CanvasRenderingContext2D) => void;
}

export default class Ball extends Unit<BallInterface> {
  left: 0;
  top: 0;
  radius: 0;
  color: '#d2fdff';

  constructor(config?: BallInterface) {
    super();
    config && Object.assign(this, config);
  }

  paint(ctx) {
    const { color, left, top, radius } = this;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(left, top, radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}
