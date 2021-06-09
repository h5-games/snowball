interface Callback {
  (timestamp: number): boolean | unknown;
}

export default class {
  timer: number;

  constructor(public callback: Callback) {}

  startTime: number | undefined;
  start(timeout?: number) {
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
    this.startTime = undefined;
    window.cancelAnimationFrame(this.timer);
  }
}
