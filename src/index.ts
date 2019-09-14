import Engine, { IEngine } from './Engine';
import { IResource } from './types';
import Ball, { IBallConfig } from './Ball';

interface IGame {
  resources: IResource[];
  engine: IEngine;
  initial(): void;
}

const game: IGame = {
  resources: [],
  engine: null,
  async initial() {
    this.resources = await Engine.loadResource([
      {
        id: 'terr',
        src: '/static/images/terr.png'
      }
    ]);
    const el = document.body;
    const engine = new Engine(el);
    this.engine = engine;

    engine.createUnit<Ball, IBallConfig>(Ball, {
      radius: Engine.getActualPixel(el.offsetWidth / 40),
      left: Engine.getActualPixel(el.offsetWidth / 2),
      top: Engine.getActualPixel(el.offsetHeight / 5)
    });
    Engine.animation(engine);

    engine.addEventListener('touchStart', console.log)
  }
}

game.initial();

