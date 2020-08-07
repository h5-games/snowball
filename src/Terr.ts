type TerrSize = {
  width: number;
  height: number;
};

type TerrPosition = {
  top: number;
  left: number;
};

type TerrConfig = {
  size?: Partial<TerrSize>;
  position?: Partial<TerrPosition>;
};

class Terr {
  size: TerrSize = {
    width: 0,
    height: 0
  };

  position: TerrPosition = {
    top: 0,
    left: 0
  };

  constructor(config: TerrConfig = {}) {
    Object.assign(this, config);
  }
}

export default Terr;
