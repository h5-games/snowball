export interface BallInterface {
  zIndex: number;
  left: number;
  top: number;
  radius: number;
  color: string;
}

export default class Ball implements BallInterface {
  zIndex: 0;
  left: 0;
  top: 0;
  radius: 0;
  color: '#d2fdff';

  constructor(config?: BallInterface) {
    config && Object.assign(this, config);
  }
}
