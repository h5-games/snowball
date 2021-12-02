import { Scene, Camera, utils, entityRenderMap, EntityRenderMap } from '.';

const { getActualPixel } = utils;

interface RendererProps {
  entityRenderMap?: EntityRenderMap;
  style?: Partial<CSSStyleDeclaration>;
}

/**
 * 渲染器 实际就是一个 Canvas
 */
export class Renderer {
  dom!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  width: number = 0;
  height: number = 0;
  actualWidth: number = 0;
  actualHeight: number = 0;
  entityRenderMap: EntityRenderMap = entityRenderMap;

  constructor(props?: RendererProps) {
    const dom = document.createElement('canvas');
    Object.assign(this, {
      dom,
      ctx: dom.getContext('2d')
    });

    if (props) {
      const { entityRenderMap, style } = props;
      if (entityRenderMap) {
        // 创建渲染器时指定每一个实体的渲染方法，再与默认内部提供的一些实体渲染方法做合并
        entityRenderMap.forEach((render, key) => {
          this.entityRenderMap.set(key, render);
        });
      }
      if (style) {
        this.setStyle(style);
      }
    }
  }

  setStyle(style: Partial<CSSStyleDeclaration>) {
    for (const key in style) {
      if (style.hasOwnProperty(key)) {
        this.dom.style[key] = style[key] as string;
      }
    }
  }

  visible = true;
  setVisible(visible: boolean) {
    // 指定该渲染器是否可见，一个游戏可能存在多个渲染器，可以将游戏界面和UI界面具体的游戏画面区分开来
    this.visible = visible;
    this.setStyle({ visibility: visible ? 'visible' : 'hidden' });
  }

  penetrate = false;
  setPenetrate(penetrate: boolean) {
    // 绑定渲染器穿透事件，应用场景：我这个游戏在玩的时候分数属于UI渲染器，但是处于游戏渲染器的上面，绑定样式使其可以事件穿透到游戏的界面。
    this.penetrate = penetrate;
    this.setStyle({ pointerEvents: penetrate ? 'none' : 'auto' });
  }

  setSize(width: number, height: number) {
    const { dom } = this;
    dom.style.width = width + 'px';
    dom.style.height = height + 'px';

    const actualWidth = getActualPixel(width);
    const actualHeight = getActualPixel(height);
    dom.width = actualWidth;
    dom.height = actualHeight;
    Object.assign(this, {
      width,
      height,
      actualWidth,
      actualHeight
    });
  }

  translateX: number = 0;
  translateY: number = 0;
  translate(x: number, y: number) {
    // 画布偏移：在我这个游戏中 小球在一直的往下走，但是要保证小球还能在屏幕的中间可见区域，那么就给画布做一个 Y 轴的负偏移。
    this.translateX += x;
    this.translateY += y;
    this.ctx.translate(getActualPixel(x), getActualPixel(y));
  }

  resetTranslate() {
    // 重置画布偏移
    this.translateX = 0;
    this.translateY = 0;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  /**
   * 渲染逻辑
   * scene 场景：场景内包含整个界面内的实体
   * camera 照相机：定义真正所能看到的区域。之前有学过一段时间的 3DMax 它里面就有照相机的概念，实际给用户所看到的场景就是照相机所看到的范围。
   * 渲染器、照相机、场景 这三个是要配合在一起使用，渲染出照相机范围内的场景（一个个的实体组成）。
   * */
  render(scene: Scene, camera: Camera) {
    const {
      ctx,
      entityRenderMap,
      actualWidth,
      actualHeight,
      translateX,
      translateY
    } = this;

    {
      // 每次绘制新的画面之前要清除上一次绘制的画面
      const renderX = getActualPixel(0 - translateX);
      const renderY = getActualPixel(0 - translateY);
      ctx.clearRect(
        renderX,
        renderY,
        renderX + actualWidth,
        renderY + actualHeight
      );
    }

    {
      // 绘制照相机区域 参考方法：https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/clip
      const { left, top, offsetLeft, offsetTop, width, height } = camera;
      ctx.beginPath(); // 路径开始
      ctx.rect(
        getActualPixel(left + offsetLeft),
        getActualPixel(top + offsetTop),
        getActualPixel(width),
        getActualPixel(height)
      );
      ctx.clip(); // 画一个正方形的区域用来限制之后所有的元素都只会在正方形范围内显示
    }

    {
      // 绘制场景中的每一个 entity
      scene.entityMap.forEach(entity => {
        if (!entity.visible) return; // 实体不可见不绘制
        ctx.beginPath(); // 每一个实体绘制前开启新的路径
        if (entity.render) {
          // 实体有自带的渲染方法
          entity.render(ctx);
        } else {
          const render = entityRenderMap.get(entity.type);
          // 获取该实体类型配置的渲染方法
          if (render) {
            render.call(entity, ctx, entity);
          } else {
            console.warn(`The ${entity.id} Entity requires a render method!`);
          }
        }
      });
    }
  }
}
