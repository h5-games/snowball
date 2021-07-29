export default class Tree {
  left: number;
  top: number;
  width: number;
  height: number;
  resource: HTMLImageElement;
  interval: number;

  constructor(config: Partial<Tree>) {
    Object.assign(this, config);
  }

  public render(ctx: CanvasRenderingContext2D) {
    const { resource, left, top, width, height } = this;

    ctx.beginPath();
    ctx.drawImage(resource, left, top, width, height);
  }
}
