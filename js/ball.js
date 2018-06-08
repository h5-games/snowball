export default class Ball {
  constructor (canvas, config = {}) {
    const left = canvas.width / 2
    const top = 6

    Object.assign(this, {
      radius: 7,
      degree: 0.1,
      maxDegree: 4,
      minDegree: -4,
      left,
      top,
      direction: false,
      space: 1,
      endPosition: canvas.height / 2,
      isCrash: false,
      color: '#000',
      ...config
    })
  }

  move (space, isTouch) {
    let { direction, degree, left, top, maxDegree, minDegree } = this
    left += degree

    if (isTouch) {
      if (direction) {
        const _degree = degree + 0.14
        degree = _degree > maxDegree ? maxDegree : _degree
      } else {
        const _degree = degree - 0.14
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
