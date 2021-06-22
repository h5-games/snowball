interface Callback {
  (timestamp: number): boolean | unknown;
}

export class Animation {
  constructor(public callback: Callback) {}

  timer: number;
  status: 'animation' | 'stationary' = 'stationary';
  startTime: number | undefined;
  start(timeout?: number) {
    this.status = 'animation';
    this.timer = window.requestAnimationFrame(timestamp => {
      const { startTime } = this;
      if (startTime === undefined) {
        this.startTime = timestamp;
      }
      if (typeof timeout === 'number' && timestamp - startTime > timeout) {
        return this.stop();
      }

      const keep = this.callback(timestamp);
      if (keep === false) {
        return this.stop();
      }
      this.start(timeout);
    });
  }

  stop() {
    this.status = 'stationary';
    this.startTime = undefined;
    window.cancelAnimationFrame(this.timer);
  }
}
