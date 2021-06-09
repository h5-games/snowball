import { getRandomId } from './utils';

type Keys<T> = { [P in keyof T]: P }[keyof T];

export type EntityType = Keys<CanvasRenderingContext2D> | string;

export interface EntityData {
  [key: string]: any;
}

export interface EntityRender {
  (this: Entity, ctx: CanvasRenderingContext2D): void;
}

class Entity<T = EntityData> {
  id: string;

  constructor(public type: EntityType, public data?: T) {
    this.id = getRandomId();
  }

  render(ctx: CanvasRenderingContext2D) {
    const { data } = this;
    // 针对 canvas 默认的一些做渲染封装
    console.log(ctx, data);
  }
}

export default Entity;
