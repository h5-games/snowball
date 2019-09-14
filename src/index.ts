import Engine, { IEngine } from './Engine';
import { IResource } from './types';
import Ball, { IBallConfig } from './Ball';
import Terr, { IUnitConfig } from './Terr';

interface IGame {
  resources: IResource[];
  engine: IEngine;
  initial(): void;
}

const game: IGame = {
  resources: [],
  engine: null,
  async initial() {
    const resources = await Engine.loadResource([
      {
        id: 'terr',
        src: '/static/images/terr.png'
      }
    ]);
    const [terrResource] = resources;
    const el = document.body;
    const engine = new Engine(el);
    this.engine = engine;
    this.resources = resources;

    engine.createUnit<Ball, IBallConfig>(Ball, {
      radius: Engine.getActualPixel(el.offsetWidth / 40),
      left: Engine.getActualPixel(el.offsetWidth / 2),
      top: Engine.getActualPixel(el.offsetHeight / 5)
    });

    for (let i = 0; i < 50; i ++) {
      engine.createUnit<Terr, IUnitConfig>(Terr, {
        left: 100,
        top: 100,
        width: 284,
        height: 561,
        trunk: {
          left: 10,
          top: 10,
          width: 10,
          height: 10
        },
        img: terrResource.resource
      });
    }

    Engine.animation(engine);

    engine.addEventListener('touchStart', console.log)
  }
}

game.initial();

