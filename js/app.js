import Ball from './ball.js'
import Terr from './terr.js'
import { computedBeyond, isCrash, isNear } from './utils.js'
import { levelLists } from './lists.js'

const engine = {
  fatherEle: {},
  config: {},
  ball: {},
  ballEndPosition: 0,
  terrLists: {},
  canvas: {},
  canvasSpace: 0,
  canvasAddSpace: 3,
  context: {},
  timer: null,
  hasStart: false,
  point: 0,
  pointTimer: null,
  tailLists: [],
  position: 0,
  halfCanvasHeight: 0,
  level: 0,
  isDown: false,

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
      if (!this.hasStart) {
        this.startGame()
      }
      this.isDown = true
      ball.direction = !ball.direction
    })

    canvas.addEventListener('touchend', () => {
      this.isDown = false
    })

    this.ball = ball
    this.terrLists = terrLists

    this.paintCanvas()
  },

  startGame () {
    this.hasStart = true

    const { canvas, halfCanvasHeight, config } = this
    config.terrNum += 20

    const animate = () => {
      const { terrLists, ball, config, tailLists, canvasAddSpace, isDown, position } = this
      const terrNum = config.terrNum
      const ballTop = ball.top
      const ballLeft = ball.left

      ball.move(canvasAddSpace, isDown)

      if (ballLeft < 0 || ballLeft > canvas.width) {
        window.alert('GG')
        return
      }

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
            continue
          }

          if (!terr.isNear && isNear(ball, terr, 30)) {
            terr.color = '#00ffff'
            terr.isNear = true
          }

          if (!terr.isCrash && isCrash(ball, terr)) {
            terr.isCrash = true
            window.alert('GG')
            return
          }
        }
      }

      tailLists.unshift({
        left: ball.left,
        top: ball.top
      })
      tailLists.splice(50)

      this.canvasSpace = ballTop - position > halfCanvasHeight ? canvasAddSpace : (ballTop - position) / halfCanvasHeight * canvasAddSpace
      this.position += this.canvasSpace

      this.paintCanvas()
      window.requestAnimationFrame(animate)
    }

    window.requestAnimationFrame(animate)

    clearInterval(this.pointTimer)
    this.pointTimer = setInterval(() => {
      this.addPoint(1)
    }, 300)
  },

  addPoint (addNum) {
    let { point, level } = this

    point += addNum
    this.point = point

    for (let key in levelLists) {
      if (levelLists.hasOwnProperty(key) && point > key && levelLists[key] > level) {
        this.level = levelLists[key]
        this.canvasAddSpace += 0.5
        this.config.terrNum += 1
        break
      }
    }
  },

  paintCanvas () {
    const { ball, context, canvas, terrLists, tailLists, position } = this
    const { width: canvasWidth, height: canvasHeight } = canvas
    const { radius: ballRadius, left: ballLeft, top: ballTop } = ball

    const tailListsLength = tailLists.length

    context.clearRect(0, 0, canvasWidth, canvasHeight)
    context.fillStyle = '#e8d04e'
    context.beginPath()
    for (let i = 0; i < tailListsLength; i++) {
      const tail = tailLists[i]
      const { left: tailLeft, top: tailTop } = tail
      const _tailTop = computedBeyond(tailTop, position)
      context.lineTo(tailLeft - ball.radius + (ball.radius * (i + 1) / tailListsLength), _tailTop)
    }

    for (let i = tailListsLength - 1; i >= 0; i--) {
      const tail = tailLists[i]
      const { left: tailLeft, top: tailTop } = tail
      const _tailTop = computedBeyond(tailTop, position)
      context.lineTo(tailLeft + ball.radius - (ball.radius * (i + 1) / tailListsLength), _tailTop)
    }
    context.closePath()
    context.fill()
    context.fillStyle = '#000'

    const _ballTop = computedBeyond(ballTop, position)

    context.beginPath()
    context.arc(ballLeft, _ballTop, ballRadius, 0, 2 * Math.PI)
    context.fill()

    for (let key in terrLists) {
      if (terrLists.hasOwnProperty(key)) {
        const terr = terrLists[key]
        const { left: terrLeft, top: terrTop, width: terrWidth, height: terrHeight } = terr
        const _terrTop = computedBeyond(terrTop, position)
        context.fillStyle = terr.color
        context.beginPath()
        context.fillRect(terrLeft, _terrTop, terrWidth, terrHeight)
      }
    }
  }
}

engine.init('container')
