type TMEventType = 'touchStart' | 'touchMove' | 'touchEnd' | 'tap';

interface TMJoinEventOption<T extends TMEventType> {
  type: T;
  pointX: number;
  pointY: number;
  originEvent: any;
}

export interface TMJoinEvent<T extends TMEventType = any> {
  (e: TMJoinEventOption<T>): void;
}

interface IEventListener {
  touchStart: TMJoinEvent<'touchStart'>[];
  touchMove: TMJoinEvent<'touchMove'>[];
  touchEnd: TMJoinEvent<'touchEnd'>[];
  tap: TMJoinEvent<'tap'>[];
}

/**
 * Touch Mouse Event
 * 合并了 PC 及移动端的事件，实现了类似于 click 的 tap 事件。
 */
export class TMEvent {
  constructor(public dom: HTMLCanvasElement) {
    dom.addEventListener('touchstart', this.dispatchTouchEvent('touchStart'));
    dom.addEventListener('touchmove', this.dispatchTouchEvent('touchMove'));
    dom.addEventListener('touchend', this.dispatchTouchEvent('touchEnd'));
    dom.addEventListener('mousedown', this.dispatchMouseEvent('touchStart'));
    dom.addEventListener('mousemove', this.dispatchMouseEvent('touchMove'));
    dom.addEventListener('mouseup', this.dispatchMouseEvent('touchEnd'));
  }

  dispatchMouseEvent(type: TMEventType) {
    return (e: MouseEvent) => {
      const rect = this.dom.getBoundingClientRect();

      const listeners = this._listeners[type] as TMJoinEvent<TMEventType>[];
      const eventOption: TMJoinEventOption<TMEventType> = {
        type,
        pointX: e.clientX - rect.left,
        pointY: e.clientY - rect.top,
        originEvent: e
      };
      listeners.forEach(event => {
        event(eventOption);
      });

      this.bindTapEvent(type, eventOption);
    };
  }

  dispatchTouchEvent(type: TMEventType) {
    return (e: TouchEvent) => {
      e.preventDefault();

      const firstTouch = e.changedTouches[0];
      if (!firstTouch) return;
      const rect = this.dom.getBoundingClientRect();

      const listeners = this._listeners[type] as TMJoinEvent<TMEventType>[];
      const eventOption: TMJoinEventOption<TMEventType> = {
        type,
        pointX: firstTouch.pageX - rect.left,
        pointY: firstTouch.pageY - rect.top,
        originEvent: e
      };
      listeners.forEach(event => {
        event(eventOption);
      });

      this.bindTapEvent(type, eventOption);
    };
  }

  tapStartTime: number = 0;
  bindTapEvent(type: TMEventType, eventOption: TMJoinEventOption<TMEventType>) {
    const currentTime = new Date().getTime();
    if (this.tapStartTime && currentTime - this.tapStartTime < 500) {
      // 500 毫秒内 表示点击事件
      this.dispatchTapEvent('tap', {
        ...eventOption,
        type: 'tap'
      });
      this.tapStartTime = 0;
    }

    if (type === 'touchStart') {
      this.tapStartTime = currentTime;
    }
  }

  dispatchTapEvent(type: 'tap', eventOption: TMJoinEventOption<'tap'>) {
    const listeners = this._listeners[type] as TMJoinEvent<'tap'>[];
    listeners.forEach(event => {
      event(eventOption);
    });
  }

  _listeners: IEventListener = {
    touchStart: [],
    touchMove: [],
    touchEnd: [],
    tap: []
  };

  add(eventName: TMEventType, event: TMJoinEvent<TMEventType>) {
    this._listeners[eventName].push(event);
  }

  remove(eventName: TMEventType, event: TMJoinEvent<TMEventType>) {
    const index = this._listeners[eventName].findIndex(item => item === event);
    delete this._listeners[eventName][index];
  }
}
