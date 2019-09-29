import Engine, { IEngine } from './Engine';

export interface ICameraConfig {
  offsetLeft?: number;
  offsetTop?: number;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
}

export interface ICamera {
  offsetLeft: number;
  offsetTop: number;
  left: number;
  top: number;
  width: number;
  height: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  timer: number;
  update(config: ICameraConfig, engine: IEngine): ICamera;
  paint(engine: IEngine): void;
}

export default class {
  public offsetLeft: number = 0;
  public offsetTop: number = 0;
  public left: number = 0;
  public top: number = 0;
  public width: number = 0;
  public height: number = 0;
  public canvas: HTMLCanvasElement = null;
  public ctx: CanvasRenderingContext2D = null;
  public timer: number = null;

  constructor(container: HTMLElement, engine: IEngine, config?: ICameraConfig) {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.style.position = 'absolute';
    container.appendChild(canvas);

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    if (config) {
      this.update(config, engine);
    } else {
      this.animation(engine);
    }
  }

  public animation(engine: IEngine) {
    this.timer = window.requestAnimationFrame(this.animation.bind(this, engine));
    for (let camera of engine.cameras) {
      camera.paint(engine);
    }
  }

  public update(config: ICameraConfig, engine: IEngine) {
    Object.assign(this, config);

    const { width, height, left, top, canvas } = this;

    canvas.style.left = `${left}px`;
    canvas.style.top = `${top}px`;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = Engine.getActualPixel(width);
    canvas.height = Engine.getActualPixel(height);

    window.cancelAnimationFrame(this.timer);
    this.animation(engine);
    return this;
  }

  public paint({ units }: IEngine) {
    const { ctx, canvas, offsetLeft, offsetTop } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let key in units) {
      if (!units.hasOwnProperty(key) || key === 'length') continue;
      const unit = units[key];
      unit.paint && unit.paint(ctx, {
        left: unit.left - offsetLeft,
        top: unit.top + offsetTop
      });
    }
  }
}
