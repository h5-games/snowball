/// <reference path="index.d.ts"/>
import config from './utils/config';

export default class Terr implements TerrInterface {
  id = '';
  width = 0;
  height = 0;
  left = 0;
  top = 0;
  trunk = {
    width: 0,
    height: 0,
    left: 0,
    top: 0
  }
  constructor(engine: engineInterface) {
    console.log(engine);
  }
}
