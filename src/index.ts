import { randomRange } from './utils';
import {
  Engine,
  Entity,
  TEntity,
  Scene,
  Renderer,
  Camera,
  Animation,
  utils
} from './Engine';
import SnowBall from './SnowBall';
import Tree from './Tree';

const { getActualPixel } = utils;

class SnowballGame {
  engine: Engine;
  scene: Scene;
  camera: Camera;
  renderer: Renderer;
  animation: Animation;

  actualWidth: number = 0;
  actualHeight: number = 0;

  constructor(el) {
    const { offsetWidth, offsetHeight } = el;

    const renderer = new Renderer(offsetWidth, offsetHeight);
    const { width: actualWidth, height: actualHeight } = renderer;

    window.addEventListener('resize', () => {
      const { offsetWidth, offsetHeight } = el;
      renderer.setSize(offsetWidth, offsetHeight);
    });

    el.appendChild(renderer.dom);

    const camera = new Camera(renderer); // 创建照相机 自动跟随渲染区域
    const engine = new Engine(renderer.dom);

    const scene = new Scene();
    const animation = new Animation(this.animationFrame.bind(this));

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
        return Entity.create<Tree>(
          'tree',
          new Tree({
            left: randomRange(minX, maxX - width),
            top: randomRange(minY, maxY - height),
            width: width,
            height: height,
            resource: treeResource,
            interval: 20
          })
        );
      })
      .sort((x, y) => x.top + x.height - (y.top + y.height))
      .forEach(tree => {
        scene.add(tree);
      });
  }

  snowball: TEntity<SnowBall>;
  createSnowBall(data: SnowBall) {
    const { scene } = this;
    return (this.snowball = scene.add(
      Entity.create<SnowBall>('snowball', data)
    ));
  }

  elapsedTime = 0;
  animationFrame(timestamp: number) {
    const { scene, renderer, snowball, actualHeight, animation } = this;
    const { translateY } = renderer;

    {
      const { startTime } = animation;
      this.elapsedTime = timestamp - startTime;
    }

    {
      const endPosition = actualHeight / 2;
      let { distance } = snowball;
      const { top } = snowball;
      const offsetTop = top + translateY; // 算出小球距离 canvas 顶部的距离 而非整体场景顶部的距离

      if (offsetTop > endPosition) {
        // 小球滚动到 canvas 一半的时候画布偏移的速度与小球向下位移的速度保持一致

        renderer.translate(0, -distance);
      } else {
        // 小球未滚动到 canvas 一半将会呈加速度，画布偏移的速度也渐渐随着增加为小球运动的速度
        const ratio = 1 - (endPosition - offsetTop) / endPosition; // 计算 offsetTop 接近中点的比率
        distance = getActualPixel(ratio * 3);
        renderer.translate(0, -(ratio * distance));
      }

      snowball.move(distance);
    }

    {
      scene.entityMap.forEach(entity => {
        if (entity.type === 'tree') {
          const { top, height } = entity as TEntity<Tree>;
          if (top + height < -translateY) {
            // 超出场景移除
            scene.remove(entity.id);
          }
        }
      });
    }

    this.render();
  }

  startGame() {
    const { animation } = this;
    if (animation.status === 'stationary') {
      animation.start();
    }
  }

  ready() {
    const { engine, startGame, actualWidth, actualHeight } = this;
    const minTop = actualHeight / 2;

    // 创建雪球
    this.createSnowBall(
      new SnowBall({
        radius: 24,
        left: actualWidth / 2,
        top: minTop / 3
      })
    );

    // 初始创建🌲
    this.createTree(10, {
      minX: 0,
      maxX: actualWidth,
      minY: minTop,
      maxY: minTop + actualHeight
    });

    engine.addEventListener('touchStart', startGame.bind(this));

    this.render();
    return this;
  }

  render() {
    const { camera, scene, renderer } = this;
    renderer.render(scene, camera);
  }
}

(async function () {
  const snowballGame = new SnowballGame(document.body);
  await snowballGame.loadResource();

  snowballGame.ready();
})();
