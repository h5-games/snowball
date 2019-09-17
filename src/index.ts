import Engine, { IEngine, IResources } from './Engine';
import Ball, { IBallConfig } from './Ball';
import Terr, { ITerrConfig } from './Terr';
import { terrConfig } from './config';

interface IGame {
  resources: IResources;
  engine: IEngine;
  initial(): void;
}

const game: IGame = {
  resources: {},
  engine: null,
  async initial() {
    const resources = await Engine.loadResource({
      terrResource: {
        src: terrConfig.terrSrc
      }
    });
    const { terrResource } = resources;
    const el = document.body;
    const engine = new Engine(el);
    this.engine = engine;
    this.resources = resources;
    const _offsetHeight = Engine.getActualPixel(el.offsetHeight);
    const _offsetWidth = Engine.getActualPixel(el.offsetWidth);

    engine.createUnit<Ball, IBallConfig>(Ball, {
      radius: _offsetWidth / 35,
      left: _offsetWidth / 2,
      top: _offsetHeight / 5
    });

    new Array(terrConfig.initialTerrNum)
      .fill(null)
      .map(() => {
        const size = terrConfig.sizes[Math.floor(Math.random() * terrConfig.sizes.length)];
        const { trunk } = size;
        const left = Engine.randomPosition(0 - _offsetWidth, _offsetWidth + _offsetWidth);
        const top = Engine.randomPosition(_offsetHeight / 3, _offsetHeight);
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

    Engine.animation(engine);

    engine.addEventListener('touchStart', console.log)
  }
};

game.initial();

