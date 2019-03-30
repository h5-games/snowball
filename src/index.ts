/// <reference path="index.d.ts"/>
import Ball from './Ball';
import { computedPixe, sortTerr } from './utils';
import Terr from './Terr';
import baseConfig from './utils/config';

const devicePixelRatio: number = window.devicePixelRatio || 1;

const engine: engineInterface = {
  config: {
    terrNum: 10,
    terrImagePath: '',
    space: 0,
    ballInitialTop: 0,
    ballTailMaxLength: 50
  },
  canvasOffsetTop: 0,
  canvas: null,
  context: null,
  startStatus: false,
  terrImage: null,
  gameTimer: null,
  ball: null,
  ballTailList: [],
  terrList: {},
  isTouch: false,

  /**
   * @description 初始化游戏引擎游戏引擎
   * @param el {objcet} 父元素dom
   * @param config {object} 配置
   */
  async initEngine(el, config) {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = el.offsetWidth * devicePixelRatio;
    canvas.height = el.offsetHeight * devicePixelRatio;
    canvas.style.width = `${ el.offsetWidth }px`;
    canvas.style.height = `${ el.offsetHeight }px`;
    el.appendChild(canvas);
    baseConfig.init(canvas);

    const { terrImage } = await engine.loadResource(config);
    Object.assign(engine, {
      config: {
        ...engine.config,
        ballInitialTop: Math.floor(canvas.height / 6),
        ...config
      },
      context: canvas.getContext('2d'),
      canvas,
      terrImage
    });

    engine.initGame();
  },

  /**
   * @description 加载需要用到的资源
   * @param terrImagePath {string} 树的图片路径
   */
  loadResource({ terrImagePath }) {
    return new Promise((resolve) => {
      const terrImage: any = new Image();
      terrImage.src = terrImagePath;
      terrImage.onload = function() {
        resolve({ terrImage });
      }
    })
  },

  /**
   * @description 初始化游戏
   */
  initGame() {
    const { config, canvas, terrList, terrImage } = engine;
    const { terrNum, ballInitialTop } = config;
    engine.ball = new Ball({
      left: Math.floor(canvas.width / 2),
      top: ballInitialTop,
      radius: baseConfig.ballRadius
    });
    engine.paintBall(engine.ball);

    // 生成树木
    for (let i = 0; i < terrNum; i ++) {
      const size = Math.random() > 0.5 ? 1 : 2
      const terr = new Terr({
        size,
        left: Math.floor(Math.random() * (canvas.width - baseConfig.terrSizes[size])),
        top: ballInitialTop + Math.floor(Math.random() * (canvas.height - ballInitialTop + ballInitialTop))
      }, terrImage);

      terrList[terr.id] = terr;
    }

    sortTerr(terrList, engine.paintTerr);

    canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      if (!engine.startStatus) {
        engine.gameStart();
        return
      }
      engine.isTouch = true;
      engine.ball.direction = !engine.ball.direction;
    })

    canvas.addEventListener('touchend', e => {
      e.preventDefault();
      engine.isTouch = false;
    })
  },

  /**
   * @description 游戏开始
   */
  gameStart() {
    engine.startStatus = true;
    console.log('start game');
    engine.animate();
  },

  /**
   * @description 改变对象
   */
  animate() {
    const { ball, terrList, canvas, config, terrImage, ballTailList, isTouch, canvasOffsetTop } = engine;
    const { ballInitialTop, ballTailMaxLength } = config;
    const space = (ball.top - ballInitialTop) / (canvas.height / 2);
    engine.clearCanvas();

    // 移动小球
    ball.move(isTouch);
    // 增加小尾巴坐标
    ballTailList.unshift({
      left: ball.left,
      top: ball.top,
      degree: ball.degree
    });
    ballTailList.splice(ballTailMaxLength);

    engine.paintBall(ball);
    engine.paintBallTail(ballTailList);


    // 排序树木 并绘制
    sortTerr(terrList, terr => {
      if (terr.top + terr.height <= canvasOffsetTop) {
        delete terrList[terr.id];
        return
      }
      engine.paintTerr(terr);
    });
    // 生成下一个屏幕的树
    for (let i = 0; i < config.terrNum - Object.keys(terrList).length; i ++) {
      const size = Math.random() > 0.5 ? 1 : 2
      const terr = new Terr({
        size,
        left: Math.floor(Math.random() * (canvas.width - baseConfig.terrSizes[size])),
        top: Math.floor(Math.random() * canvas.height + canvas.height + canvasOffsetTop)
      }, terrImage);

      terrList[terr.id] = terr;
    }
    engine.gameTimer = window.requestAnimationFrame(engine.animate);
  },

  /**
   * @description 清除画布
   */
  clearCanvas() {
    const { context, canvas } = engine;
    context.clearRect(0, 0, canvas.width, canvas.height);
  },

  /**
   * @description 绘制雪球
   * @param {objcet} 小球对象
   */
  paintBall({ color, left, top, radius }) {
    const { context, canvasOffsetTop } = engine;
    context.fillStyle = color;
    context.beginPath();
    context.arc(left, top - canvasOffsetTop, radius, 0, 2 * Math.PI);
    context.fill();
  },

  /**
   * @description 绘制小球的尾巴
   * @param ballTailList {array} 小球尾巴列表
   */
  paintBallTail(ballTailList) {
    const { context, canvasOffsetTop } = engine;
    const { ballRadius } = baseConfig;
    const tailListsLength = ballTailList.length;
    if (!tailListsLength) return;
    context.beginPath();
    for (let i = 0; i < tailListsLength; i ++) {
      const tail = ballTailList[i];
      const { left, top, degree } = tail;
      const deg = degree * 12;
      const radius = ballRadius - (ballRadius * (i + 1) / tailListsLength);

      context.lineTo(left - radius, top - canvasOffsetTop)
    }
    for (let i = tailListsLength - 1; i >= 0; i --) {
      const tail = ballTailList[i];
      const { left, top } = tail;
      context.lineTo(left + ballRadius - (ballRadius * (i + 1) / tailListsLength), top - canvasOffsetTop);
    }
    context.fillStyle = '#ccc';
    context.fill();
  },

  /**
   * @description 绘制树
   * @param {objcet} 树木对象
   */
  paintTerr({ width, height, left, top }) {
    const { context, terrImage, canvasOffsetTop } = engine;
    context.beginPath();
    context.drawImage(terrImage, left, top - canvasOffsetTop, width, height);
  }
};

engine.initEngine(document.body, {
  terrImagePath: '/static/images/terr.png'
});
