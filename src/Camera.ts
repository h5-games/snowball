export interface ICameraConfig {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
}

export interface ICamera {
  left: number;
  top: number;
  width: number;
  height: number;
  update(config: ICameraConfig): ICamera;
}

export default class {
  left: number = 0;
  top: number = 0;
  width: number = 0;
  height: number = 0;

  constructor(config?: ICameraConfig) {
    config && Object.assign(this, config);
  }

  update(config: ICameraConfig) {
    Object.assign(this, config);
    return this;
  }
}
