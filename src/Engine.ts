import Camera, { ICameraConfig, ICamera } from './Camera';
import Scene from './Scene';

interface IUnits {
  [type: string]: any;
}

interface ITouchEvent {
  (e: TouchEvent): void
}

interface IEventListener {
  touchStart: ITouchEvent[];
  touchEnd: ITouchEvent[];
}

interface IUnitConstructor<T, U> {
  new(config?: U): T
}

type TEventName = 'touchStart' | 'touchEnd';

export interface IResources {
  [resourceName: string]: {
    src: string;
    status?: string;
  }
}

class Engine {
  public units: IUnits = new Set();
  public cameras: ICamera[] = [];

  public eventListener: IEventListener = {
    touchStart: [],
    touchEnd: []
  };

  constructor(public container: HTMLElement) {
    container.style.position = 'relative';

    container.addEventListener('touchstart', e => {
      this.eventListener['touchStart'].forEach(event => event(e));
    });

    container.addEventListener('touchend', e => {
      this.eventListener['touchEnd'].forEach(event => event(e));
    });
  }

  public addEventListener(
    eventName: TEventName,
    event: ITouchEvent
  ) {
    this.eventListener[eventName].push(event);
  }

  public removeEventListener(
    eventName: TEventName,
    event: ITouchEvent
  ) {
    const index = this.eventListener[eventName].findIndex(item => item === event);
    delete this.eventListener[eventName][index];
  }

  public createUnit<T, U>(UnitConstructor: IUnitConstructor<T, U>, config?: U): T {
    const id = this.units.length + 1;
    const unit = new UnitConstructor({
      ...config,
      id
    });
    this.units[id] = unit;
    this.units.length = id;
    return unit;
  }

  public deleteUnit(id: string): void {
    delete this.units[id];
  }

  public createCamera(config?: ICameraConfig): ICamera {
    const camera = new Camera(this, config);
    camera.paint(this);
    this.cameras.push(camera);
    return camera;
  }

  static Scene = Scene;

  static getActualPixel(px) {
    const devicePixelRatio: number = window.devicePixelRatio || 1;
    return px * devicePixelRatio;
  }

  static async loadResource(
    resources: IResources,
    callback?: {
      (progress: number): void
    }
  ): Promise<IResources> {
    let _resources: IResources = {};
    const length: number = Object.keys(resources).length;
    for (let key in resources) {
      if (!resources.hasOwnProperty(key)) continue;
      const _length = Object.keys(_resources).length;
      _resources[key] = await new Promise(resolve => {
        const img: HTMLImageElement = new Image();
        const progress = (_length + 1) / length;
        img.src = resources[key].src;
        const _callback = (status: string) => () => {
          callback && callback(progress);
          resolve({
            ...resources[key],
            status
          });
        };
        img.onload = _callback('resolve');
        img.onerror = _callback('reject');
      });
    }
    return _resources;
  }
}

export default Engine;
