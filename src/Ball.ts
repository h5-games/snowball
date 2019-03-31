/// <reference path="index.d.ts"/>
import { computedPixe } from './utils';

export default class Ball implements BallInterface {
  left = 0;
  top = 0;
  direction = true;
  radius = 0;
  color = '#d2fdff';
  degree = 0;
  maxDegree = 50;
  minDegree = -50;

  constructor(config: BallConfigInterface) {
    Object.assign(this, config)
  }

  move({ isTouch, space }) {
    const { direction, degree, maxDegree, minDegree } = this;

    if (isTouch) {
      const _direction = direction ? 1 : -1;
      const _degree = degree - computedPixe(1) * _direction;
      this.degree = _degree > maxDegree ? maxDegree : _degree < minDegree ? minDegree : _degree; 
    }

    this.top += space;
    this.left += (Math.tan(this.degree * Math.PI/180) * space);
  }
}
