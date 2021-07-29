import { TEntity } from '.';

type EntityMap = Map<string, TEntity>;

export class Scene {
  entityMap: EntityMap = new Map();

  add<T extends object>(entity: TEntity<T>) {
    this.entityMap.set(entity.id, entity);
    return entity;
  }

  remove(id: string) {
    this.entityMap.delete(id);
  }
}
