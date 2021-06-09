import { getActualPixel, randomRange } from './utils';
import Renderer, { EntityRenderMap } from './Renderer';
import Engine from './Engine';
import Entity from './Entity';
import Camera from './Camera';
import Animation from './Animation';

interface TreeData {
  left: number;
  top: number;
  width: number;
  height: number;
  resource: HTMLImageElement;
}

(async function () {
  const entityRenderMap: EntityRenderMap = new Map();

  entityRenderMap.set('tree', function (ctx) {
    const { resource, left, top, width, height } = this.data;

    ctx.beginPath();
    ctx.drawImage(resource, left, top, width, height);
  });

  const { offsetWidth, offsetHeight } = document.body;
  const actualWidth = getActualPixel(offsetWidth);
  const actualHeight = getActualPixel(offsetHeight);

  const renderer = new Renderer(offsetWidth, offsetHeight, {
    entityRenderMap
  });
  document.body.appendChild(renderer.dom);

  window.addEventListener('resize', () => {
    const { offsetWidth, offsetHeight } = document.body;
    renderer.setSize(offsetWidth, offsetHeight);
  });

  const [treeResourceUrl] = await Engine.loadResource(['/images/terr.png']);
  const treeResource = await new Promise<HTMLImageElement>(resolve => {
    const img = new Image();
    img.src = treeResourceUrl;
    img.onload = () => {
      resolve(img);
    };
  });

  const scene = new Engine.Scene();
  const trees: Entity<TreeData>[] = [];
  for (let i = 0; i < 10; i++) {
    const width = getActualPixel(40);
    const minTop = actualHeight / 3;
    const tree = new Entity<TreeData>('tree', {
      left: randomRange(0, actualWidth - width),
      top: randomRange(minTop, minTop + actualHeight),
      width: width,
      height: getActualPixel(80),
      resource: treeResource
    });
    trees.push(tree);
  }
  trees
    .sort((x, y) => x.data.top + x.data.height - (y.data.top + y.data.height))
    .forEach(tree => {
      scene.add(tree);
    });

  const camera = new Camera({
    width: actualWidth,
    height: actualHeight
  });

  const animation = new Animation(timestamp => {
    camera.top += getActualPixel(1);
    renderer.render(scene, camera);
  });
  animation.start();
})();
