/// <reference path="index.d.ts"/>

import Ball from './Ball';

const engine: engine = {
  config: {},
  touchStartEventListener: [],

  initEngine(el, config = {}) {
    const devicePixelRatio: number = window.devicePixelRatio || 1;
    const canvas: any = document.createElement('canvas');
    canvas.width = el.offsetWidth * devicePixelRatio;
    canvas.height = el.offsetHeight * devicePixelRatio;
    canvas.style.width = `${el.offsetWidth}px`;
    canvas.style.height = `${el.offsetHeight}px`;
    el.appendChild(canvas);

    (<any>Object).assign(this, {
      config: {
        terrNum: 10,
        terrImageSrc: 'http://yijic.com/public/ball/images/terr.png',
        ...config
      },
      context: canvas.getContext('2d'),
      canvas,
      el
    });
    this.initGame();
  },

  initGame() {
    const {
      terrImageSrc
    }: {
      terrImageSrc: string
    } = this.config;
    const terrImage: any = new Image();
    terrImage.src = terrImageSrc;
    terrImage.onload = function() {
      console.log('image load success!')
    };
  }
};

engine.initEngine(document.body);
