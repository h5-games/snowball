import Engine from './Engine';
import Ball, { BallInterface } from './Ball';

const game = new Engine(document.body);
game.createUnit<BallInterface>(Ball, {
  id: 'ball',
  left: 10,
  top: 10,
  radius: 10,
  color: '#999'
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
