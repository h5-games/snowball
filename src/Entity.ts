import { getRandomId } from './utils';

type EntityType = 'text' | 'image' | 'atomic';

export interface EntityData {
  [key: string]: any;
}

export interface EntityRender {
  (ctx: CanvasRenderingContext2D): void;
}

interface EntityInterface {
  id?: string;
  zIndex?: number;
  render: EntityRender;
}

class Entity implements EntityInterface {
  id?: string;

  zIndex?: number = 0;

  constructor(public type: EntityType, public data: EntityData) {
    this.id = getRandomId();
  }

  render(ctx: CanvasRenderingContext2D) {
    const { data } = this;
    console.log(ctx, data);
  }
}

export default Entity;
