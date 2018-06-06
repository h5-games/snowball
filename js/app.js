import Ball from './ball.js'
import Terr from './terr.js'
import { computedBeyond } from './utils.js'
import { levelLists } from './lists.js'

const engine = {
  fatherEle: {},
  config: {},
  ball: {},
  ballEndPosition: 0,
  terrLists: {},
  canvas: {},
  canvasSpace: 0,
  canvasAddSpace: 1.6,
  context: {},
  timer: null,
  hasStart: false,
  ballSpace: 1,
  terrSpace: 0,
  point: 0,
  pointTimer: null,
  tailLists: [],
  position: 0,
  halfCanvasHeight: 0,
  level: 0,

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
      context: canvas.getContext('2d'),
      halfCanvasHeight: fatherHeight / 2
    })

    this.initGame()
  },

  initGame () {
    const { canvas, config } = this
    const { terrNum } = config
    const terrLists = {}
    const minTerrTop = canvas.height / 4

    const ball = new Ball(canvas, {
      top: minTerrTop / 2
    })

    for (let i = 0; i < terrNum; i++) {
      const terr = new Terr(canvas, {
        top: Math.floor(Math.random() * (canvas.height - minTerrTop) + minTerrTop)
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

    const { canvas, halfCanvasHeight, config } = this
    config.terrNum += 20

    clearInterval(this.timer)
    this.timer = setInterval(() => {
      const { terrLists, ball, config, tailLists, canvasAddSpace } = this
      const terrNum = config.terrNum
      let { position, canvasSpace } = this
      const ballTop = ball.top
      canvasSpace = ballTop - position > halfCanvasHeight ? canvasAddSpace : (ballTop - position) / halfCanvasHeight * canvasAddSpace
      position += canvasSpace

      ball.space = canvasAddSpace

      for (let i = 0; i < terrNum - Object.keys(terrLists).length; i++) {
        const terr = new Terr(canvas, {
          top: Math.floor(Math.random() * canvas.height + canvas.height + position)
        })
        terrLists[terr.id] = terr
      }

      for (let key in terrLists) {
        if (terrLists.hasOwnProperty(key)) {
          const terr = terrLists[key]
          if (terr.top < position - halfCanvasHeight) {
            delete terrLists[key]
          }
        }
      }

      tailLists.unshift({
        left: ball.left,
        top: ball.top
      })
      tailLists.splice(60)

      Object.assign(this, {
        position,
        canvasSpace
      })

      this.paintCanvas()
    }, 10)

    clearInterval(this.pointTimer)
    this.pointTimer = setInterval(() => {
      this.addPoint(1)
    }, 100)
  },

  addPoint (addNum) {
    let { point, level } = this

    point += addNum
    this.point = point

    for (let key in levelLists) {
      if (levelLists.hasOwnProperty(key) && point > key && levelLists[key] > level) {
        this.level = levelLists[key]
        this.canvasAddSpace += 0.3
        this.config.terrNum += 1
        break
      }
    }
  },

  paintCanvas () {
    const { ball, context, canvas, terrLists, tailLists, position } = this
    const { width: canvasWidth, height: canvasHeight } = canvas
    const { radius: ballRadius, left: ballLeft, top: ballTop } = ball

    const _ballTop = computedBeyond(ballTop, position)

    context.clearRect(0, 0, canvasWidth, canvasHeight)
    context.beginPath()
    context.arc(ballLeft, _ballTop, ballRadius, 0, 2 * Math.PI)
    context.fill()

    const tailListsLength = tailLists.length

    context.fillStyle = 'rgba(0,0,0,0.3)'
    context.beginPath()
    for (let i = 0; i < tailListsLength; i++) {
      const tail = tailLists[i]
      const { left: tailLeft, top: tailTop } = tail
      const _tailTop = computedBeyond(tailTop, position)
      context.lineTo(tailLeft - ball.radius + (ball.radius * (i + 1) / tailListsLength), _tailTop)
    }

    for (let i = tailListsLength - 1; i > 0; i--) {
      const tail = tailLists[i]
      const { left: tailLeft, top: tailTop } = tail
      const _tailTop = computedBeyond(tailTop, position)
      context.lineTo(tailLeft + ball.radius - (ball.radius * (i + 1) / tailListsLength), _tailTop)
    }
    context.closePath()
    context.fill()

    context.fillStyle = '#000'
    for (let key in terrLists) {
      if (terrLists.hasOwnProperty(key)) {
        const terr = terrLists[key]
        const { left: terrLeft, top: terrTop, width: terrWidth, height: terrHeight } = terr
        const _terrTop = computedBeyond(terrTop, position)
        context.beginPath()
        context.fillRect(terrLeft, _terrTop, terrWidth, terrHeight)
      }
    }
  },

  gameOver () {
    this.ball.clear()
  }
}

engine.init('container')
