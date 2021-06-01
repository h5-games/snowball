import Scene from './Scene';
import Camera from './Camera';
import { EntityRender, EntityType } from './Entity';
import { getActualPixel } from './utils';

export type EntityRenderMap = Map<EntityType, EntityRender>;

interface RendererProps {
  entityRenderMap: EntityRenderMap;
}

const entityRenderMap: EntityRenderMap = new Map([
  [
    'image',
    function (ctx) {
      const { args, data } = this;
      const image = new Image();
      image.src = data.resource;
      const [dx, dy, dw, dh] = args;

      image.onload = () => {
        ctx.beginPath();
        ctx.drawImage(image, dx, dy, dw, dh);
      };
    }
  ]
]);

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
      width,
      height
    });
  }

  render(scene: Scene, camera: Camera) {
    const { ctx, entityRenderMap } = this;
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

export default Renderer;
