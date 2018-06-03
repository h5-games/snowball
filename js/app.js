class Ball {
  constructor (canvas, config = {}) {
    this.canvas = canvas
    const left = canvas.width / 2
    const top = canvas.height / 10

    Object.assign(this, {
      radius: 10,
      speed: 10,
      degree: 0.1,
      left,
      top,
      direction: false,
      space: 1,
      ...config
    })
  }

  move (e) {
    const { speed, direction } = this
    if (e && e.type === 'touchstart') {
      this.direction = !direction
      this.degree = 0.1
    }

    clearInterval(this.timer)
    this.timer = setInterval(() => {
      let { direction, top, left, degree, space } = this
      if (direction) {
        left += degree
      } else {
        left -= degree
      }

      if (top < 400) {
        top += space
      }

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

class Terr {
  constructor (canvas, config = {}) {
    this.canvas = canvas
    const left = Math.floor(Math.random() * canvas.width + -10)
    const top = Math.floor(Math.random() * (canvas.height * 2) + canvas.height)
    const id = Math.floor(Math.random() * 8999999 + 1000000)

    Object.assign(this, {
      id,
      left,
      top,
      speed: 10,
      space: 1,
      ...config
    })
  }

  move () {
    const { speed } = this

    clearInterval(this.timer)
    this.timer = setInterval(() => {
      const { space } = this
      this.top -= space
    }, speed)
  }
}

const engine = {
  fatherEle: {},
  config: {},
  ball: {},
  terrLists: {},
  canvas: {},
  context: {},
  timer: null,
  hasStart: false,
  ballSpace: 1,
  terrSpace: 0,

  init (id, config = {}) {
    this.fatherEle = document.getElementById(id)
    this.config = {
      terrNum: 10,
      canvasClassName: 'ball-canvas',
      ...config
    }

    this.createCanvas()
  },

  createCanvas () {
    const { fatherEle, config } = this
    const fatherWidth = fatherEle.offsetWidth
    const fatherHeight = fatherEle.offsetHeight

    const canvas = document.createElement('canvas')

    canvas.width = fatherWidth
    canvas.height = fatherHeight
    canvas.className = config.canvasClassName

    fatherEle.appendChild(canvas)
    this.canvas = canvas
    this.context = canvas.getContext('2d')

    this.initGame()
  },

  initGame () {
    const { canvas, config, terrSpace } = this
    const { terrNum } = config
    const terrLists = {}

    const ball = new Ball(canvas)

    for (let i = 0; i < terrNum; i++) {
      const terr = new Terr(canvas, {
        top: Math.floor(Math.random() * (canvas.height - 100) + 100),
        space: terrSpace
      })
      terrLists[terr.id] = terr
    }

    canvas.addEventListener('touchstart', e => {
      e.preventDefault()
      if (this.hasStart) {

      } else {
        this.startGame()
      }
      ball.move(e)
    })

    canvas.addEventListener('touchend', e => {
      ball.move(e)
    })

    this.ball = ball
    this.terrLists = terrLists

    this.paintCanvas()
  },

  startGame () {
    this.hasStart = true
    this.terrNum = 20

    const { canvas } = this

    clearInterval(this.timer)
    this.timer = setInterval(() => {
      const { terrLists, ball, terrNum, ballSpace, terrSpace } = this

      ball.space = 1 - ball.top / 400
      // todo 将 apace 同步到 ballSpace

      for (let key in terrLists) {
        terrLists[key].move()
      }

      for (let i = 0; i < terrNum - Object.keys(terrLists).length; i++) {
        const terr = new Terr(canvas, {
          top: Math.floor(Math.random() * canvas.height + canvas.height),
          space: terrSpace
        })
        terr.move()
        terrLists[terr.id] = terr
      }

      for (let key in terrLists) {
        let terr = terrLists[key]
        if (terr.top < 0) {
          delete terrLists[key]
          continue
        }
        terr.space = ball.top / 400
      }

      Object.assign(this, {
        terrLists,
        ball,
        ballSpace,
        terrSpace
      })
      this.paintCanvas()
    }, 20)
  },

  paintCanvas () {
    const { ball, context, canvas, terrLists } = this
    const { width: canvasWidth, height: canvasHeight } = canvas
    const { radius: ballRadius, left: ballLeft, top: ballTop } = ball

    context.clearRect(0, 0, canvasWidth, canvasHeight)
    context.beginPath()
    context.arc(ballLeft, ballTop, ballRadius, 0, 2 * Math.PI)
    context.fill()

    for (let key in terrLists) {
      const terr = terrLists[key]
      const { left: terrLeft, top: terrTop } = terr
      context.beginPath()
      context.fillRect(terrLeft, terrTop, 6, 10)
    }
  },

  gameOver () {
    this.ball.clear()
  }
}

engine.init('container')
// engine.startGame()
