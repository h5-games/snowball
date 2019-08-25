import Engine from './Engine';
import Ball from './Ball';

const game = new Engine(document.body);
game.createUnit(new Ball(), 'ball');

async function getResources() {
  const resources = await Engine.loadResource([
    {
      id: 1,
      src: '/static/images/terr.png'
    }
  ]);
  console.log(resources);
}

getResources();
