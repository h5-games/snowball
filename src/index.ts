import Engine from './Engine';

const game = new Engine(document.body);

async function getResources() {
  const resources = await game.loadResource([
    {
      id: 1,
      src: '/static/images/terr.png'
    }
  ]);
  console.log(resources);
}

getResources();
