import { getRandomId } from './utils';

type EntityType = 'still' | 'movable';

class Entity {
  id?: string;

  type?: EntityType = 'movable';

  zIndex?: number = 0;

  constructor(element) {
    this.id = getRandomId();
  }
}

export default Entity;
