interface CameraConfig {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface ICamera extends CameraConfig {
  move(left: number, top: number): ICamera;
}

class Camera implements ICamera {
  left = 0;
  top = 0;
  width = 0;
  height = 0;

  constructor(config?: Partial<CameraConfig>) {
    Object.assign(this, config);
  }

  public move(left, top) {
    this.left = left;
    this.top = top;
    return this;
  }
}

export default Camera;
