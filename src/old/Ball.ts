import Unit, { IUnitOffset } from './Unit';

interface IAnimationCallback {
  (): void;
}

export interface IBallConfig {
  visible?: boolean;
  zIndex?: number;
  left?: number;
  top?: number;
  radius?: number;
  speed?: number;
  direction?: number;
  rotateSpeed?: number;
  degree?: number;
  maxDegree?: number;
  minDegree?: number;
}

class Ball extends Unit {
  public left: number = 0;
  public top: number = 0;
  public radius: number = 0;
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

  public animation(callback?: IAnimationCallback) {
    window.clearInterval(this.animationTimer);
    this.animationTimer = setInterval(() => {
      const {
        direction,
        degree,
        speed,
        rotateSpeed,
        maxDegree,
        minDegree
      } = this;
      // const _degree = degree - rotateSpeed * direction;
      // this.degree = _degree > maxDegree ? maxDegree : _degree < minDegree ? minDegree : _degree;

      this.top += speed;
      // this.left += (Math.tan(this.degree * Math.PI/180) * speed);
      callback && callback();
    }, 20);
  }

  public stopAnimation() {
    window.clearInterval(this.animationTimer);
  }

  public paint(ctx: CanvasRenderingContext2D, offset: IUnitOffset) {
    const { radius } = this;
    ctx.beginPath();
    ctx.fillStyle = '#d2fdff';
    ctx.arc(offset.left, offset.top, radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

export default Ball;
