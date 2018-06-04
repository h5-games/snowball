class Ball {
  constructor (canvas, config = {}) {
    this.canvas = canvas
    const left = canvas.width / 2
    const top = canvas.height / 10

    Object.assign(this, {
      radius: 9,
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
      width: 6,
      height: 10,
      speed: 10,
      space: 1,
      ...config
    })
  }
}

const engine = {
  fatherEle: {},
  config: {},
  ball: {},
  ballEndPosition: 0,
  terrLists: {},
  canvas: {},
  context: {},
  timer: null,
  hasStart: false,
  ballSpace: 1,
  terrSpace: 0,
  level: 2,
  point: 0,
  pointTimer: null,
  tailLists: [],
  position: 0,

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

    Object.assign(this, {
      ballEndPosition: canvas.height / 2,
      canvas,
      context: canvas.getContext('2d')
    })

    this.initGame()
  },

  initGame () {
    const { canvas, config } = this
    const { terrNum } = config
    const terrLists = {}

    const ball = new Ball(canvas)

    for (let i = 0; i < terrNum; i++) {
      const terr = new Terr(canvas, {
        top: Math.floor(Math.random() * (canvas.height - 100) + 100)
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
      this.position += 1
      const { terrLists, ball, terrNum, tailLists } = this

      for (let i = 0; i < terrNum - Object.keys(terrLists).length; i++) {
        const terr = new Terr(canvas, {
          top: Math.floor(Math.random() * canvas.height + canvas.height)
        })
        terrLists[terr.id] = terr
      }

      tailLists.unshift({
        left: ball.left,
        top: ball.top
      })
      tailLists.splice(30)

      this.paintCanvas()
    }, 20)

    clearInterval(this.pointTimer)
    this.pointTimer = setInterval(() => {
      const point = this.point + 1
      this.point = point
      this.level = 1 + point / 500
    }, 20)
  },

  paintCanvas () {
    const { ball, context, canvas, terrLists, tailLists, position } = this
    const { width: canvasWidth, height: canvasHeight } = canvas
    const { radius: ballRadius, left: ballLeft, top: ballTop } = ball

    context.clearRect(0, 0, canvasWidth, canvasHeight)
    context.beginPath()
    context.arc(ballLeft, ballTop - position, ballRadius, 0, 2 * Math.PI)
    context.fill()

    for (let key in terrLists) {
      const terr = terrLists[key]
      const { left: terrLeft, top: terrTop, width: terrWidth, height: terrHeight } = terr
      context.beginPath()
      context.fillRect(terrLeft, terrTop - position, terrWidth, terrHeight)
    }

    context.beginPath()
    for (let i = 0; i < tailLists.length; i++) {
      const tail = tailLists[i]
      context.lineTo(tail.left, tail.top - position)
    }
    // context.closePath()
    context.stroke()
  },

  gameOver () {
    this.ball.clear()
  }
}

engine.init('container')
