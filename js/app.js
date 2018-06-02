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

let engine = {
  fatherEle: {},
  config: {},
  ball: {},
  context: {},
  timer: null,

  init (id, config = {}) {
    this.fatherEle = document.getElementById(id)
    this.config = {
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
    const { canvas } = this

    const ball = new Ball(canvas)
    ball.move()

    this.ball = ball

    this.timer = setInterval(() => {
      this.paintingCanvas()
    }, 30)
  },

  paintingCanvas () {
    const { ball, context, canvas } = this
    const { width: canvasWidth, height: canvasHeight } = canvas
    const { radius, left, top } = ball

    context.clearRect(0, 0, canvasWidth, canvasHeight)
    context.beginPath()
    context.arc(left, top, radius, 0, 2*Math.PI)
    context.fill()
  },

  gameOver () {
    this.ball.clear()
  }
}

engine.init('container')
engine.startGame()
