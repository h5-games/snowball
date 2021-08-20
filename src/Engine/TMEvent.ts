type TMEventType = 'touchStart' | 'touchEnd' | 'tap';

type TTMEvent = TouchEvent | MouseEvent;

interface ITouchEventOption<T> {
  type: TMEventType;
  pointX: number;
  pointY: number;
  originEvent: T;
}
interface ITouchEvent<T> {
  (e: ITouchEventOption<T>): void;
}
type TMJoinEvent = ITouchEvent<TouchEvent> | ITouchEvent<MouseEvent>;

interface IEventListener {
  touchStart: TMJoinEvent[];
  touchEnd: TMJoinEvent[];
  tap: TMJoinEvent[];
}

/**
 * Touch Mouse Event
 * 合并了 PC 及移动端的事件，实现了类似于 click 的 tap 事件。
 */
export class TMEvent {
  constructor(public dom: HTMLCanvasElement) {
    dom.addEventListener('touchstart', this.dispatchTouchEvent('touchStart'));
    dom.addEventListener('touchend', this.dispatchTouchEvent('touchEnd'));
    dom.addEventListener('mousedown', this.dispatchMouseEvent('touchStart'));
    dom.addEventListener('mouseup', this.dispatchMouseEvent('touchEnd'));
  }

  dispatchMouseEvent(type: TMEventType) {
    return (e: MouseEvent) => {
      const rect = this.dom.getBoundingClientRect();

      const listeners = this._listeners[type] as ITouchEvent<MouseEvent>[];
      const eventOption = {
        type,
        pointX: e.clientX - rect.left,
        pointY: e.clientY - rect.top,
        originEvent: e
      };
      listeners.forEach(event => {
        event(eventOption);
      });

      this.bindTapEvent<MouseEvent>(type, eventOption);
    };
  }

  dispatchTouchEvent(type: TMEventType) {
    return (e: TouchEvent) => {
      e.preventDefault();

      const firstTouch = e.changedTouches[0];
      if (!firstTouch) return;
      const rect = this.dom.getBoundingClientRect();

      const listeners = this._listeners[type] as ITouchEvent<TouchEvent>[];
      const eventOption = {
        type,
        pointX: firstTouch.pageX - rect.left,
        pointY: firstTouch.pageY - rect.top,
        originEvent: e
      };
      listeners.forEach(event => {
        event(eventOption);
      });

      this.bindTapEvent<TouchEvent>(type, eventOption);
    };
  }

  tapStartTime: number = 0;
  bindTapEvent<T extends TTMEvent>(
    type: TMEventType,
    eventOption: ITouchEventOption<T>
  ) {
    const currentTime = new Date().getTime();
    if (this.tapStartTime && currentTime - this.tapStartTime < 500) {
      // 500 毫秒内 表示点击事件
      this.dispatchTapEvent<T>('tap', eventOption);
      this.tapStartTime = 0;
    }

    if (type === 'touchStart') {
      this.tapStartTime = currentTime;
    }
  }

  dispatchTapEvent<T extends TTMEvent>(
    type: TMEventType,
    eventOption: ITouchEventOption<T>
  ) {
    const listeners = this._listeners[type] as ITouchEvent<T>[];
    listeners.forEach(event => {
      event(eventOption);
    });
  }

  _listeners: IEventListener = {
    touchStart: [],
    touchEnd: [],
    tap: []
  };

  add(eventName: 'touchStart', event: ITouchEvent<TouchEvent>): void;
  add(eventName: 'touchEnd', event: ITouchEvent<TouchEvent>): void;
  add(eventName: 'tap', event: ITouchEvent<TouchEvent>): void;
  add(eventName: TMEventType, event: TMJoinEvent) {
    this._listeners[eventName].push(event);
  }

  remove(eventName: TMEventType, event: TMJoinEvent) {
    const index = this._listeners[eventName].findIndex(item => item === event);
    delete this._listeners[eventName][index];
  }
}
