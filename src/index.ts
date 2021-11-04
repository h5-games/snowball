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
  StartMaskEntity,
  OverMaskEntity,
  SettingIconEntity
} from './entityRenderMap';
import { checkRectCircleCollide, checkPointRectCollide } from './utils/collide';

type GamgeStatus = 'initial' | 'ready' | 'game-start' | 'game-over';

interface Resource {
  tree: HTMLImageElement | null;
  settingIcon?: HTMLImageElement | null;
}

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

  status: GamgeStatus = 'initial';

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

  resource: Resource = {
    tree: null,
    settingIcon: null
  };

  async loadResource(): Promise<SnowballGame> {
    // 先将图片资源加载至本地 然后再把本地的资源变为 Image 元素
    const [tree, settingIcon] = await utils.loadImageResource(
      await utils.loadResource(['./images/terr.png', './images/setting.png'])
    );
    this.resource.tree = tree;
    this.resource.settingIcon = settingIcon;
    return this;
  }

  maxTreeNum = 10;
  millisecond = 0;
  animationFrame(timestamp: number) {
    const { scene, renderer, snowball, maxTreeNum, treeList, animation } = this;
    const { width: rendererWidth, height: rendererHeight } = renderer;

    this.millisecond = timestamp - animation.startTime;

    {
      // 小球逻辑
      const endPosition = rendererHeight / 2;
      let { distance } = snowball.config;
      const { y: snowballY } = snowball.config;
      const offsetTop = snowballY + renderer.translateY; // 算出小球距离 canvas 顶部的距离 而非整体场景顶部的距离

      if (Math.ceil(offsetTop) >= endPosition) {
        // 小球滚动到 canvas 的一半的时候画布偏移的速度与小球向下位移的速度保持一致
        renderer.translate(0, -distance);
      } else {
        // 小球未滚动到 canvas 的一半将会呈加速度，画布偏移的速度也渐渐随着增加为小球运动的速度
        const ratio = 1 - (endPosition - offsetTop) / endPosition; // 计算 offsetTop 接近中点的比率
        distance = ratio * 3;
        renderer.translate(0, -(ratio * distance)); // 初始画布向上偏移的速度低于小球向下走的速度，使得小球看起来在向下走
      }

      snowball.mergeConfig({ distance });
      snowball.move();
    }

    // 小球撞到了两边
    const { config: snowballConfig } = snowball;
    const { x, radius } = snowballConfig;
    if (x - radius < 0 || x + radius > rendererWidth) {
      this.gamgeOver();
      return false;
    }

    {
      // 树木逻辑
      const { translateY } = renderer;
      for (const [id, tree] of Array.from(treeList)) {
        {
          // 小球与🌲底部发生碰撞
          if (checkRectCircleCollide(tree.body, snowballConfig)) {
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

      const resource = this.resource.tree;
      if (resource && treeList.size < maxTreeNum) {
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
          resource
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
      this.status = 'game-start';
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
    const { scoreTimer, overMaskEntity, scoreEntity, uiRenderer } = this;

    window.clearInterval(scoreTimer);

    // 游戏结束 使UI 界面可点击
    uiRenderer.setPenetrate(false);
    // 传入分数
    overMaskEntity.mergeConfig({
      score: scoreEntity.config.count
    });
    // 展示游戏结束提示
    overMaskEntity.setVisible(true);
    // 隐藏右上角分数
    scoreEntity.setVisible(false);

    this.render();
    this.status = 'game-over';
  }

  render() {
    const { camera, scene, renderer, uiRenderer, uiScene, uiCamera } = this;
    renderer.render(scene, camera);
    uiRenderer.render(uiScene, uiCamera);
  }

  snowball!: SnowBall;
  treeList!: Map<string, Tree>;

  // 初始化游戏逻辑
  initializeGame() {
    const { renderer, scene, resource, camera } = this;
    const { width: rendererWidth, height: rendererHeight } = renderer;
    const minTop = rendererHeight / 2;

    if (!resource.tree) {
      throw Error('required resource');
    }

    renderer.resetTranslate();
    scene.clear();

    // 创建雪球
    const snowball = new SnowBall({
      radius: 12,
      x: rendererWidth / 2,
      y: minTop / 2
    });
    this.snowball = scene.add(snowball);

    this.maxTreeNum = 10;
    // 初始给前两屏幕总计创建 10 棵🌲
    this.treeList = new Map();
    createTree(10, {
      minX: 0,
      maxX: rendererWidth,
      minY: minTop,
      maxY: rendererHeight * 2,
      resource: resource.tree!
    }).forEach(tree => {
      scene.add(tree);
      this.treeList.set(tree.id, tree);
    });

    renderer.render(scene, camera);
  }

  scoreEntity!: ScoreEntity;
  overMaskEntity!: OverMaskEntity;
  startMaskEntity!: StartMaskEntity;
  settingIconEntity!: SettingIconEntity;

  // 初始化UI界面
  initializeUI() {
    const { renderer, uiScene, uiRenderer, uiCamera } = this;
    const { width: rendererWidth, height: rendererHeight } = renderer;

    {
      // 分数显示
      const scoreEntity = new Entity('score', {
        count: 0
      });
      scoreEntity.setVisible(false);
      this.scoreEntity = uiScene.add(scoreEntity);

      // 开始游戏遮罩
      const startMaskEntity = new Entity('start-mask', {
        width: rendererWidth,
        height: rendererHeight
      });
      this.startMaskEntity = uiScene.add(startMaskEntity);
    }

    {
      // 设置按钮
      const width = 32;
      const top = 10;
      const settingIconEntity = new Entity('setting-icon', {
        settingIcon: this.resource.settingIcon!,
        left: rendererWidth - width - top,
        top,
        width,
        height: width
      });
      this.settingIconEntity = uiScene.add(settingIconEntity);
    }

    {
      // 游戏结束遮罩
      const overMaskEntity = new Entity('over-mask', {
        width: rendererWidth,
        height: rendererHeight,
        score: 0
      });
      overMaskEntity.setVisible(false);
      this.overMaskEntity = uiScene.add(overMaskEntity);
    }

    uiRenderer.render(uiScene, uiCamera);
  }

  ready() {
    const { uiEvent, gameEvent } = this;
    this.initializeGame();
    this.initializeUI();

    uiEvent.add('tap', e => {
      const {
        scoreEntity,
        startMaskEntity,
        overMaskEntity,
        settingIconEntity,
        uiRenderer,
        status
      } = this;
      if (
        checkPointRectCollide(
          {
            x: e.pointX,
            y: e.pointY
          },
          settingIconEntity.config
        )
      ) {
        alert('敬请期待！');
        return;
      }
      switch (status) {
        case 'ready':
          scoreEntity.setVisible(true);
          startMaskEntity.setVisible(false);

          uiRenderer.setPenetrate(true);
          this.render();
          this.startGame();
          break;
        case 'game-over':
          this.initializeGame();
          scoreEntity.setVisible(true);
          scoreEntity.mergeConfig({
            count: 0
          });

          overMaskEntity.setVisible(false);

          uiRenderer.setPenetrate(true);
          this.render();
          this.startGame();
          break;
      }
    });

    gameEvent.add('touchStart', () => {
      const { snowball, status } = this;
      if (status !== 'game-start') return;
      let { direction } = snowball.config;
      direction = -direction; // 按下转向
      snowball.mergeConfig({ turnTo: true, direction });
    });

    gameEvent.add('touchEnd', () => {
      const { snowball, status } = this;
      if (status !== 'game-start') return;
      snowball.mergeConfig({ turnTo: false });
    });

    this.status = 'ready';
  }
}

(async function () {
  const snowballGame = new SnowballGame(document.body);
  await snowballGame.loadResource();

  snowballGame.ready();
})();
