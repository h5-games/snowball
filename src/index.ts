import Engine, { IEngine, IResources } from './Engine';
import Ball, { IBall, IBallConfig } from './Ball';
import Terr, { ITerrConfig } from './Terr';
import Util from './Util';
import { ICamera } from './Camera';
import { terrConfig } from './config';

interface IGame {
  resources: IResources;
  engine: IEngine;
  ball: IBall;
  camera: ICamera;
  initial(): void;
  startGame(e: TouchEvent): void;
}

const game: IGame = {
  resources: {},
  engine: null,
  ball: null,
  camera: null,
  async initial() {
    const resources = await Engine.loadResource({
      terrResource: {
        src: terrConfig.terrSrc
      }
    });
    const { terrResource } = resources;
    const el = document.body;
    const engine = new Engine(el);
    game.engine = engine;
    game.resources = resources;
    const _offsetHeight = Engine.getActualPixel(el.offsetHeight);
    const _offsetWidth = Engine.getActualPixel(el.offsetWidth);

    game.ball = engine.createUnit<Ball, IBallConfig>(Ball, {
      radius: _offsetWidth / 35,
      left: _offsetWidth / 2,
      top: _offsetHeight / 3,
      speed: Engine.getActualPixel(10)
    });

    new Array(terrConfig.initialTerrNum)
      .fill(null)
      .map(() => {
        const size = terrConfig.sizes[Math.floor(Math.random() * terrConfig.sizes.length)];
        const { trunk } = size;
        const left = Util.randomPosition(0 - _offsetWidth, _offsetWidth + _offsetWidth);
        const top = Util.randomPosition(_offsetHeight / 2, _offsetHeight);
        const width = Engine.getActualPixel(size.width);
        const height = Engine.getActualPixel(size.height);

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
      .forEach(config => engine.createUnit<Terr, ITerrConfig>(Terr, config));

    this.camera = engine.createCamera({
      width: el.offsetWidth,
      height: el.offsetHeight
    });
    engine.addEventListener('touchStart', game.startGame);
  },

  startGame() {
    const { engine, ball, camera } = game;

    ball.animation(() => {
      camera.offsetTop -= ball.speed;
    });
    engine.removeEventListener('touchStart', game.startGame);
    game.startGame = null;
  }
};

game.initial();

(<any>window).game = game;

