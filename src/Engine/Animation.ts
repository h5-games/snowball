interface Callback {
  (timestamp: number): boolean | unknown;
}

interface AnimationEvent {
  (animation: Animation): void;
}

type AnimationEvents = Array<[AnimationEvent, number]>;

export class Animation {
  constructor(public callback: Callback) {}

  timer: number = 0;
  status: 'animation' | 'stationary' = 'stationary';
  startTime: number = 0;
  prevTime: number = 0;
  start(timeout?: number) {
    this.status = 'animation';
    this.startTime = 0;
    const animation = (timestamp: number) => {
      let { startTime } = this;
      if (startTime === 0) {
        startTime = timestamp;
        this.startTime = startTime;
      }
      if (typeof timeout === 'number' && timestamp - startTime > timeout) {
        return this.stop();
      }

      {
        const { evnets, prevTime } = this;
        const millisecond = timestamp - startTime;
        const prevMillisecond = prevTime - startTime;

        for (const [event, stepMillisecond] of evnets) {
          const step = Math.floor(millisecond / stepMillisecond);
          const prevStep = Math.floor(prevMillisecond / stepMillisecond);
          if (step !== prevStep) {
            event(this);
          }
        }
      }

      const keep = this.callback(timestamp);
      if (keep === false) {
        return this.stop();
      }
      this.prevTime = timestamp;
      this.timer = window.requestAnimationFrame(animation);
    };
    this.timer = window.requestAnimationFrame(animation);
  }

  stop() {
    this.status = 'stationary';
    window.cancelAnimationFrame(this.timer);
  }

  evnets: AnimationEvents = [];
  /**
   * @description 增加事件，让动画执行时每隔多少毫秒执行一次事件
   * @param event 事件
   * @param millisecond 毫秒
   */
  bind(event: AnimationEvent, millisecond: number) {
    this.evnets.push([event, millisecond]);
  }

  remove(event: AnimationEvent) {
    const index = this.evnets.findIndex(e => e[0] === event);
    if (index >= 0) {
      this.evnets.splice(index, 1);
    }
  }
}
