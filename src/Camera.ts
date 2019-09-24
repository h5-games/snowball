import { IEngine } from './Engine';

export interface ICameraConfig {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
}

export interface ICamera {
  left: number;
  top: number;
  width: number;
  height: number;
  update(config: ICameraConfig): ICamera;
  paint(engine: IEngine): void;
}

export default class {
  public left: number = 0;
  public top: number = 0;
  public width: number = 0;
  public height: number = 0;

  constructor(config?: ICameraConfig) {
    config && Object.assign(this, config);
  }

  public update(config: ICameraConfig) {
    Object.assign(this, config);
    return this;
  }

  public paint({ units, ctx, canvas }: IEngine) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let key in units) {
      if (!units.hasOwnProperty(key)) continue;
      const unit = units[key];
      if (unit.left < this.left || unit.top < this.top) continue;
      unit.paint && unit.paint(ctx);
    }
  }
}
