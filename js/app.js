import Ball from './ball.js'
import Terr from './terr.js'
import { computedBeyond, isCrash, isNear } from './utils.js'
import { levelLists, stateColors } from './lists.js'

const engine = {
  fatherEle: {},
  config: {},
  ball: {},
  ballEndPosition: 0,
  terrLists: {},
  canvas: {},
  canvasSpace: 0,
  canvasAddSpace: 3.2,
  context: {},
  timer: null,
  hasStart: false,
  point: 0,
  addPointNum: 0,
  pointTimer: null,
  updatePointTime: 3000,
  updatePointTimer: null,
  tailLists: [],
  position: 0,
  halfCanvasHeight: 0,
  level: 0,
  isDown: false,
  stateColor: {},
  nearDistance: 40,

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

    const terrImg = new window.Image()
    terrImg.src = './images/terr.png'

    Object.assign(this, {
      ballEndPosition: canvas.height / 2,
      canvas,
      context: canvas.getContext('2d'),
      halfCanvasHeight: fatherHeight / 2,
      terrImg
    })

    terrImg.onload = () => {
      this.initGame()
    }

    canvas.addEventListener('touchstart', this.gameTouchStart.bind(this))
    canvas.addEventListener('touchend', this.gameTouchEnd.bind(this))
  },

  initGame () {
    const { canvas, config, terrImg } = this
    const { terrNum } = config
    const terrLists = {}
    const minTerrTop = canvas.height / 4
    const stateColor = stateColors[0]

    const ball = new Ball(canvas, {
      top: minTerrTop / 2,
      color: stateColor.ballColor
    })

    for (let i = 0; i < terrNum; i++) {
      const terr = new Terr(canvas, {
        top: Math.floor(Math.random() * (canvas.height - minTerrTop) + minTerrTop)
      }, terrImg)
      terrLists[terr.id] = terr
    }

    const terrListsArr = Object.entries(terrLists)
    terrListsArr.sort((x, y) => {
      return x[1].top - y[1].top
    })
    terrListsArr.forEach(item => {
      this.terrLists[item[0]] = item[1]
    })

    Object.assign(this, {
      ball,
      stateColor
    })

    this.paintGameCanvas()
  },

  gameTouchStart (e) {
    const { ball } = this
    e.preventDefault()
    if (!this.hasStart) {
      this.startGame()
    }
    this.isDown = true
    ball.direction = !ball.direction
  },

  gameTouchEnd () {
    this.isDown = false
  },

  startGame () {
    this.hasStart = true
    this.config.terrNum += 10

    this.move()

    this.startAddPoint()
  },

  startAddPoint () {
    this.pointTimer = setInterval(() => {
      this.addPoint(1)
    }, 1000)
  },

  move () {
    const { canvas, halfCanvasHeight, terrImg, nearDistance } = this

    const animate = () => {
      const { terrLists, ball, config, tailLists, canvasAddSpace, isDown, position, addPointNum } = this
      const terrNum = config.terrNum
      const ballTop = ball.top
      const ballLeft = ball.left

      ball.move(canvasAddSpace, isDown)

      if (ballLeft < 0 || ballLeft > canvas.width) {
        this.gameOver()
        return
      }

      for (let i = 0; i < terrNum - Object.keys(terrLists).length; i++) {
        const terr = new Terr(canvas, {
          top: Math.floor(Math.random() * canvas.height + canvas.height + position)
        }, terrImg)
        terrLists[terr.id] = terr
      }

      for (let key in terrLists) {
        if (terrLists.hasOwnProperty(key)) {
          const terr = terrLists[key]
          if (terr.top < position - halfCanvasHeight) {
            delete terrLists[key]
            continue
          }

          if (!terr.isNear && isNear(ball, terr, nearDistance)) {
            const point = addPointNum + 1
            terr.color = 'green'
            terr.isNear = true
            this.updatePointNum(point)
            terr.initPoint(point, this.stateColor)
          }

          if (!terr.isCrash && isCrash(ball, terr)) {
            terr.isCrash = true
            this.gameOver()
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

      const terrListsArr = Object.entries(terrLists)
      terrListsArr.sort((x, y) => {
        return x[1].top - y[1].top
      })
      terrListsArr.forEach(item => {
        terrLists[item[0]] = item[1]
      })

      this.paintGameCanvas()
      this.timer = window.requestAnimationFrame(animate)
    }

    this.timer = window.requestAnimationFrame(animate)
  },

  addPoint (addNum) {
    let { point, level } = this

    point += addNum
    this.point = point

    for (let key in levelLists) {
      if (levelLists.hasOwnProperty(key) && point > key && levelLists[key] > level) {
        this.level = levelLists[key]
        this.canvasAddSpace += 0.3
        this.config.terrNum += 3
        break
      }
    }
  },

  updatePointNum (num) {
    const { updatePointTime, updatePointTimer } = this
    this.addPoint(num)
    this.addPointNum = num

    if (num > 15) {
      this.stateColor = stateColors[2]
      this.ball.color = stateColors[2].ballColor
    } else if (num > 6) {
      this.stateColor = stateColors[1]
      this.ball.color = stateColors[1].ballColor
    } else {
      this.stateColor = stateColors[0]
      this.ball.color = stateColors[0].ballColor
    }

    clearTimeout(updatePointTimer)
    this.updatePointTimer = setTimeout(() => {
      this.addPointNum = 0
      this.stateColor = stateColors[0]
      this.ball.color = stateColors[0].ballColor
      clearTimeout(this.updatePointTimer)
    }, updatePointTime)
  },

  paintGameCanvas () {
    const { ball, context, canvas, terrLists, tailLists, position, point, stateColor } = this
    const { width: canvasWidth, height: canvasHeight } = canvas
    const { radius: ballRadius, left: ballLeft, top: ballTop, color: ballColor } = ball
    const { pointColor } = stateColor

    const tailListsLength = tailLists.length

    context.clearRect(0, 0, canvasWidth, canvasHeight)

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
    if (tailListsLength) {
      const firstTail = tailLists[0]
      const lastTail = tailLists[tailListsLength - 1]
      const firstTailTop = computedBeyond(firstTail.top, position)
      const lastTailTop = computedBeyond(lastTail.top, position)
      const line = context.createLinearGradient(firstTail.left, firstTailTop, lastTail.left, lastTailTop)
      const { gradualColor } = stateColor
      line.addColorStop(0, gradualColor[0])
      line.addColorStop(1, gradualColor[1])
      context.fillStyle = line
    }
    context.fill()

    context.fillStyle = ballColor
    const _ballTop = computedBeyond(ballTop, position)
    context.beginPath()
    context.arc(ballLeft, _ballTop, ballRadius, 0, 2 * Math.PI)
    context.fill()

    context.fillStyle = '#000'
    for (let key in terrLists) {
      if (terrLists.hasOwnProperty(key)) {
        const terr = terrLists[key]
        const { left: terrLeft, top: terrTop, width: terrWidth, height: terrHeight,
          terrImg, terrImgWidth, terrImgHeight, terrImgLeft, terrImgTop } = terr
        const _terrTop = computedBeyond(terrTop, position)
        const _terrImgTop = computedBeyond(terrImgTop, position)
        context.drawImage(terrImg, terrImgLeft, _terrImgTop, terrImgWidth, terrImgHeight)
        context.beginPath()
        // context.fillRect(terrLeft, _terrTop, terrWidth, terrHeight)
        const point = terr.point
        if (point) {
          context.fillStyle = terr.pointColor
          context.font = '800 16px sans'
          context.textAlign = 'center'
          context.fillText(`+${point}`, terrImgLeft + terrImgWidth / 2, _terrImgTop - 5)
          terr.clearPoint()
        }
      }
    }

    context.fillStyle = pointColor
    context.font = '600 18px sans'
    context.textAlign = 'left'
    context.fillText(`Point: ${point}`, 10, 24)
  },

  gameOver () {
    clearInterval(this.pointTimer)

    const { context, canvas, point } = this
    const { width: canvasWidth, height: canvasHeight } = canvas

    context.fillStyle = 'rgba(0, 0, 0, 0.5)'
    context.fillRect(0, 0, canvasWidth, canvasHeight)
    context.fill()
    context.fillStyle = '#fff'
    context.font = '28px sans'
    context.textAlign = 'center'
    context.fillText('game over', canvasWidth / 2, 200)
    context.font = '18px sans'
    context.fillText(`获得 ${point} 分`, canvasWidth / 2, 250)
    context.font = '14px sans'
    context.fillText('（点击屏幕重新开始）', canvasWidth / 2, 300)

    const resetGame = () => {
      console.log('reset')
      canvas.removeEventListener('touchstart', resetGame)
    }

    canvas.addEventListener('touchstart', resetGame)
  }
}

engine.init('container')
