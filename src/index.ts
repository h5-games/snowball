/// <reference path="index.d.ts"/>
import Ball from './Ball';
import { computedPixe, sortTerr } from './utils';
import Terr from './Terr';
import baseConfig from './utils/config';

const devicePixelRatio: number = window.devicePixelRatio || 1;

const engine: engineInterface = {
  config: {
    resources: {},
    initialSpace: computedPixe(2),
    ballInitialTop: computedPixe(200),
    ballTailMaxLength: 50
  },
  space: 0,
  terrNum: 10,
  canvasOffsetTop: 0,
  canvas: null,
  context: null,
  startStatus: false,
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
    canvas.style.width = `${el.offsetWidth}px`;
    canvas.style.height = `${el.offsetHeight}px`;
    el.appendChild(canvas);
    baseConfig.init(canvas);

    await engine.loadResource(config.resources, console.log);
    Object.assign(engine, {
      config: {
        ...engine.config,
        ...config
      },
      context: canvas.getContext('2d'),
      canvas
    });

    engine.initGame();
  },

  /**
   * @description 加载需要用到的资源
   * @param resources {object} 资源对象
   * @param callback {function} load资源进度的回调
   */
  async loadResource(resources, callback) {
    const resourceKeys = Object.keys(resources);
    let _resources = {};
    for (let i = 0; i < resourceKeys.length; i ++) {
      const key = resourceKeys[i];
      _resources[key] = await new Promise((resolve) => {
        const img: HTMLImageElement = new Image();
        img.src = resources[key];
        img.onload = function () {
          callback((i + 1) / resourceKeys.length);
          resolve(img);
        }
      })
    }
    return _resources;
  },

  /**
   * @description 初始化游戏
   */
  initGame() {
    const { config, canvas, terrList, terrNum } = engine;
    const { initialSpace } = config;
    const ball = new Ball(engine);
    engine.space = initialSpace;
    engine.ball = ball;
    engine.paintBall(ball);

    // 生成树木
    for (let i = 0; i < terrNum; i++) {
      const size = Math.round(Math.random());
      const terr = new Terr(engine);

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
    engine.transform();
  },

  /**
   * @description 改变对象
   */
  transform() {
    const { ball, terrList, config, ballTailList, canvasOffsetTop } = engine;
    const { ballTailMaxLength } = config;
    engine.clearCanvas();

    engine.canvasOffsetTop += engine.space;

    // 移动小球
    ball.move(engine);
    // 增加小尾巴坐标
    ballTailList.unshift({
      left: ball.left,
      top: ball.top,
      degree: ball.degree
    });
    ballTailList.splice(ballTailMaxLength);

    engine.paintBallTail(ballTailList);
    engine.paintBall(ball);

    // 排序树木 并绘制
    sortTerr(terrList, terr => {
      if (terr.top + terr.height <= canvasOffsetTop) {
        delete terrList[terr.id];
        const size = Math.round(Math.random());
        const newTerr = new Terr(engine);
        console.log(newTerr);

        terrList[newTerr.id] = newTerr;
        return
      }
      engine.paintTerr(terr);
    });

    engine.gameTimer = window.requestAnimationFrame(engine.transform);
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
    context.beginPath();
    context.fillStyle = color;
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
    let index = 0;
    let step = 1;
    function paint() {
      if (index < 0) return;

      const { left, top, degree } = ballTailList[index];
      const radius = ballRadius - (ballRadius * (index + 1) / tailListsLength);
      const radian = degree * Math.PI / 180;
      const cos = Math.cos(radian) * radius * step;
      const sin = Math.sin(radian) * radius * step;
      context.lineTo(left - cos, top + sin - canvasOffsetTop);

      if (index === tailListsLength - 1) step = -1;
      index += step;
      paint();
    };
    paint();

    context.fillStyle = '#EEE';
    context.fill();
  },

  /**
   * @description 绘制树
   * @param {objcet} 树木对象
   */
  paintTerr({ width, height, left, top, trunk }) {
    const { context, config, canvasOffsetTop } = engine;
    context.beginPath();
    const Img = new Image();
    Img.src = config.resources.terrImagePath;
    context.drawImage(Img, left, top - canvasOffsetTop, width, height);
    context.fillStyle = '#333';
    context.rect(trunk.left, trunk.top - canvasOffsetTop, trunk.width, trunk.height);
    context.fill();
  }
};

engine.initEngine(document.body, {
  resources: {
    terrImagePath: '/static/images/terr.png'
  }
});
