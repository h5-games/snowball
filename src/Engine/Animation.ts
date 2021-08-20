interface Callback {
  (timestamp: number): boolean | unknown;
}

export class Animation {
  constructor(public callback: Callback) {}

  timer: number = 0;
  status: 'animation' | 'stationary' = 'stationary';
  startTime: number = 0;
  prevTime: number = 0;
  start(timeout?: number) {
    this.status = 'animation';
    this.timer = window.requestAnimationFrame(timestamp => {
      const { startTime } = this;
      if (startTime === 0) {
        this.startTime = timestamp;
      }
      if (typeof timeout === 'number' && timestamp - startTime > timeout) {
        return this.stop();
      }

      const keep = this.callback(timestamp);
      if (keep === false) {
        return this.stop();
      }
      this.prevTime = timestamp;
      this.start(timeout);
    });
  }

  stop() {
    this.status = 'stationary';
    this.startTime = 0;
    window.cancelAnimationFrame(this.timer);
  }
}
