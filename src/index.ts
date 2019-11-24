import Engine, { IEngine, IResources } from './Engine';
import Ball, { IBallConfig } from './Ball';
import Terr, { ITerrConfig } from './Terr';
import Util from './Util';
import { ICamera } from './Camera';
import { terrConfig, levelConfig } from './config';

interface ICreateTerrPosition {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface IGetPosition {
  (size): ICreateTerrPosition
}

interface IGame {
  $el: HTMLElement,
  resources: IResources;
  engine: IEngine;
  level: number;
  ball: Ball;
  terrs: {
    [propName: string]: Terr
  };
  camera: ICamera;
  initial(): void;
  startGame(e: TouchEvent): void;
  createTerr(getPosition: IGetPosition): void;
}

const game: IGame = {
  $el: null,
  resources: {},
  engine: null,
  level: 0,
  ball: null,
  terrs: {},
  camera: null,
  async initial() {
    const resources = await Engine.loadResource({
      terrResource: {
        src: terrConfig.terrSrc
      }
    });
    const el = document.body;
    const engine = new Engine(el);

    const level = levelConfig[game.level];
    game.$el = el;
    game.engine = engine;
    game.resources = resources;
    const _offsetHeight = Engine.getActualPixel(el.offsetHeight);
    const _offsetWidth = Engine.getActualPixel(el.offsetWidth);
    game.ball = engine.createUnit<Ball, IBallConfig>(Ball, {
      radius: _offsetWidth / 35,
      left: _offsetWidth / 2,
      top: _offsetHeight / 3,
      speed: Engine.getActualPixel(level.ballSpeed)
    });

    game.createTerr(size => ({
      left: 0,
      right: _offsetWidth - size.width,
      top: _offsetHeight / 2,
      bottom: _offsetHeight + _offsetHeight / 2
    }))

    game.camera = engine.createCamera({
      width: el.offsetWidth,
      height: el.offsetHeight
    });
    engine.addEventListener('touchStart', game.startGame);
  },

  startGame() {
    const { engine, ball, camera, $el, terrs } = game;
    const _offsetWidth = Engine.getActualPixel($el.offsetWidth);
    const _offsetHeight = Engine.getActualPixel($el.offsetHeight);

    ball.animation(() => {
      camera.offsetTop -= ball.speed;
      for (let id in terrs) {
        if (!terrs.hasOwnProperty(id)) continue;
        const terr = terrs[id];
        if (terr.top + terr.height + camera.offsetTop < 0) {
          delete terrs[id];
          engine.deleteUnit(id);
        }
      }
      const top = ball.top + (_offsetHeight * (2 / 3))
      game.createTerr(size => ({
        left: 0,
        right: _offsetWidth - size.width,
        top,
        bottom: _offsetHeight + top
      }))
    });
    engine.removeEventListener('touchStart', game.startGame);
    game.startGame = null;
  },

  createTerr(getPosition: IGetPosition) {
    const { engine, resources, terrs } = game;

    const level = levelConfig[game.level];
    const { terrResource } = resources;

    new Array(level.terrNum - Object.keys(terrs).length)
      .fill(null)
      .map(() => {
        const size = terrConfig.sizes[Math.floor(Math.random() * terrConfig.sizes.length)];
        const { trunk } = size;
        const width = Engine.getActualPixel(size.width);
        const height = Engine.getActualPixel(size.height);
        const position = getPosition({ width, height });

        const left = Util.randomPosition(position.left, position.right);
        const top = Util.randomPosition(position.top, position.bottom);

        return {
          left, top, width, height,
          trunk: {
            width: Engine.getActualPixel(trunk.width),
            height: Engine.getActualPixel(trunk.height),
            left: left + Engine.getActualPixel(trunk.left),
            top: top + Engine.getActualPixel(trunk.top)
          },
          src: terrResource.src
        }
      })
      .sort((x, y) => (x.top + x.height) - (y.top + y.height))
      .forEach(config => {
        const terr = engine.createUnit<Terr, ITerrConfig>(Terr, config);
        terrs[terr.id] = terr;
      });
  }
};

game.initial();

(<any>window).game = game;

