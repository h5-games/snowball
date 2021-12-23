import { Renderer } from '.';
import { clearObserverSet, observerSet } from './utils';

interface CameraConfig {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
}

export class Camera {
  left: number = 0;
  top: number = 0;
  width: number = 0;
  height: number = 0;

  constructor(config: CameraConfig | Renderer) {
    if (config instanceof Renderer) {
      // 如果传入的为 Renderer 实例，则相机自动追踪 Render 区域
      this.traceRenderer(config);
      this.observerRenderer = config;
    } else {
      this.update(config);
    }
  }

  // 更新照相机的配置
  update(config: CameraConfig): Camera {
    Object.assign(this, config);
    return this;
  }

  observerRenderer: Renderer | undefined;
  // 追踪 Render 渲染的位置与大小，用于自动绘制出全屏的画面
  traceRenderer(renderer: Renderer): Camera {
    const { translateY, translateX, actualWidth, actualHeight } = renderer;
    Object.assign(this, {
      top: -translateY,
      left: -translateX,
      width: actualWidth,
      height: actualHeight,
      renderer
    });

    // 使用 Object.defineProperty 封住哪个的方法，用来追踪相机位置与大小
    observerSet(renderer, 'translateY', value => {
      this.top = -value;
    });
    observerSet(renderer, 'translateX', value => {
      this.left = -value;
    });
    observerSet(renderer, 'actualWidth', value => {
      this.width = value;
    });
    observerSet(renderer, 'actualHeight', value => {
      this.height = value;
    });

    return this;
  }

  // 取消对 Render 的追踪
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
