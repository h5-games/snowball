import { utils } from '.';

type Keys<T> = { [P in keyof T]: P }[keyof T];

export type EntityType = Keys<CanvasRenderingContext2D> | string;

export interface EntityRender {
  (this: Entity, ctx: CanvasRenderingContext2D, entity: Entity): void;
}

interface EntityConfig {
  [key: string]: any;
}

// Entity 可以被其他类继承使用再生成实例，也可以直接调用 Entity.create 方法进行创建实例
export class Entity<T extends EntityConfig = {}> {
  id: string;
  config: T = {} as T;

  constructor(public type: EntityType, config?: Partial<T>) {
    this.id = utils.getRandomId();
    config && this.mergeConfig(config);
  }

  mergeConfig(config: Partial<T>) {
    Object.assign(this.config, config);
    return this;
  }

  visible: boolean = true;
  setVisible(visible: boolean) {
    this.visible = visible;
  }

  render(ctx: CanvasRenderingContext2D) {
    console.log(ctx, this);
  }
}
