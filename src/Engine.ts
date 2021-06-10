interface ITouchEvent {
  (e: TouchEvent): void;
}

interface IEventListener {
  touchStart: ITouchEvent[];
  touchEnd: ITouchEvent[];
}
type TEventName = 'touchStart' | 'touchEnd';

type ResourcesUrl = string[];

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

  static async loadResource(
    resources: ResourcesUrl,
    callback?: {
      (progress: number): void;
    }
  ): Promise<ResourcesUrl> {
    return await new Promise<ResourcesUrl>((resolve, reject) => {
      const total: number = Object.keys(resources).length;
      const _resources: ResourcesUrl = [];
      const load = async src => {
        try {
          const res = await fetch(src);
          const blob = await res.blob();
          _resources.push(window.URL.createObjectURL(blob));
          const { length } = _resources;
          if (length === total) {
            resolve(_resources);
          } else {
            callback && callback(Math.floor((length / total) * 10000) / 100);
          }
        } catch (e) {
          reject(e);
        }
      };
      resources.forEach(load);
    });
  }
}

export default Engine;
