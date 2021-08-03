import { Renderer, utils } from '.';

type Keys<T> = { [P in keyof T]: P }[keyof T];

export type EntityType = Keys<CanvasRenderingContext2D> | string;

export interface EntityRender {
  (this: Entity, ctx: CanvasRenderingContext2D, entity: TEntity): void;
}

export type TEntity<T extends object = {}> = Entity<T> & T;

export class Entity<P extends object = {}> {
  /**
   * @description 通过此方法创建 Entity 返回的实例相当于继承了 Entity 的实例
   * @param type {CanvasRenderingContext2D}
   * @param data {object} 普通对象或者某类的实例
   */
  static create<T extends object = {}>(type: EntityType, data?: T) {
    const instance = new Entity(type, data) as TEntity<T>;

    if (data) {
      const prototype = Object.getPrototypeOf(data);

      if (prototype !== Object.prototype) {
        // 传入的是某个类的实例 将其原型方法自动合并
        Object.setPrototypeOf(instance, {
          ...Object.getPrototypeOf(instance),
          ...prototype
        });
      }
    }

    return instance;
  }

  id: string;
  visible: boolean = true;

  constructor(public type: EntityType, entity?: P) {
    this.id = utils.getRandomId();
    Object.assign(this, entity);
  }

  merge(data: Partial<P>) {
    Object.assign(this, data);
    return this;
  }

  render(ctx: CanvasRenderingContext2D) {
    console.log(ctx, this);
  }
}
