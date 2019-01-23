/// <reference path="index.d.ts"/>

import Ball from './Ball';

const engine: engine = {
  config: {
    terrNum: 10,
    terrImagePath: ''
  },
  canvas: null,
  context: null,
  startStatus: false,
  terrImage: null,

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

    const {terrImage} = await engine.loadResource(config);
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
    const { terrImagePath } = config;

    canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      if (!engine.startStatus) {
        engine.startGame();
      }
    })
  },

  startGame() {
    engine.startStatus = true;

    console.log('start game')
  }
};

engine.initEngine(document.body, {
  terrImagePath: 'http://yijic.com/public/ball/images/terr.png'
});
