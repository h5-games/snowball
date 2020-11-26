import Renderer, { EntityRenderMap } from './Renderer';
import Engine from './Engine';
import Entity from './Entity';
import Camera from './Camera';

const entityRenderMap: EntityRenderMap = new Map();

entityRenderMap.set('atomic', function (ctx) {
  console.log(ctx, this);
});

const { offsetWidth, offsetHeight } = document.body;

const renderer = new Renderer(offsetWidth, offsetHeight, {
  entityRenderMap
});
document.body.appendChild(renderer.dom);

window.addEventListener('resize', () => {
  const { offsetWidth, offsetHeight } = document.body;
  renderer.setSize(offsetWidth, offsetHeight);
});

(async function () {
  const { treeUrl } = await Engine.loadResource({
    treeUrl: '/images/terr.png'
  });

  const scene = new Engine.Scene();
  const tree = new Entity('image', [10, 10, 10, 20], {
    url: '/images/terr.png'
  });
  scene.add(tree);
  const camera = new Camera();

  renderer.render(scene, camera);
})();
