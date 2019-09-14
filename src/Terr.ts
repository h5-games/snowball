import Unit from './Unit';

interface ITrunk {
  width: number;
  height: number;
  left: number;
  top: number;
}

export interface IUnitConfig {
  width?: number;
  height?: number;
  left?: number;
  top?: number;
  trunk?: ITrunk;
  img?: HTMLImageElement;
}

export default class extends Unit {
  public width: number = 0;
  public height: number = 0;
  public left: number = 0;
  public top: number = 0;
  public trunk: ITrunk = {
    width: 0,
    height: 0,
    left: 0,
    top: 0
  }
  public img: HTMLImageElement = null;

  constructor(config?: IUnitConfig) {
    super();
    config && Object.assign(this, config);
  }

  public paint(ctx: CanvasRenderingContext2D) {
    const { width, height, left, top, trunk, img } = this;
    ctx.beginPath();
    ctx.drawImage(img, left, top, width, height);
    ctx.fillStyle = '#333';
    ctx.rect(trunk.left, trunk.top, trunk.width, trunk.height);
    ctx.fill();
  }
}
