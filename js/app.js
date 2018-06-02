class Ball {
  constructor (canvas, config = {}) {
    this.canvas = canvas
    const left = canvas.width / 2
    const top = canvas.height / 10

    Object.assign(this, {
      radius: 10,
      speed: 100,
      left,
      top,
      ...config
    })
  }

  move () {
    let { speed } = this

    this.timer = setInterval(() => {
      this.top += 1
    }, speed)
  }

  clear () {
    clearInterval(this.timer)
  }
}

class Terr {
  constructor (canvas, config = {}) {
    this.canvas = canvas
    const left = canvas.width / 2
    const top = canvas.height / 2
    const id = Math.floor(Math.random() * 8999999 + 1000000)

    Object.assign(this, {
      id,
      left,
      top,
      ...config
    })
  }
}

let engine = {
  fatherEle: {},
  config: {},
  ball: {},
  terrLists: {},
  canvas: {},
  context: {},
  timer: null,

  init (id, config = {}) {
    this.fatherEle = document.getElementById(id)
    this.config = {
      terrNum: 1,
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
  },

  startGame () {
    const { canvas, config } = this
    const { terrNum } = config

    const ball = new Ball(canvas)
    ball.move()

    this.ball = ball

    for (let i = 0; i < terrNum; i++) {
      const terr = new Terr(canvas)
      this.terrLists[terr.id] = terr
    }

    this.timer = setInterval(() => {
      this.paintCanvas()
    }, 30)
  },

  paintCanvas () {
    const { ball, context, canvas, terrLists } = this
    const { width: canvasWidth, height: canvasHeight } = canvas
    const { radius: ballRadius, left: ballLeft, top: ballTop } = ball

    context.clearRect(0, 0, canvasWidth, canvasHeight)
    context.beginPath()
    context.arc(ballLeft, ballTop, ballRadius, 0, 2*Math.PI)
    context.fill()

    for (key in terrLists) {
      const terr = terrLists[key]
      const { left: terrLeft, top: terrTop } = terr
      context.beginPath()
      context.fillRect(terrLeft, terrTop, 10, 10)
    }
  },

  gameOver () {
    this.ball.clear()
  }
}

engine.init('container')
engine.startGame()
