/// <reference path="index.d.ts"/>
import Ball from './Ball';
import { computedPixe } from './utils';
import Terr from './Terr';
import baseConfig from './utils/config';

const engine: engineInterface = {
  config: {
    terrNum: 12,
    terrImagePath: ''
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

    const { terrImage } = await engine.loadResource(config);
    console.log(`Resource loading completed.`);
    (<any>Object).assign(engine, {
      config: {
        ...engine.config,
        ...config
      },
      context: canvas.getContext('2d'),
      canvas,
      terrImage
    });

    engine.initGame();
  },

  /**
   * @description loader资源
   * @param terrImagePath {string} 树的图片路径
   */
  loadResource({ terrImagePath }) {
    return new Promise((resolve) => {
      const terrImage: any = new Image();
      terrImage.src = terrImagePath;
      terrImage.onload = function() {
        resolve({ terrImage })
      }
    })
  },

  /**
   * @description 初始化游戏
   */
  initGame() {
    const { config, canvas, terrList, terrImage } = engine;
    const { terrNum } = config;
    engine.ball = new Ball({
      left: canvas.width / 2,
      top: canvas.height / 6,
      radius: computedPixe(10),
      space: computedPixe(2)
    });
    engine.paintBall(engine.ball);

    for (let i = 0; i < terrNum; i ++) {
      const size = Math.random() > 0.5 ? 1 : 2
      const terr = new Terr({
        size,
        left: Math.floor(Math.random() * (canvas.width - baseConfig.terrSizes[size])),
        top: canvas.height / 3 + Math.floor(Math.random() * (canvas.height - canvas.height / 3))
      }, terrImage);

      terrList[terr.id] = terr;
    }
    (<any>Object)
      .values(terrList)
      .sort((x, y) => (x.top + x.height) - (y.top + y.height))
      .forEach(terr => engine.paintTerr(terr));

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
    const { ball } = engine;
    ball.move();
    engine.clearCanvas();
    engine.paintBall(ball);
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
