import Renderer, { EntityRenderMap } from './Renderer';
import Scene from './Scene';
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

const scene = new Scene();
const tree = new Entity('image', {
  url: '/images/terr.png'
});
scene.add(tree);

const camera = new Camera();

renderer.render(scene, camera);
