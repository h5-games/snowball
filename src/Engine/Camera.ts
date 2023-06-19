import { Renderer } from '.';

interface CameraAttributes {
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

  constructor(attributes: CameraAttributes | Renderer) {
    this.update(attributes);
  }

  // 更新照相机的配置
  update(attributes: CameraAttributes | Renderer): Camera {
    if (attributes instanceof Renderer) {
      // 如果传入的是 Renderer 实例，则相机大小为 Renderer 的大小
      const { actualWidth, actualHeight } = attributes;
      Object.assign(this, {
        width: actualWidth,
        height: actualHeight
      });
    }
    Object.assign(this, attributes);
    return this;
  }
}
