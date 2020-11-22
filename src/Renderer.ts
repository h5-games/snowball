import Scene from './Scene';
import Camera from './Camera';
import { EntityRender } from './Entity';

export type EntityRenderMap = Map<string, EntityRender>;

interface RendererProps {
  entityRenderMap: EntityRenderMap
}

const entityRenderMap = new Map();

class Renderer {
  dom: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  entityRenderMap = entityRenderMap;

  constructor(width, height, props: RendererProps) {
    const dom = document.createElement('canvas');
    if (width && height) {
      this.setSize(width, height);
    }
    Object.assign(this, {
      dom, ctx: dom.getContext('2d')
    });
    if (props.entityRenderMap) {
      props.entityRenderMap.forEach((render, key) => {
        this.entityRenderMap.set(key, render);
      })
    }
  }

  setSize(width: number, height: number) {
    const { dom } = this;
    dom.style.width = width + 'px';
    dom.style.height = height + 'px';
    Object.assign(this, {
      width,
      height
    });
  }

  render(scene: Scene, camera: Camera) {
    const { ctx } = this;
    scene.entityMap.forEach(entity => {
      entity.render.call(entity, ctx);
    })
  }
}

export default Renderer;
