export default class Ball {
  constructor (canvas, config = {}) {
    const left = canvas.width / 2
    const top = 6

    Object.assign(this, {
      radius: 7,
      degree: 0.1,
      maxDegree: 3,
      minDegree: -3,
      left,
      top,
      direction: false,
      space: 1,
      endPosition: canvas.height / 2,
      hasDown: false,
      ...config
    })
  }

  tabDirection (e) {
    const { direction, hasDown } = this
    if (e && e.type === 'touchstart') {
      this.direction = !direction
    }
    this.hasDown = !hasDown
  }

  move (space) {
    let { direction, degree, left, top, hasDown, maxDegree, minDegree } = this
    left += degree

    if (hasDown) {
      if (direction) {
        const _degree = degree + 0.1
        degree = _degree > maxDegree ? maxDegree : _degree
      } else {
        const _degree = degree - 0.1
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
