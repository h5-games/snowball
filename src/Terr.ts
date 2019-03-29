/// <reference path="index.d.ts"/>
import config from './utils/config';

export default class Terr implements TerrInterface {
  id = '';
  width = 0;
  height = 0;
  left = 0;
  top = 0;
  constructor({ left, top, size }: TerrConfigInterface, terrImage: any) {
    // 依据 size 计算 width 依据 width 计算同比例 height
    const width = config.terrSizes[size];
    Object.assign(this, {
      id: 'TERR_' + Math.floor(Math.random() * 8999999 + 1000000),
      left,
      top,
      width,
      height: Math.floor(width / (terrImage.width / terrImage.height))
    })
  }
}
