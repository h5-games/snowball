import { getRandomId } from './utils';

type Keys<T> = { [P in keyof T]: P }[keyof T];

type DefaultEntityType = 'image';

type Args = any[];

export type EntityType =
  | DefaultEntityType
  | 'atomic'
  | Keys<CanvasRenderingContext2D>;

export interface EntityData {
  [key: string]: any;
}

export interface EntityRender {
  (this: EntityInterface, ctx: CanvasRenderingContext2D): void;
}

interface EntityInterface {
  id: string;
  type: EntityType;
  args: Args;
  data?: EntityData;
  render: EntityRender;
}

class Entity implements EntityInterface {
  id: string;

  constructor(
    public type: EntityType,
    public args: Args,
    public data?: EntityData
  ) {
    this.id = getRandomId();
  }

  render(ctx: CanvasRenderingContext2D) {
    const { data } = this;
    console.log(ctx, data);
  }
}

export default Entity;
