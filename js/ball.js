export default class Ball {
  constructor (canvas, config = {}) {
    this.canvas = canvas
    const left = canvas.width / 2
    const top = canvas.height / 8

    Object.assign(this, {
      radius: 6,
      speed: 10,
      degree: 0.1,
      left,
      top,
      direction: false,
      space: 1,
      endPosition: canvas.height / 2,
      ...config
    })
  }

  move (e) {
    const { speed, direction } = this
    if (e && e.type === 'touchstart') {
      this.direction = !direction
      this.degree = 0.1
      this.top += this.space
    }

    clearInterval(this.timer)
    this.timer = setInterval(() => {
      let { direction, top, left, degree, space } = this
      if (direction) {
        left += degree
      } else {
        left -= degree
      }

      top += space

      if (e && e.type === 'touchstart') {
        if (degree <= 5) {
          degree += 0.05
        }
      }

      Object.assign(this, {
        top,
        left,
        degree
      })
    }, speed)
  }

  clearTimer () {
    clearInterval(this.timer)
  }
}
