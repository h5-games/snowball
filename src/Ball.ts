/// <reference path="index.d.ts"/>

export default class Ball implements BallInterface {
  left = 0;
  top = 0;
  direction = true;
  radius = 0;
  color = '#b7e8e8';

  constructor(config: BallConfigInterface) {
    (<any>Object).assign(this, config)
    console.log(this);
  }
}
