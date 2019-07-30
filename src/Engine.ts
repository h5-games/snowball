/// <reference path="./Engine.d.ts"/>

class Engine implements EngineD {
  public devicePixelRatio: number;
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  constructor(public container: HTMLElement) {
    const devicePixelRatio: number = window.devicePixelRatio || 1;
    const { offsetWidth, offsetHeight } = container;
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.style.width = `${offsetWidth}px`;
    canvas.style.height = `${offsetHeight}px`;
    canvas.width = offsetWidth * devicePixelRatio;
    canvas.height = offsetHeight * devicePixelRatio;
    container.appendChild(canvas);

    this.devicePixelRatio = devicePixelRatio;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  public async loadResource(
    resources: Array<ResourceD>,
    callback?: {
      (progress: number): void
    }
  ) {
    let _resources: Array<ResourceD> = [];
    for (let i = 0; i < resources.length; i++) {
      const res: ResourceD = await new Promise(resolve => {
        const img: HTMLImageElement = new Image();
        img.src = resources[i].src;
        img.onload = function () {
          callback && callback((i + 1) / resources.length);
          resolve({
            ...resources[i],
            resource: img,
            status: 'resolve'
          });
        };
        img.onerror = function () {
          callback && callback((i + 1) / resources.length);
          resolve({
            ...resources[i],
            resource: img,
            status: 'reject'
          });
        };
      });
      _resources.push(res);
    }
    return _resources;
  }

  static
}

export default Engine;
