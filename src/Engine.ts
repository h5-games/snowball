import Scene from './Scene';

interface ITouchEvent {
  (e: TouchEvent): void;
}

interface IEventListener {
  touchStart: ITouchEvent[];
  touchEnd: ITouchEvent[];
}
type TEventName = 'touchStart' | 'touchEnd';

interface EntryResources {
  [resourceName: string]: string;
}

interface OutputResources {
  [resourceName: string]: {
    src: string;
    status: string;
  };
}

class Engine {
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

  addEventListener(eventName: TEventName, event: ITouchEvent) {
    this.eventListener[eventName].push(event);
  }

  removeEventListener(eventName: TEventName, event: ITouchEvent) {
    const index = this.eventListener[eventName].findIndex(
      item => item === event
    );
    delete this.eventListener[eventName][index];
  }

  static Scene = Scene;

  static getActualPixel(px) {
    const devicePixelRatio: number = window.devicePixelRatio || 1;
    return px * devicePixelRatio;
  }

  static async loadResource(
    resources: EntryResources,
    callback?: {
      (progress: number): void;
    }
  ): Promise<OutputResources> {
    const _resources: OutputResources = {};
    const length: number = Object.keys(resources).length;
    for (const key in resources) {
      if (!resources.hasOwnProperty(key)) continue;
      const _length = Object.keys(_resources).length;
      _resources[key] = await new Promise(resolve => {
        const img: HTMLImageElement = new Image();
        const progress = (_length + 1) / length;
        img.src = resources[key];
        const _callback = (status: string) => () => {
          callback && callback(progress);
          resolve({
            src: resources[key],
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
