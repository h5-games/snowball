import Engine from './Engine';

const game = new Engine(document.body);

async function getResources() {
  const resources = await game.loadResource([
    {
      id: 1,
      src: '/static/images/terr.png'
    },
    {
      id: 2,
      src: '/static/images/terr.pngs'
    },
    {
      id: 3,
      src: '/static/images/terr.png'
    }
  ], console.log);
  console.log(resources);
}

getResources();
