import { IResource, IUnits } from './types';
import Unit from './Unit';

interface ITouchEvent {
  (e: TouchEvent): void
}

interface IEventListener {
  touchStart: ITouchEvent[];
  touchEnd: ITouchEvent[];
}

class Engine {
  public devicePixelRatio: number = 1;
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public units: IUnits = {};
  public eventListener: IEventListener = {
    touchStart: [],
    touchEnd: []
  };

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

    canvas.addEventListener('touchstart', e => {
      this.eventListener['touchStart'].forEach(event => event(e));
    });

    canvas.addEventListener('touchend', e => {
      this.eventListener['touchEnd'].forEach(event => event(e));
    });
  }

  public createUnit(UnitConstructor: typeof Unit, config?: any): string {
    const _id = config.id ? config.id : `_${Math.floor(Math.random() * 1000000000 + 899909999)}`;
    this.units[_id] = new UnitConstructor(config);
    return _id;
  }

  public deleteUnit(id: string): void {
    delete this.units[id];
  }

  static async loadResource(
    resources: Array<IResource>,
    callback?: {
      (progress: number): void
    }
  ): Promise<Array<IResource>> {
    let _resources: Array<IResource> = [];
    for (let i = 0; i < resources.length; i++) {
      const res: IResource = await new Promise(resolve => {
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

  addEventListener(
    eventName: 'touchStart' | 'touchEnd',
    event
  ) {
    this.eventListener[eventName].push(event);
  }

  removeEventListener(
    eventName: 'touchStart' | 'touchEnd',
    event
  ) {
    const index = this.eventListener[eventName].findIndex(item => item === event);
    delete this.eventListener[eventName][index];
  }

  public paint() {
    const { units, ctx } = this;
    for (let key in units) {
      if (!units.hasOwnProperty(key)) continue;
      units[key].paint && units[key].paint(ctx);
    }
  }

  static animation() {

  }
}

export default Engine;
