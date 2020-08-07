import Entity from './Entity';

type EntityMap = {
  [type: string]: Entity;
};

class Scene {
  entityMap: EntityMap = {};

  add(entity: Entity) {
    this.entityMap[entity.id] = entity;
  }
}

export default Scene;
