import { Scene, Camera, utils, entityRenderMap, EntityRenderMap } from '.';
const { getActualPixel } = utils;

interface RendererProps {
  entityRenderMap?: EntityRenderMap;
  style?: Partial<CSSStyleDeclaration>;
}

export class Renderer {
  dom: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
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
      this.dom.style[key] = style[key];
    }
  }

  setVisible(visible) {
    this.setStyle({ visibility: visible ? 'visible' : 'hidden' });
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
  translate(x, y) {
    const { ctx } = this;
    this.translateX += x;
    this.translateY += y;
    ctx.translate(x, y);
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
