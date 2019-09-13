import Engine from './Engine';
import Ball from './Ball';

const game = {
  resources: [],
  async initial() {
    const engine = new Engine(document.body);
    engine.createUnit(Ball, {
      id: 'ball'
    });
    engine.addEventListener('touchStart', console.log)
    this.resources = await Engine.loadResource([
      {
        id: 'terr',
        src: '/static/images/terr.png'
      }
    ]);
    engine.paint();
  }
}

game.initial();
