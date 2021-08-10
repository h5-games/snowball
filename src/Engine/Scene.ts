import { Entity } from '.';

type EntityMap = Map<string, Entity>;

export class Scene {
  entityMap: EntityMap = new Map();

  add<T extends Entity>(entity: T): T {
    this.entityMap.set(entity.id, entity);
    return entity;
  }

  remove(id: string) {
    this.entityMap.delete(id);
  }
}
