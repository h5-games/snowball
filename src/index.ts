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

interface SnowBallData {
  left: number;
  top: number;
  radius: number;
  speed: number;
}

class SnowballGame {
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
    entityRenderMap.set('snowball', function (ctx) {
      const { radius, left, top } = this.data;

      ctx.beginPath();
      ctx.fillStyle = '#d2fdff';
      ctx.arc(left, top, radius, 0, 2 * Math.PI);
      ctx.fill();
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
  async loadResource(): Promise<SnowballGame> {
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
  createTree(
    num: number,
    {
      minX,
      minY,
      maxX,
      maxY
    }: {
      minX: number;
      minY: number;
      maxX: number;
      maxY: number;
    }
  ) {
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

  snowball: Entity<SnowBallData>;
  createSnowBall(data: SnowBallData) {
    const { scene } = this;
    this.snowball = scene.add<SnowBallData>(new Entity('snowball', data));
  }

  animationFrame(timestamp: number) {
    const { camera, scene, renderer, snowball, actualHeight } = this;
    const { offsetTop } = camera;

    {
      const { speed, top } = snowball.data;
      snowball.setData({
        top: top + getActualPixel(1)
      });
    }

    if (snowball.data.top > actualHeight / 2) {
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
    }

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
  const snowballGame = new SnowballGame(document.body);
  await snowballGame.loadResource();
  {
    const { actualWidth, actualHeight } = snowballGame;
    const minTop = actualHeight / 2;

    // 创建雪球
    snowballGame.createSnowBall({
      radius: 24,
      left: actualWidth / 2,
      top: minTop / 3,
      speed: 50
    });

    // 初始创建🌲
    snowballGame.createTree(10, {
      minX: 0,
      maxX: actualWidth,
      minY: minTop,
      maxY: minTop + actualHeight
    });
  }
  snowballGame.render();
})();
