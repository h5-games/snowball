/// <reference path="index.d.ts"/>

import Ball from './Ball';

const engine: engine = {
  config: {
    terrNum: 10,
    terrImageSrc: ''
  },
  canvas: null,
  context: null,
  startStatus: false,
  terrImage: null,

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

  loadResource({terrImageSrc}) {
    return new Promise((resolve) => {
      const terrImage: any = new Image();
      terrImage.src = terrImageSrc;
      terrImage.onload = function() {
        resolve({
          terrImage
        })
      };
    })
  },

  initGame() {
    const { config, canvas } = engine;
    const { terrImageSrc } = config;
    
    canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      if (!engine.startStatus) {
        engine.startGame();
      }
      engine.startStatus = true;
    })
  },

  startGame() {
    console.log('start game')
  }
};

engine.initEngine(document.body, {
  terrImageSrc: 'http://yijic.com/public/ball/images/terr.png'
});
