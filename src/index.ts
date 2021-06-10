import { getActualPixel, randomRange } from './utils';
import Renderer, { EntityRenderMap } from './Renderer';
import Engine from './Engine';
import Entity from './Entity';
import Scene from './Scene';
import Camera from './Camera';
import Animation from './Animation';

interface TreeData {
  left: number;
  top: number;
  width: number;
  height: number;
  resource: HTMLImageElement;
}

class Snowball {
  scene: Scene;
  camera: Camera;
  renderer: Renderer;
  animation: Animation;

  actualWidth: number;
  actualHeight: number;

  constructor(el) {
    const entityRenderMap: EntityRenderMap = new Map();
    entityRenderMap.set('tree', function (ctx) {
      const { resource, left, top, width, height } = this.data;

      ctx.beginPath();
      ctx.drawImage(resource, left, top, width, height);
    });

    const { offsetWidth, offsetHeight } = el;
    const actualWidth = getActualPixel(offsetWidth);
    const actualHeight = getActualPixel(offsetHeight);

    const renderer = new Renderer(offsetWidth, offsetHeight, {
      entityRenderMap
    });

    window.addEventListener('resize', () => {
      const { offsetWidth, offsetHeight } = el;
      renderer.setSize(offsetWidth, offsetHeight);
    });

    const scene = new Scene();
    const camera = new Camera({
      width: actualWidth,
      height: actualHeight
    });

    const engine = new Engine(renderer.dom);
    el.appendChild(renderer.dom);

    const animation = new Animation(this.animationFrame.bind(this));

    engine.addEventListener('touchStart', this.startGame.bind(this));

    Object.assign(this, {
      engine,
      renderer,
      scene,
      camera,
      animation,
      actualWidth,
      actualHeight
    });
  }

  treeResource: HTMLImageElement;
  async loadResource(): Promise<Snowball> {
    const [treeResourceUrl] = await Engine.loadResource(['/images/terr.png']);
    this.treeResource = await new Promise<HTMLImageElement>(resolve => {
      const img = new Image();
      img.src = treeResourceUrl;
      img.onload = () => {
        resolve(img);
      };
    });
    return this;
  }

  /**
   * @description 创建🌲
   * @param num 创建数量
   * @param minX
   * @param minY
   * @param maxX
   * @param maxY
   */
  createTree(num, { minX, minY, maxX, maxY }) {
    const { treeResource, scene } = this;
    return new Array(num)
      .fill(null)
      .map(() => {
        const width = getActualPixel(40);
        const height = width * 2;
        return new Entity<TreeData>('tree', {
          left: randomRange(minX, maxX - width),
          top: randomRange(minY, maxY - height),
          width: width,
          height: height,
          resource: treeResource
        });
      })
      .sort((x, y) => x.data.top + x.data.height - (y.data.top + y.data.height))
      .forEach(tree => {
        scene.add(tree);
      });
  }

  animationFrame() {
    const { camera, scene, renderer } = this;
    const { offsetTop } = camera;

    scene.entityMap.forEach(entity => {
      if (entity.type === 'tree') {
        const { top, height } = (entity as Entity<TreeData>).data;
        if (top + height < offsetTop) {
          scene.remove(entity.id);
        }
      }
    });

    const offset = getActualPixel(1);
    camera.update({
      offsetTop: offsetTop + offset
    });
    renderer.translate(0, -offset);
    this.render();
  }

  startGame() {
    const { animation } = this;
    if (animation.status === 'stationary') {
      animation.start();
    }
  }

  render() {
    const { camera, scene, renderer } = this;
    renderer.render(scene, camera);
  }
}

(async function () {
  const snowball = new Snowball(document.body);
  await snowball.loadResource();
  {
    // 初始创建🌲
    const { actualWidth, actualHeight } = snowball;
    const minTop = actualHeight / 2;
    snowball.createTree(10, {
      minX: 0,
      maxX: actualWidth,
      minY: minTop,
      maxY: minTop + actualHeight
    });
  }
  snowball.render();
})();
