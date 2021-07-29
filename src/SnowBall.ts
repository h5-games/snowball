interface SnowBallTail {
  left: number;
  top: number;
  degree: number;
}

export default class SnowBall {
  left: number = 0;
  top: number = 0;
  radius: number = 0;
  angle: number = 0;
  distance: number = 0;
  tailList: Array<SnowBallTail> = [];

  constructor(config: Partial<SnowBall>) {
    Object.assign(this, config);
  }

  public move(distance: number) {
    this.top += distance;
  }

  public render(ctx: CanvasRenderingContext2D) {
    const { radius, left, top } = this;

    ctx.beginPath();
    ctx.fillStyle = '#d2fdff';
    ctx.arc(left, top, radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}
