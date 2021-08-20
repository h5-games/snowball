import { Renderer } from '.';
import { clearObserverSet, observerSet } from './utils';

interface CameraConfig {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  offsetTop?: number;
  offsetLeft?: number;
}

export class Camera {
  left: number = 0;
  top: number = 0;
  width: number = 0;
  height: number = 0;
  offsetTop: number = 0;
  offsetLeft: number = 0;

  constructor(config: CameraConfig | Renderer = {}) {
    if (config instanceof Renderer) {
      // 如果传入的为 Renderer 实例，则相机自动追踪 render 区域
      this.traceRenderer(config);
      this.observerRenderer = config;
    } else {
      this.update(config);
    }
  }

  update(config: CameraConfig): Camera {
    Object.assign(this, config);
    return this;
  }

  observerRenderer: Renderer | undefined;
  traceRenderer(renderer: Renderer): Camera {
    const { translateY, translateX, width, height } = renderer;
    Object.assign(this, {
      top: -translateY,
      left: -translateX,
      width,
      height,
      renderer
    });

    // 追踪相机位置与大小
    observerSet(renderer, 'translateY', value => {
      this.top = -value;
    });
    observerSet(renderer, 'translateX', value => {
      this.left = -value;
    });
    observerSet(renderer, 'width', value => {
      this.width = value;
    });
    observerSet(renderer, 'height', value => {
      this.height = value;
    });

    return this;
  }

  clearTraceRenderer() {
    const { observerRenderer } = this;
    if (!observerRenderer) return;
    const keys: (keyof Renderer)[] = [
      'translateY',
      'translateX',
      'width',
      'height'
    ];
    keys.forEach(key => clearObserverSet(observerRenderer, key));
  }
}
