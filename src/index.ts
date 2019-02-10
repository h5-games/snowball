/// <reference path="index.d.ts"/>
import Ball from './Ball';
import { computedPixe, sortTerr } from './utils';
import Terr from './Terr';
import baseConfig from './utils/config';

const engine: engineInterface = {
  config: {
    terrNum: 15,
    terrImagePath: '',
    space: 0,
    ballInitialTop: 0
  },
  canvas: null,
  context: null,
  startStatus: false,
  terrImage: null,
  gameTimer: null,
  ball: null,
  terrList: {},

  /**
   * @description 初始化游戏引擎游戏引擎
   * @param el {objcet} 父元素dom
   * @param config {object} 配置
   */
  async initEngine(el, config) {
    const devicePixelRatio: number = window.devicePixelRatio || 1;
    const canvas: any = document.createElement('canvas');
    canvas.width = el.offsetWidth * devicePixelRatio;
    canvas.height = el.offsetHeight * devicePixelRatio;
    canvas.style.width = `${ el.offsetWidth }px`;
    canvas.style.height = `${ el.offsetHeight }px`;
    el.appendChild(canvas);
    baseConfig.init(canvas);

    const { terrImage } = await engine.loadResource(config);
    console.log(`Resource loading completed.`);
    (<any>Object).assign(engine, {
      config: {
        ...engine.config,
        ballInitialTop: canvas.height / 6,
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
      top: Math.floor(canvas.height / 6),
      radius: baseConfig.ballRadius
    });
    engine.paintBall(engine.ball);

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
      }
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
    const { ball, terrList, canvas, config, terrImage } = engine;
    if (ball.top >= canvas.height / 2) {

    } else {
      config.space += 0.1;
      ball.space -= 0.02;
      ball.top += ball.space;
    }
    engine.clearCanvas();
    engine.paintBall(ball);
    sortTerr(terrList, terr => {
      terr.top -= config.space;
      if (terr.top + terr.height <= 0) {
        delete terrList[terr.id];
        return
      }
      engine.paintTerr(terr);
    });
    for (let i = 0; i < config.terrNum - Object.keys(terrList).length; i ++) {
      const size = Math.random() > 0.5 ? 1 : 2
      const terr = new Terr({
        size,
        left: Math.floor(Math.random() * (canvas.width - baseConfig.terrSizes[size])),
        top: Math.floor(Math.random() * canvas.height + canvas.height)
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
   */
  paintBall({ color, left, top, radius }) {
    const { context } = engine;
    context.fillStyle = color;
    context.beginPath();
    context.arc(left, top, radius, 0, 2 * Math.PI);
    context.fill();
  },

  /**
   * @description 绘制树
   */
  paintTerr({ width, height, left, top }) {
    const { context, terrImage } = engine;
    context.beginPath();
    context.drawImage(terrImage, left, top, width, height);
  }
};

engine.initEngine(document.body, {
  terrImagePath: 'http://yijic.com/public/ball/images/terr.png'
});
