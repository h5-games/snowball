import { Entity } from '.';

type EntityMap = Map<string, Entity>;

export class Scene {
  entityMap: EntityMap = new Map(); // 场景内实体的合集

  add<T extends Entity>(entity: T): T {
    // 给场景内添加实体
    this.entityMap.set(entity.id, entity);
    return entity;
  }

  clear() {
    // 清空场景
    this.entityMap = new Map();
  }

  remove(id: string) {
    // 从场景内删除实体
    this.entityMap.delete(id);
  }
}
