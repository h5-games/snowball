interface IEntity {
  [type: string]: any;
}

class Scene {
  public entityMap: IEntity = {};

  constructor() {

  }
}

export default Scene;
