import { Scene, Camera, utils, entityRenderMap, EntityRenderMap } from '.';

const { getActualPixel } = utils;

interface RendererProps {
  entityRenderMap?: EntityRenderMap;
  style?: Partial<CSSStyleDeclaration>;
}

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
    this.visible = visible;
    this.setStyle({ visibility: visible ? 'visible' : 'hidden' });
  }

  penetrate = false;
  setPenetrate(penetrate: boolean) {
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
    this.translateX += x;
    this.translateY += y;
    this.ctx.translate(getActualPixel(x), getActualPixel(y));
  }

  resetTranslate() {
    this.translateX = 0;
    this.translateY = 0;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

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
      // 清除 canvas 视口区域的内容
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
      // 绘制照相机区域
      const { left, top, offsetLeft, offsetTop, width, height } = camera;
      ctx.beginPath();
      ctx.rect(
        getActualPixel(left + offsetLeft),
        getActualPixel(top + offsetTop),
        getActualPixel(width),
        getActualPixel(height)
      );
      ctx.clip();
    }

    {
      // 绘制每一个 entity
      scene.entityMap.forEach(entity => {
        if (!entity.visible) return;
        ctx.beginPath();
        const render = entityRenderMap.get(entity.type);
        if (render) {
          render.call(entity, ctx, entity);
        } else {
          entity.render(ctx);
        }
      });
    }
  }
}
