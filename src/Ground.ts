import Unit from './Unit';

export interface IGroundConfig {
  zIndex?: number;
  left?: number;
  top?: number;
}

export interface IGround {
  left: number;
  top: number;
  width: number;
  height: number;
}

export default class extends Unit implements IGround {
  public left: number = 0;
  public top: number = 0;
  public width: number = 0;
  public height: number = 0;

  constructor(config?: IGround) {
    super();
    config && Object.assign(this, config);
  }
}
