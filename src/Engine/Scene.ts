import { Entity } from '.';

type EntityMap = Map<string, Entity>;

export class Scene {
  entityMap: EntityMap = new Map();

  add<T extends Entity>(entity: T): T {
    this.entityMap.set(entity.id, entity);
    return entity;
  }

  clear() {
    this.entityMap = new Map();
  }

  remove(id: string) {
    this.entityMap.delete(id);
  }
}
