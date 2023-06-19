import { utils } from '.';

export type EntityType = Keys<CanvasRenderingContext2D> | string;

export interface EntityRender<T extends Entity = any> {
  (ctx: CanvasRenderingContext2D, entity: T): void;
}

interface EntityAttributes {
  [key: string]: any;
}

// Entity 可以被其他类继承使用再生成实例，也可以直接使用 new 创建一个基础的实例
export class Entity<T extends EntityAttributes = {}> {
  id: string;
  attributes: T = {} as T;

  constructor(public type: EntityType, attributes?: Partial<T>) {
    this.id = type + '-' + utils.getRandomId(); // 随机生成一个ID
    attributes && this.mergeAttributes(attributes);
  }

  // 更新实体的 attributes
  mergeAttributes(attributes: Partial<T>) {
    Object.assign(this.attributes, attributes);
    return this;
  }

  // 设置该实体是否可见，渲染的时候会忽略不可见的实体
  visible: boolean = true;
  setVisible(visible: boolean) {
    this.visible = visible;
  }

  // 定义实体渲染的方法
  render?(ctx: CanvasRenderingContext2D): void;
}
