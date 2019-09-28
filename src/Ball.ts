import Unit, { IUnitOffset } from './Unit';

interface IanimationCallback {
  (): void
}

export interface IBallConfig {
  visible?: boolean;
  zIndex?: number;
  left?: number;
  top?: number;
  radius?: number;
  color?: string;
  speed?: number;
  direction?: number;
  rotateSpeed?: number;
  degree?: number;
  maxDegree?: number;
  minDegree?: number;
}

export interface IBall {
  left: number;
  top: number;
  radius: number;
  color: string;
  speed: number;
  direction: number;
  rotateSpeed: number;
  degree: number;
  maxDegree: number;
  minDegree: number;
  animationTimer: number;
  animation(callback?: IanimationCallback): void;
  stopAnimation(): void;
  paint(ctx: CanvasRenderingContext2D, offset: IUnitOffset): void;
}

export default class extends Unit implements IBall {
  public left: number = 0;
  public top: number = 0;
  public radius: number = 0;
  public color: string = '#d2fdff';
  public speed: number = 0;
  public direction: number = 1;
  public rotateSpeed: number = 1;
  public degree: number = 0;
  public maxDegree: number = 50;
  public minDegree: number = -50;
  public animationTimer = null;

  constructor(config?: IBallConfig) {
    super();
    config && Object.assign(this, config);
  }

  public animation(callback?: IanimationCallback) {
    const { direction, degree, speed, rotateSpeed, maxDegree, minDegree } = this;

    // const _degree = degree - rotateSpeed * direction;
    // this.degree = _degree > maxDegree ? maxDegree : _degree < minDegree ? minDegree : _degree;

    this.top += speed;
    // this.left += (Math.tan(this.degree * Math.PI/180) * speed);
    callback && callback();
    this.animationTimer = window.requestAnimationFrame(this.animation.bind(this, callback))
  }

  public stopAnimation() {
    window.cancelAnimationFrame(this.animationTimer);
  }

  public paint(ctx: CanvasRenderingContext2D, offset: IUnitOffset) {
    const { color, radius } = this;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(offset.left, offset.top, radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}
