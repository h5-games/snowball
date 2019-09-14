import Unit from './Unit';

export interface IBallConfig {
  left?: number;
  top?: number;
  radius?: number;
  color?: string;
  zIndex?: number;
}

export default class extends Unit {
  public left: number = 0;
  public top: number = 0;
  public radius: number = 0;
  public color: string = '#d2fdff';

  constructor(config?: IBallConfig) {
    super();
    config && Object.assign(this, config);
  }

  public paint(ctx: CanvasRenderingContext2D) {
    const { color, left, top, radius } = this;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(left, top, radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}
