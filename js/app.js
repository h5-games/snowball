import Ball from './ball.js'
import Terr from './terr.js'
import { computedBeyond, isCrash, isNear, sortTerr, computedPixe } from './utils.js'
import { levelLists, stateColors } from './lists.js'

const engine = {
  config: {}, // 配置对象
  fatherEle: {}, // 父元素
  canvas: {}, // canvas 对象
  canvasSpace: 0, // canvas 每次实际位移的距离
  tailLists: [], // 小球的尾巴的列表
  context: {}, // canvas context
  isStart: false, // 游戏是否开始
  ball: {}, // 小球对象
  terrLists: {}, // 树列表
  gameTimer: null, // 游戏的计时器
  point: 0, // 分数
  pointTimer: null, // 分数计时器
  pointAddNum: 0, // 分数增值
  addPointTimer: null, // 更新分数增值的计时器
  position: 0, // canvas 总位移
  level: 0, // 游戏等级
  isTouch: false, // 是否处于按下
  stateColor: {}, // 当前状态的颜色

  init (id, config = {}) {
    // 初始化函数
    const devicePixelRatio = window.devicePixelRatio || 1
    const fatherEle = document.getElementById(id)
    const fatherWidth = fatherEle.offsetWidth
    const fatherHeight = fatherEle.offsetHeight

    // 默认配置
    const _config = {
      canvasClassName: 'ball-canvas', // canvas 的 class
      terrNum: 10, // 初始树的数量
      updatePointTime: 3000, // 更新分数增值计时器的超时时间
      nearDistance: computedPixe(50), // 小球靠近树的距离
      canvasAddSpace: computedPixe(3), // canvas 位移的加距离
      ballEndPosition: fatherHeight / 2, // 小球停留位置
      terrMinTop: fatherHeight / 4, // 初始化树 最小的 top
      tailNum: 50, // 尾巴的坐标数
      ...config
    }

    const canvas = document.createElement('canvas')

    canvas.width = fatherWidth * devicePixelRatio
    canvas.height = fatherHeight * devicePixelRatio
    canvas.style.width = fatherWidth + 'px'
    canvas.style.height = fatherHeight + 'px'
    canvas.className = _config.canvasClassName

    fatherEle.appendChild(canvas)

    const context = canvas.getContext('2d')

    const terrImg = new window.Image()
    terrImg.src = './images/terr.png'

    terrImg.onload = () => {
      this.initGame()
    }

    Object.assign(this, {
      config: _config,
      canvas,
      terrImg,
      context,
      devicePixelRatio
    })

    canvas.addEventListener('touchstart', e => {
      e.preventDefault()
      const { ball } = this
      if (!this.isStart) {
        this.startGame()
      }
      this.isTouch = true
      ball.direction = !ball.direction
    })

    canvas.addEventListener('touchend', e => {
      e.preventDefault()
      this.isTouch = false
    })
  },

  initGame () {
    const { config } = this
    Object.assign(this, {
      ...config,
      isStart: false,
      canvasSpace: 0,
      tailLists: [],
      ball: {},
      terrLists: {},
      point: 0,
      pointAddNum: 0,
      position: 0,
      level: 0,
      isTouch: false,
      stateColor: stateColors[0]
    })

    const { canvas, terrImg, terrNum, terrMinTop, stateColor, gameTimer, pointTimer, updatePointTimer } = this

    window.cancelAnimationFrame(gameTimer)
    window.clearInterval(pointTimer)
    window.clearInterval(updatePointTimer)

    const terrLists = {}

    this.ball = new Ball(canvas, {
      top: terrMinTop / 2,
      color: stateColor.ballColor
    })

    for (let i = 0; i < terrNum; i++) {
      const terr = new Terr(canvas, {
        top: Math.floor(Math.random() * (canvas.height - terrMinTop) + terrMinTop)
      }, terrImg)
      terrLists[terr.id] = terr
    }

    this.terrLists = sortTerr(terrLists)

    this.paintGameCanvas()
  },

  startGame () {
    this.isStart = true
    this.terrNum += 10
    this.move()
    this.startAddPoint()
  },

  move () {
    const { canvas, terrImg, nearDistance, tailNum } = this
    const halfCanvasHeight = canvas.height / 2

    const animate = () => {
      const { terrLists, ball, tailLists, canvasAddSpace, isTouch, position, pointAddNum, terrNum, stateColor } = this

      ball.move(canvasAddSpace, isTouch)

      const ballTop = ball.top
      const ballLeft = ball.left

      if (ballLeft < 0 || ballLeft > canvas.width) {
        // 小球超出边界
        this.gameOver()
        return
      }

      for (let i = 0; i < terrNum - Object.keys(terrLists).length; i++) {
        // 给下一屏绘制的树
        const terr = new Terr(canvas, {
          top: Math.floor(Math.random() * canvas.height + canvas.height + position)
        }, terrImg)
        terrLists[terr.id] = terr
      }

      for (let key in terrLists) {
        if (terrLists.hasOwnProperty(key)) {
          const terr = terrLists[key]
          if (terr.top < position - terr.height) {
            delete terrLists[key]
            continue
          }

          if (!terr.isNear && isNear(ball, terr, nearDistance)) {
            // 小球靠近这个树
            const point = pointAddNum + 1
            terr.isNear = true
            this.updatePointAddNum(point)
            terr.initPoint(point, stateColor.pointColor)
          }

          if (!terr.isCrash && isCrash(ball, terr)) {
            // 小球撞上这个树
            terr.isCrash = true
            this.gameOver()
            return
          }
        }
      }

      // 更新尾巴列表
      tailLists.unshift({
        left: ballLeft,
        top: ballTop
      })
      tailLists.splice(tailNum)

      const canvasSpace = ballTop - position > halfCanvasHeight ? canvasAddSpace : (ballTop - position) / halfCanvasHeight * canvasAddSpace

      Object.assign(this, {
        canvasSpace,
        position: position + canvasSpace,
        terrLists: sortTerr(terrLists),
        gameTimer: window.requestAnimationFrame(animate)
      })

      this.paintGameCanvas()
    }

    this.gameTimer = window.requestAnimationFrame(animate)
  },

  startAddPoint () {
    this.pointTimer = window.setInterval(() => {
      this.addPoint(1)
    }, 1000)
  },

  addPoint (addNum) {
    let { point, level } = this

    point += addNum
    this.point = point

    for (let key in levelLists) {
      if (levelLists.hasOwnProperty(key) && point > key && levelLists[key] > level) {
        this.level = levelLists[key]
        this.canvasAddSpace += 0.3
        this.terrNum += 3
        break
      }
    }
  },

  updatePointAddNum (num) {
    const { updatePointTime, updatePointTimer } = this
    this.addPoint(num)
    this.pointAddNum = num

    const index = num > 15 ? 2 : num > 6 ? 1 : 0

    this.stateColor = stateColors[index]
    this.ball.color = stateColors[index].ballColor

    clearTimeout(updatePointTimer)
    this.updatePointTimer = window.setTimeout(() => {
      this.updatePointAddNum(0)
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
    context.fillStyle = '#fff'
    context.fillRect(0, 0, canvasWidth, canvasHeight)

    if (tailListsLength) {
      context.beginPath()
      for (let i = 0; i < tailListsLength; i++) {
        const tail = tailLists[i]
        const { left: tailLeft, top: tailTop } = tail
        const _tailTop = computedBeyond(tailTop, position)
        context.lineTo(tailLeft - ballRadius + (ballRadius * (i + 1) / tailListsLength), _tailTop)
      }
      for (let i = tailListsLength - 1; i >= 0; i--) {
        const tail = tailLists[i]
        const { left: tailLeft, top: tailTop } = tail
        const _tailTop = computedBeyond(tailTop, position)
        context.lineTo(tailLeft + ballRadius - (ballRadius * (i + 1) / tailListsLength), _tailTop)
      }

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
        const { terrImg, terrImgWidth, terrImgHeight, terrImgLeft, terrImgTop } = terr
        const _terrImgTop = computedBeyond(terrImgTop, position)
        context.drawImage(terrImg, terrImgLeft, _terrImgTop, terrImgWidth, terrImgHeight)
        context.beginPath()
        const point = terr.point
        if (point) {
          context.fillStyle = terr.pointColor
          context.font = computedPixe(16) + 'px sans'
          context.textAlign = 'center'
          context.fillText(`+${point}`, terrImgLeft + terrImgWidth / 2, _terrImgTop - 5)
        }
      }
    }

    context.fillStyle = pointColor
    context.font = computedPixe(20) + 'px sans'
    context.textAlign = 'left'
    context.fillText(`分数：${point}`, computedPixe(10), computedPixe(28))
  },

  gameOver () {
    const { context, canvas, terrLists, point, pointTimer, updatePointTimer, gameTimer } = this
    const { width: canvasWidth, height: canvasHeight } = canvas

    window.cancelAnimationFrame(gameTimer)
    window.clearInterval(pointTimer)
    window.clearInterval(updatePointTimer)

    this.paintGameCanvas()
    this.isStart = false
    for (let key in terrLists) {
      if (terrLists.hasOwnProperty(key)) {
        terrLists[key].clearPointTimer()
        delete terrLists[key]
      }
    }

    context.fillStyle = 'rgba(0, 0, 0, 0.5)'
    context.fillRect(0, 0, canvasWidth, canvasHeight)
    context.fill()
    context.fillStyle = '#fff'
    context.font = computedPixe(28) + 'px sans'
    context.textAlign = 'center'
    context.fillText('游戏结束', canvasWidth / 2, canvasHeight / 2.6)
    context.font = computedPixe(18) + 'px sans'
    context.fillText(`获得 ${point} 分`, canvasWidth / 2, canvasHeight / 1.8)
    context.font = computedPixe(14) + 'px sans'
    context.fillText('（点击屏幕重新开始）', canvasWidth / 2, canvasHeight / 1.65)

    const resetGame = e => {
      e.preventDefault()
      this.initGame()
      canvas.removeEventListener('touchstart', resetGame)
    }
    canvas.addEventListener('touchstart', resetGame)
  }
}

engine.init('container')
