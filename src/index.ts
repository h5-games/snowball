import Engine from './Engine';
import Ball from './Ball';

const game = new Engine(document.body);
game.createUnit(Ball, {
  id: 'ball'
});

async function getResources() {
  const resources = await Engine.loadResource([
    {
      id: 1,
      src: '/static/images/terr.png'
    }
  ]);
}

getResources();

game.paint();
