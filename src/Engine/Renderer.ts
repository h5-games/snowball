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
    dom.width = getActualPixel(width);
    dom.height = getActualPixel(height);
    Object.assign(this, {
      width: dom.width,
      height: dom.height
    });
  }

  translateX: number = 0;
  translateY: number = 0;
  translate(x: number, y: number) {
    this.translateX += x;
    this.translateY += y;
    this.ctx.translate(x, y);
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
      width,
      height,
      translateX,
      translateY
    } = this;

    {
      // 清除 canvas 视口区域的内容
      const renderX = 0 - translateX;
      const renderY = 0 - translateY;
      ctx.clearRect(renderX, renderY, renderX + width, renderY + height);
    }

    {
      // 绘制照相机区域
      const { left, top, offsetLeft, offsetTop, width, height } = camera;
      ctx.beginPath();
      ctx.rect(left + offsetLeft, top + offsetTop, width, height);
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
