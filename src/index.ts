import {
  Entity,
  TEntity,
  Scene,
  Renderer,
  Camera,
  Animation,
  utils
} from './Engine';
import SnowBall from './SnowBall';
import Tree, { constructorTree } from './Tree';

const { getActualPixel } = utils;

class SnowballGame {
  scene: Scene;
  camera: Camera;
  renderer: Renderer;
  animation: Animation;

  uiRenderer: Scene;
  uiCamera: Camera;
  uiScene: Renderer;

  constructor(public $el: HTMLElement) {
    const { offsetWidth, offsetHeight } = $el;

    // 游戏
    const renderer = new Renderer();
    renderer.setSize(offsetWidth, offsetHeight);
    $el.appendChild(renderer.dom);
    const camera = new Camera(renderer); // 创建照相机 自动跟随渲染区域
    const scene = new Scene();
    const animation = new Animation(this.animationFrame.bind(this));

    // 交互界面
    const uiRenderer = new Renderer({ style: { position: 'absolute' } });
    uiRenderer.setSize(offsetWidth, offsetHeight);
    $el.appendChild(uiRenderer.dom);
    const uiCamera = new Camera();
    const uiScene = new Scene();

    Object.assign(this, {
      renderer,
      scene,
      camera,
      animation,
      uiRenderer,
      uiCamera,
      uiScene
    });
  }

  treeResource: HTMLImageElement;
  async loadResource(): Promise<SnowballGame> {
    const [treeResourceUrl] = await utils.loadResource(['/images/terr.png']);
    this.treeResource = await new Promise<HTMLImageElement>(resolve => {
      const img = new Image();
      img.src = treeResourceUrl;
      img.onload = () => {
        resolve(img);
      };
    });
    return this;
  }

  elapsedTime = 0;
  animationFrame(timestamp: number) {
    const { scene, renderer, snowball, animation } = this;
    const { translateY, height: rendererHeight } = renderer;

    {
      const { startTime } = animation;
      this.elapsedTime = timestamp - startTime;
    }

    {
      const endPosition = rendererHeight / 2;
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

  snowball: TEntity<SnowBall>;
  ready() {
    const { startGame, renderer, scene, treeResource } = this;
    const { width: rendererWidth, height: rendererHeight } = renderer;
    const minTop = rendererHeight / 2;

    // 创建雪球
    this.snowball = scene.add(
      Entity.create<SnowBall>(
        'snowball',
        new SnowBall({
          radius: 24,
          left: rendererWidth / 2,
          top: minTop / 3
        })
      )
    );

    // 初始创建🌲
    constructorTree(10, {
      minX: 0,
      maxX: rendererWidth,
      minY: minTop,
      maxY: minTop + rendererHeight,
      resource: treeResource
    }).forEach(tree => {
      scene.add(tree);
    });

    this.render();
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
