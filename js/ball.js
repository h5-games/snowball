import { computedPixe } from './utils.js'

export default class Ball {
  constructor (canvas, config = {}, ratio) {
    const radius = config.radius || 7

    Object.assign(this, {
      radius: computedPixe(radius),
      degree: 0.1,
      degreeSpace: computedPixe(0.14),
      maxDegree: computedPixe(4),
      minDegree: computedPixe(-4),
      left: canvas.width / 2,
      top: 10,
      direction: false,
      space: 1,
      endPosition: canvas.height / 2,
      isCrash: false,
      color: 'red',
      ...config
    })
  }

  move (space, isTouch) {
    let { direction, degree, left, top, maxDegree, minDegree, degreeSpace } = this
    left += degree

    if (isTouch) {
      if (direction) {
        const _degree = degree + degreeSpace
        degree = _degree > maxDegree ? maxDegree : _degree
      } else {
        const _degree = degree - degreeSpace
        degree = _degree < minDegree ? minDegree : _degree
      }
    }

    Object.assign(this, {
      degree,
      left,
      space,
      top: top + space
    })
  }
}
