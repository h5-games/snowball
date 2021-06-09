import Entity from './Entity';
import { getRandomId } from './utils';

type EntityMap = Map<string, Entity>;

class Scene {
  entityMap: EntityMap = new Map();

  add(entity: Entity) {
    const id = entity.id ?? getRandomId();
    this.entityMap.set(entity.type + id, entity);
  }
}

export default Scene;
