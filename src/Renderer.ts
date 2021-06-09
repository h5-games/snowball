import Scene from './Scene';
import Camera from './Camera';
import { getActualPixel } from './utils';
import { entityRenderMap, EntityRenderMap } from './utils/entityRenderMap';

interface RendererProps {
  entityRenderMap: EntityRenderMap;
}

class Renderer {
  dom: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  entityRenderMap: EntityRenderMap = entityRenderMap;

  constructor(width, height, props: RendererProps) {
    const dom = document.createElement('canvas');
    Object.assign(this, {
      dom,
      ctx: dom.getContext('2d')
    });
    if (width && height) {
      this.setSize(width, height);
    }
    if (props.entityRenderMap) {
      props.entityRenderMap.forEach((render, key) => {
        this.entityRenderMap.set(key, render);
      });
    }
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

  render(scene: Scene, camera: Camera) {
    const { left, top, width, height } = camera;

    const { ctx, entityRenderMap } = this;
    ctx.clearRect(0, 0, width, top + height);

    {
      // 绘制照相机区域
      ctx.beginPath();
      ctx.rect(left, top, width, height);
      ctx.translate(left, getActualPixel(-1));
      ctx.clip();
    }

    {
      // 绘制每一个 entity
      scene.entityMap.forEach(entity => {
        const render = entityRenderMap.get(entity.type);
        if (render) {
          render.call(entity, ctx);
        } else {
          entity.render(ctx);
        }
      });
    }
  }
}

export * from './utils/entityRenderMap';
export default Renderer;
