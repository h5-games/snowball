import {
  Entity,
  Scene,
  Renderer,
  Camera,
  Animation,
  utils,
  TMEvent
} from './Engine';
import SnowBall from './SnowBall';
import Tree, { createTree } from './Tree';
import { UIEntityRenderMap } from './entityRenderMap';

const { getActualPixel } = utils;

class SnowballGame {
  renderer: Renderer;
  camera: Camera;
  scene: Scene;
  animation: Animation;
  gameEvent: TMEvent;

  uiRenderer: Renderer;
  uiCamera: Camera;
  uiScene: Scene;
  uiEvent: TMEvent;

  constructor(public $el: HTMLElement) {
    const { offsetWidth, offsetHeight } = $el;

    // 游戏
    const renderer = new Renderer();
    renderer.setSize(offsetWidth, offsetHeight);
    $el.appendChild(renderer.dom);
    const camera = new Camera(renderer); // 创建照相机 自动跟随渲染区域
    const scene = new Scene();
    const animation = new Animation(this.animationFrame.bind(this));
    const gameEvent = new TMEvent(renderer.dom);

    // 交互界面
    const uiRenderer = new Renderer({
      style: { position: 'absolute', left: '0px', top: '0px', zIndex: '1' },
      entityRenderMap: UIEntityRenderMap
    });
    uiRenderer.setSize(offsetWidth, offsetHeight);
    $el.appendChild(uiRenderer.dom);
    const uiCamera = new Camera(uiRenderer);
    const uiScene = new Scene();
    const uiEvent = new TMEvent(uiRenderer.dom);

    Object.assign(this, {
      renderer,
      scene,
      camera,
      animation,
      gameEvent,

      uiRenderer,
      uiCamera,
      uiScene,
      uiEvent
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
    const { scene, renderer, snowball, animation, treeList } = this;
    const { translateY, height: rendererHeight } = renderer;

    {
      const { startTime } = animation;
      this.elapsedTime = timestamp - startTime;
    }

    {
      const endPosition = rendererHeight / 2;
      let { distance } = snowball.config;
      const { top } = snowball.config;
      const offsetTop = top + translateY; // 算出小球距离 canvas 顶部的距离 而非整体场景顶部的距离

      if (offsetTop > endPosition) {
        // 小球滚动到 canvas 的一半的时候画布偏移的速度与小球向下位移的速度保持一致

        renderer.translate(0, -distance);
      } else {
        // 小球未滚动到 canvas 的一半将会呈加速度，画布偏移的速度也渐渐随着增加为小球运动的速度
        const ratio = 1 - (endPosition - offsetTop) / endPosition; // 计算 offsetTop 接近中点的比率
        distance = getActualPixel(ratio * 3);
        renderer.translate(0, -(ratio * distance));
      }

      snowball.mergeConfig({ distance });
      snowball.move();
    }

    {
      const removeIndex = []; // 被删除的树木
      treeList.forEach((tree, index) => {
        const { top, height } = tree.config;
        if (top + height < -translateY) {
          // 树木超出场景移除
          scene.remove(tree.id);
          removeIndex.push(index);
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

  snowball: SnowBall;
  treeList: Tree[];
  ready() {
    const {
      renderer,
      scene,
      treeResource,
      uiScene,
      uiEvent,
      uiRenderer,
      gameEvent
    } = this;
    const { width: rendererWidth, height: rendererHeight } = renderer;
    const minTop = rendererHeight / 2;

    // 创建雪球
    const snowball = new SnowBall({
      radius: 24,
      left: rendererWidth / 2,
      top: minTop / 3
    });
    this.snowball = scene.add(snowball);

    // 初始创建🌲
    this.treeList = createTree(10, {
      minX: 0,
      maxX: rendererWidth,
      minY: minTop,
      maxY: minTop + rendererHeight,
      resource: treeResource
    });
    this.treeList.forEach(tree => {
      scene.add(tree);
    });

    gameEvent.add('touchStart', () => {
      let { direction } = snowball.config;
      direction = -direction; // 按下转向
      snowball.mergeConfig({ turnTo: true, direction });
    });

    gameEvent.add('touchEnd', () => {
      snowball.mergeConfig({ turnTo: false });
    });

    {
      // 开始游戏遮罩
      const startMaskEntity = new Entity('start-mask', {
        width: rendererWidth,
        height: rendererHeight
      });

      uiScene.add(startMaskEntity);

      uiEvent.add('tap', () => {
        this.startGame();
        uiRenderer.setVisible(false);
      });
    }

    this.render();
  }

  render() {
    const { camera, scene, renderer, uiRenderer, uiScene, uiCamera } = this;
    renderer.render(scene, camera);
    uiRenderer.render(uiScene, uiCamera);
  }
}

(async function () {
  const snowballGame = new SnowballGame(document.body);
  await snowballGame.loadResource();

  snowballGame.ready();
})();
