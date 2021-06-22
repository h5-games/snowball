interface CameraConfig {
  left: number;
  top: number;
  width: number;
  height: number;
  offsetTop: number;
  offsetLeft: number;
}

export class Camera implements CameraConfig {
  left: number = 0;
  top: number = 0;
  width: number = 0;
  height: number = 0;
  offsetTop: number = 0;
  offsetLeft: number = 0;

  constructor(config?: Partial<CameraConfig>) {
    Object.assign(this, config);
  }

  public update(config: Partial<CameraConfig>): Camera {
    Object.assign(this, config);
    return this;
  }
}
