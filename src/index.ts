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
import {
  UIEntityRenderMap,
  ScoreEntity,
  TimerEntity,
  OverMaskEntity
} from './entityRenderMap';
import { checkRectCircleCollide } from './utils/collide';

const { getActualPixel } = utils;

class SnowballGame {
  renderer!: Renderer;
  camera!: Camera;
  scene!: Scene;
  animation!: Animation;
  gameEvent!: TMEvent;

  uiRenderer!: Renderer;
  uiCamera!: Camera;
  uiScene!: Scene;
  uiEvent!: TMEvent;

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

  treeResource!: HTMLImageElement;
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

  maxTreeNum = 10;
  animationFrame(timestamp: number) {
    let { maxTreeNum } = this;
    const {
      scene,
      renderer,
      snowball,
      animation,
      treeList,
      timerEntity
    } = this;
    const { width: rendererWidth, height: rendererHeight } = renderer;

    {
      const { startTime } = animation;
      timerEntity.mergeConfig({
        millisecond: timestamp - startTime
      });
    }

    {
      const endPosition = rendererHeight / 2;
      let { distance } = snowball.config;
      const { y: snowballY } = snowball.config;
      const offsetTop = snowballY + renderer.translateY; // 算出小球距离 canvas 顶部的距离 而非整体场景顶部的距离

      if (Math.ceil(offsetTop) >= endPosition) {
        // 小球滚动到 canvas 的一半的时候画布偏移的速度与小球向下位移的速度保持一致
        maxTreeNum += 1;
        this.maxTreeNum = maxTreeNum;
        renderer.translate(0, -distance);
      } else {
        // 小球未滚动到 canvas 的一半将会呈加速度，画布偏移的速度也渐渐随着增加为小球运动的速度
        const ratio = 1 - (endPosition - offsetTop) / endPosition; // 计算 offsetTop 接近中点的比率
        distance = getActualPixel(ratio * 3);
        renderer.translate(0, -(ratio * distance)); // 初始画布向上偏移的速度低于小球向下走的速度，使得小球看起来在向下走
      }

      snowball.mergeConfig({ distance });
      snowball.move();
    }

    const { translateY } = renderer;
    {
      for (const [id, tree] of Array.from(treeList)) {
        {
          // 小球与🌲底部发生碰撞
          const { config: snowballConfig } = snowball;
          const { left, width, height, bottom } = tree.body;
          let _height = snowballConfig.radius; // 小球半径高度为碰撞区域的高度
          _height = _height > height ? height : _height; // 最高的碰撞区域高度为树干高度
          if (
            checkRectCircleCollide(
              {
                left,
                top: bottom - _height,
                height: _height,
                width
              },
              snowballConfig
            )
          ) {
            this.gamgeOver();
            return false;
          }
        }

        {
          const { top, height } = tree.config;
          // 🌲超出场景移除
          if (top + height < -translateY) {
            scene.remove(tree.id);
            treeList.delete(tree.id);
          }
        }
      }

      const { treeResource } = this;
      if (treeList.size < maxTreeNum) {
        // 将🌲保证在一定范围内
        const keys = Array.from(treeList.keys());
        const lastTree = treeList.get(keys[keys.length - 1]);
        const { config } = lastTree!;
        let minY = config.top + config.height;
        const viewerTop = -translateY + rendererHeight;
        if (minY < viewerTop) minY = viewerTop;
        // 缺多少🌲补多少🌲
        createTree(maxTreeNum - treeList.size, {
          minX: 0,
          maxX: rendererWidth,
          minY,
          maxY: minY + rendererHeight / 10,
          resource: treeResource
        }).forEach(tree => {
          scene.add(tree);
          this.treeList.set(tree.id, tree);
        });
      }
    }

    this.render();
  }

  scoreTimer: number = 0;
  startGame() {
    const { animation, scoreEntity } = this;
    if (animation.status === 'stationary') {
      animation.start();
      window.clearInterval(this.scoreTimer);
      this.scoreTimer = window.setInterval(() => {
        // 每 500 毫秒增加 1 分
        scoreEntity.mergeConfig({
          count: scoreEntity.config.count + 1
        });
      }, 500);
    }
  }

  gamgeOver() {
    const {
      scoreTimer,
      overMaskEntity,
      scoreEntity,
      timerEntity,
      uiRenderer
    } = this;

    window.clearInterval(scoreTimer);
    uiRenderer.setPenetrate(false);
    overMaskEntity.setVisible(true);
    overMaskEntity.mergeConfig({
      score: scoreEntity.config.count
    });
    scoreEntity.setVisible(false);
    timerEntity.setVisible(false);

    this.render();
  }

  snowball!: SnowBall;
  treeList!: Map<string, Tree>;
  scoreEntity!: ScoreEntity;
  timerEntity!: TimerEntity;
  overMaskEntity!: OverMaskEntity;

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
      x: rendererWidth / 2,
      y: minTop / 2
    });
    this.snowball = scene.add(snowball);

    this.maxTreeNum = 10;
    // 初始给前两屏幕总计创建 12 棵🌲
    this.treeList = new Map();
    createTree(12, {
      minX: 0,
      maxX: rendererWidth,
      minY: minTop,
      maxY: rendererHeight * 2,
      resource: treeResource
    }).forEach(tree => {
      scene.add(tree);
      this.treeList.set(tree.id, tree);
    });

    {
      // 分数显示
      const scoreEntity = new Entity('score', {
        count: 0
      });
      scoreEntity.setVisible(false);

      this.scoreEntity = scoreEntity;
      uiScene.add(scoreEntity);

      const timerEntity = new Entity('timer', {
        millisecond: 0,
        rendererWidth
      });
      timerEntity.setVisible(false);

      this.timerEntity = timerEntity;
      uiScene.add(timerEntity);

      // 开始游戏遮罩
      const startMaskEntity = new Entity('start-mask', {
        width: rendererWidth,
        height: rendererHeight
      });

      uiScene.add(startMaskEntity);

      uiEvent.add('tap', () => {
        scoreEntity.setVisible(true);
        timerEntity.setVisible(true);
        startMaskEntity.setVisible(false);

        uiRenderer.setPenetrate(true);
        this.startGame();
      });
    }

    {
      // 游戏结束遮罩
      const overMaskEntity = new Entity('over-mask', {
        width: rendererWidth,
        height: rendererHeight,
        score: 0
      });
      overMaskEntity.setVisible(false);
      uiScene.add(overMaskEntity);
      this.overMaskEntity = overMaskEntity;
    }

    gameEvent.add('touchStart', () => {
      let { direction } = snowball.config;
      direction = -direction; // 按下转向
      snowball.mergeConfig({ turnTo: true, direction });
    });

    gameEvent.add('touchEnd', () => {
      snowball.mergeConfig({ turnTo: false });
    });

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
