import {
  Entity,
  Scene,
  Renderer,
  Camera,
  Animation,
  utils,
  TMEvent,
  TMJoinEvent
} from './Engine';
import Snowball from './Snowball';
import Tree, { createTree } from './Tree';
import {
  UIEntityRenderMap,
  ScoreEntity,
  StartMaskEntity,
  OverMaskEntity,
  IconEntity,
  SettingMaskEntity
} from './entityRenderMap';
import { checkRectCircleCollide, checkPointRectCollide } from './utils/collide';
import { isNear } from './utils';

type GamgeStatus = 'initial' | 'ready' | 'setting' | 'game-start' | 'game-over';

type ImageResource = HTMLImageElement | null;
interface Resource {
  tree: ImageResource;
  settingIcon: ImageResource;
  yesIcon: ImageResource;
  returnIcon: ImageResource;
}

const HANDLE_TYPE = 'handleType';
type HandleType = 1 | 2;

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
    animation.bind(() => {
      const { scoreEntity, snowball, accelerationEnd } = this;
      const { count } = scoreEntity.attributes;
      scoreEntity.mergeAttributes({
        count: count + 1
      });
      if (accelerationEnd) {
        // 初始加速度结束后每隔 0.5 秒速度增加 0.03
        snowball.mergeAttributes({
          distance: snowball.attributes.distance + 0.03
        });
      }
    }, 500);
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

    // 读取本地存的操作方式
    const handleType = Number(localStorage.getItem(HANDLE_TYPE)) || 1;

    Object.assign(this, {
      renderer,
      scene,
      camera,
      animation,
      gameEvent,

      uiRenderer,
      uiCamera,
      uiScene,
      uiEvent,

      handleType
    });

    window.addEventListener('resize', () => {
      const { offsetWidth, offsetHeight } = $el;
      renderer.setSize(offsetWidth, offsetHeight);
      camera.update(renderer);
      uiRenderer.setSize(offsetWidth, offsetHeight);
      uiCamera.update(uiRenderer);
      this.gamgeOver();
      this.ready();
    });
  }

  // 当前游戏状态
  status: GamgeStatus = 'initial';
  prevStatus: GamgeStatus = 'initial';
  setStatus(status: GamgeStatus) {
    this.prevStatus = this.status;
    this.status = status;
  }

  // 操作方式
  handleType: HandleType = 1;
  setHandleType(type: HandleType) {
    this.handleType = type;
    localStorage.setItem(HANDLE_TYPE, String(type));
    this.settingMaskEntity.mergeAttributes({
      status: type
    });
  }

  resource: Resource = {
    tree: null,
    settingIcon: null,
    yesIcon: null,
    returnIcon: null
  };

  async loadResource(): Promise<SnowballGame> {
    // 先将图片资源加载至本地 然后再把本地的资源变为 Image 元素
    const [
      tree,
      settingIcon,
      yesIcon,
      returnIcon
    ] = await utils.loadImageResource(
      await utils.loadResource([
        './images/terr.png',
        './images/setting.png',
        './images/yes.png',
        './images/return.png'
      ])
    );
    Object.assign(this.resource, {
      tree,
      settingIcon,
      yesIcon,
      returnIcon
    });
    return this;
  }

  maxTreeNum = 10;
  accelerationEnd: boolean = false; // 标记小球起始加速度结束
  animationFrame() {
    const {
      camera,
      scene,
      renderer,
      snowball,
      maxTreeNum,
      treeList,
      scoreEntity
    } = this;
    const { width: rendererWidth, height: rendererHeight } = renderer;

    {
      // 小球逻辑
      const endPosition = rendererHeight / 2;
      const { y: snowballY } = snowball.attributes;
      const offsetTop = snowballY - camera.top; // 算出小球距离 canvas 顶部的距离 而非整体场景顶部的距离

      if (Math.ceil(offsetTop) >= endPosition) {
        this.accelerationEnd = true;
        const { offsetY } = snowball.move();
        // 小球滚动到 canvas 的一半的时候照相机的速度与小球向下位移的速度保持一致
        camera.update({
          top: camera.top + offsetY
        });
      } else {
        // 小球未滚动到 canvas 的一半将会呈加速度，候照相机的速度也渐渐随着增加为小球运动的速度
        const ratio = 1 - (endPosition - offsetTop) / endPosition; // 计算 offsetTop 接近中点的比率
        snowball.mergeAttributes({ distance: ratio * 3 });
        const { offsetY } = snowball.move();

        camera.update({
          top: camera.top + ratio * offsetY
        });
      }

      // 递增分数改变小球颜色
      const { addCount } = scoreEntity.attributes;
      if (addCount > 30) {
        snowball.mergeAttributes({ color: '#df3108' });
      } else if (addCount > 20) {
        snowball.mergeAttributes({ color: '#fb7626' });
      } else if (addCount > 10) {
        snowball.mergeAttributes({ color: '#ed9344' });
      } else if (addCount > 5) {
        snowball.mergeAttributes({ color: '#f5e885' });
      } else {
        snowball.mergeAttributes({ color: '#d2fdff' });
      }
    }

    // 小球超出屏幕
    const { attributes: snowballAttributes } = snowball;
    const { x, radius } = snowballAttributes;
    if (x - radius < 0 - radius * 2 || x - radius > rendererWidth) {
      // 允许超出屏幕一个小球的位置
      this.gamgeOver();
      return false;
    }

    {
      // 树木逻辑
      const translateY = camera.top;
      for (const [id, tree] of Array.from(treeList)) {
        {
          // 小球接近树木
          const { left, top, width, height } = tree.body;
          const treeX = left + width / 2;
          const treeY = top + height / 2;
          if (isNear(snowball.attributes, { x: treeX, y: treeY }, 70)) {
            const { count, addCount } = scoreEntity.attributes;
            if (tree.dispatchScore(addCount)) {
              scoreEntity.mergeAttributes({
                addCount: addCount + 1,
                count: count + addCount
              });
            }
          }
        }

        {
          // 小球与🌲底部发生碰撞
          if (checkRectCircleCollide(tree.body, snowballAttributes)) {
            this.gamgeOver();
            return false;
          }
        }

        {
          // 🌲超出场景移除
          const { top, height } = tree.attributes;
          if (top + height < translateY) {
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
        const { attributes } = lastTree!;
        let minY = attributes.top + attributes.height;
        const viewerTop = translateY + rendererHeight;
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

  startGame() {
    const { animation, settingIconEntity } = this;
    if (animation.status === 'stationary') {
      this.setStatus('game-start');
      // 隐藏设置按钮
      settingIconEntity.setVisible(false);
      animation.start();
    }
  }

  // 游戏结束
  gamgeOver() {
    const {
      animation,
      uiRenderer,
      overMaskEntity,
      scoreEntity,
      settingIconEntity
    } = this;
    // 停止动画
    animation.stop();

    // 游戏结束 使UI 界面可点击
    uiRenderer.setPenetrate(false);
    // 传入分数
    overMaskEntity.mergeAttributes({
      score: scoreEntity.attributes.count
    });
    // 展示游戏结束提示
    overMaskEntity.setVisible(true);
    // 隐藏右上角分数
    scoreEntity.setVisible(false);
    // 显示设置按钮
    settingIconEntity.setVisible(true);

    this.setStatus('game-over');
    this.render();
  }

  render() {
    const { camera, scene, renderer, uiRenderer, uiScene, uiCamera } = this;
    renderer.render(scene, camera);
    uiRenderer.render(uiScene, uiCamera);
  }

  snowball!: Snowball;
  treeList!: Map<string, Tree>;

  // 初始化游戏逻辑
  initializeGame() {
    const { renderer, scene, resource, camera } = this;
    const { width: rendererWidth, height: rendererHeight } = renderer;
    const minTop = rendererHeight / 2;

    if (!resource.tree) {
      throw Error('required resource');
    }

    camera.update({
      left: 0,
      top: 0
    });
    scene.clear();

    // 创建雪球
    const snowball = new Snowball({
      radius: 11,
      x: rendererWidth / 2,
      y: minTop / 2
    });
    this.snowball = scene.add(snowball);

    // 初始给前两屏幕总计创建 10 棵🌲
    this.maxTreeNum = 10;
    this.treeList = new Map();
    createTree(this.maxTreeNum, {
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
  settingIconEntity!: IconEntity;
  returnIconEntity!: IconEntity;
  settingMaskEntity!: SettingMaskEntity;

  // 初始化UI界面
  initializeUI() {
    const { renderer, uiScene, uiRenderer, uiCamera, handleType } = this;
    const { width: rendererWidth, height: rendererHeight } = renderer;

    uiScene.clear();

    {
      // 分数显示
      const scoreEntity = new Entity('score', {
        count: 0,
        addCount: 1
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
      // 游戏结束遮罩
      const overMaskEntity = new Entity('over-mask', {
        width: rendererWidth,
        height: rendererHeight,
        score: 0
      });
      overMaskEntity.setVisible(false);
      this.overMaskEntity = uiScene.add(overMaskEntity);
    }

    {
      // 设置遮罩
      const settingMaskEntity = new Entity('setting-mask', {
        yesIcon: this.resource.yesIcon!,
        width: rendererWidth,
        height: rendererHeight,
        status: handleType
      });
      settingMaskEntity.setVisible(false);
      this.settingMaskEntity = uiScene.add(settingMaskEntity);
    }

    {
      // 设置按钮
      const width = 32;
      const top = 10;
      const settingIconEntity = new Entity('icon', {
        icon: this.resource.settingIcon!,
        left: rendererWidth - width - top,
        top,
        width,
        height: width
      });
      this.settingIconEntity = uiScene.add(settingIconEntity);

      // 返回按钮
      const returnIconEntity = new Entity('icon', {
        icon: this.resource.returnIcon!,
        left: rendererWidth - width - top,
        top,
        width,
        height: width
      });
      returnIconEntity.setVisible(false);
      this.returnIconEntity = uiScene.add(returnIconEntity);
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
        settingMaskEntity,
        returnIconEntity,
        uiRenderer,
        status,
        prevStatus
      } = this;
      const point = {
        x: e.pointX,
        y: e.pointY
      };
      const checkSettingPointRectCollide = () => {
        if (checkPointRectCollide(point, settingIconEntity.attributes)) {
          this.setStatus('setting');
          scoreEntity.setVisible(false);
          startMaskEntity.setVisible(false);
          overMaskEntity.setVisible(false);
          settingIconEntity.setVisible(false);

          returnIconEntity.setVisible(true);
          settingMaskEntity.setVisible(true);

          this.render();
          return 'handled';
        }
      };
      switch (status) {
        case 'ready':
          if (checkSettingPointRectCollide() === 'handled') break;
          scoreEntity.setVisible(true);
          startMaskEntity.setVisible(false);

          uiRenderer.setPenetrate(true);
          this.render();
          this.startGame();
          break;
        case 'game-over':
          if (checkSettingPointRectCollide() === 'handled') break;
          this.initializeGame();
          scoreEntity.setVisible(true);
          scoreEntity.mergeAttributes({
            count: 0,
            addCount: 1
          });

          overMaskEntity.setVisible(false);

          uiRenderer.setPenetrate(true);
          this.render();
          this.startGame();
          break;
        case 'setting':
          const button1Attributes = settingMaskEntity.getButton1Attributes?.();
          const button2Attributes = settingMaskEntity.getButton2Attributes?.();
          if (
            button1Attributes &&
            checkPointRectCollide(point, button1Attributes)
          ) {
            // 点击第一个按钮
            this.setHandleType(1);
          } else if (
            button2Attributes &&
            checkPointRectCollide(point, button2Attributes)
          ) {
            // 点击第二个按钮
            this.setHandleType(2);
          } else {
            settingMaskEntity.setVisible(false);
            returnIconEntity.setVisible(false);
            if (prevStatus === 'ready') {
              startMaskEntity.setVisible(true);
            } else if (prevStatus === 'game-over') {
              overMaskEntity.setVisible(true);
            }
            settingIconEntity.setVisible(true);
            this.setStatus(this.prevStatus);
          }
          this.render();
          break;
      }
    });

    gameEvent.add('touchStart', e => {
      const { snowball, status, handleType } = this;
      if (status !== 'game-start') return;
      let { direction } = snowball.attributes;
      if (handleType === 1) {
        let prevX = e.pointX;
        const move: TMJoinEvent = e => {
          direction = e.pointX - prevX;
          prevX = e.pointX;
          if (direction > 1 || direction < -1) {
            snowball.mergeAttributes({ turnTo: true, direction });
          }
        };
        gameEvent.add('touchMove', move);
        const end: TMJoinEvent = () => {
          gameEvent.remove('touchMove', move);
          gameEvent.remove('touchEnd', end);
        };
        gameEvent.add('touchEnd', end);
      } else {
        // 按下转向
        direction = -direction;
        snowball.mergeAttributes({ turnTo: true, direction });
      }
    });

    gameEvent.add('touchEnd', () => {
      const { snowball, status } = this;
      if (status !== 'game-start') return;
      snowball.mergeAttributes({ turnTo: false });
    });

    this.setStatus('ready');
  }
}

(async function () {
  const snowballGame = new SnowballGame(document.body);
  await snowballGame.loadResource();

  snowballGame.ready();
})();
