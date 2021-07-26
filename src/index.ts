import { randomRange } from './utils';
import {
  Engine,
  Entity,
  Scene,
  Renderer,
  Camera,
  Animation,
  EntityRenderMap,
  utils
} from './Engine';

const { getActualPixel } = utils;

interface TreeData {
  left: number;
  top: number;
  width: number;
  height: number;
  resource: HTMLImageElement;
  interval: number;
  distance: number;
}

interface SnowBallData {
  left: number;
  top: number;
  radius: number;
  angle: number;
  distance: number;
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
          resource: treeResource,
          interval: 20,
          distance: 0
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

  elapsedTime = 0;
  animationFrame(timestamp: number) {
    const { camera, scene, renderer, snowball, actualHeight, animation } = this;

    const { startTime } = animation;
    this.elapsedTime = timestamp - startTime;

    const endPosition = actualHeight / 2;
    const { distance, top } = snowball.data;

    {
      snowball.setData({
        top: top + distance
      });
    }

    const { translateY } = renderer;

    {
      scene.entityMap.forEach(entity => {
        if (entity.type === 'tree') {
          const { top, height } = (entity as Entity<TreeData>).data;
          if (top + height < -translateY) {
            // 超出场景移除
            scene.remove(entity.id);
          }
        }
      });
    }

    if (snowball.data.top > endPosition) {
      const { top: cameraTop } = camera;
      camera.update({
        top: cameraTop + distance
      });
      renderer.translate(0, -distance);
    }

    this.render();
  }

  startGame() {
    const { animation, snowball } = this;
    if (animation.status === 'stationary') {
      snowball.setData({
        distance: getActualPixel(1)
      });
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
      angle: 0,
      distance: 0
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
