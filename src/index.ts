import Renderer, { EntityRenderMap } from './Renderer';
import Engine from './Engine';
import Entity from './Entity';
import Camera from './Camera';
import { getActualPixel } from './utils';

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
  const [treeResource] = await Engine.loadResource(['/images/terr.png']);

  const scene = new Engine.Scene();
  const tree = new Entity(
    'image',
    [
      getActualPixel(0),
      getActualPixel(0),
      getActualPixel(284),
      getActualPixel(561)
    ],
    {
      resource: treeResource
    }
  );
  scene.add(tree);
  const camera = new Camera();

  renderer.render(scene, camera);
})();
