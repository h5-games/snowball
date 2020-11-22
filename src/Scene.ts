import Entity from './Entity';

type EntityMap = Map<string, Entity>

class Scene {
  entityMap: EntityMap = new Map();

  add(entity: Entity) {
    this.entityMap.set(entity.id, entity);
  }
}

export default Scene;
