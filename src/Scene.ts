import Entity from './Entity';

type EntityMap = Map<string, Entity>;

class Scene {
  entityMap: EntityMap = new Map();

  add(entity: Entity) {
    this.entityMap.set(entity.id, entity);
  }

  remove(id: string) {
    this.entityMap.delete(id);
  }
}

export default Scene;
