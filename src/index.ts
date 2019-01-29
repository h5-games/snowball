/// <reference path="index.d.ts"/>
import Ball from './Ball';
import { computedPixe } from './utils';

const engine: engineInterface = {
  config: {
    terrNum: 10,
    terrImagePath: ''
  },
  canvas: null,
  context: null,
  startStatus: false,
  terrImage: null,
  gameTimer: null,
  ball: null,
  terrList: [],

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
    canvas.style.width = `${el.offsetWidth}px`;
    canvas.style.height = `${el.offsetHeight}px`;
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
    const { config, canvas } = engine;
    const { terrNum } = config;
    engine.ball = new Ball({
      left: canvas.width / 2,
      top: 100,
      radius: computedPixe(8),
      space: 2
    });
    for (let i = 0; i < terrNum; i ++) {

    }

    engine.paintBall();

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
    engine.paintBall();
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
  paintBall() {
    const { context } = engine;
    const { color, left, top, radius } = this.ball;
    context.fillStyle = color;
    context.beginPath();
    context.arc(left, top, radius, 0, 2 * Math.PI);
    context.fill();
  }
};

engine.initEngine(document.body, {
  terrImagePath: 'http://yijic.com/public/ball/images/terr.png'
});
