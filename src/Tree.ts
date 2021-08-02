import { Entity } from './Engine';
import { randomRange } from './utils';
import { utils } from './Engine';

const { getActualPixel } = utils;

interface TreeConfig {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  resource: HTMLImageElement;
}

/**
 * @description 批量创建🌲
 * @param num 创建数量
 * @param minX
 * @param minY
 * @param maxX
 * @param maxY
 * @param resource {HTMLImageElement}
 */
export const createTree = (
  num: number,
  { minX, minY, maxX, maxY, resource }: TreeConfig
) => {
  return new Array(num)
    .fill(null)
    .map(() => {
      const width = getActualPixel(40);
      const height = width * 2;
      return Entity.create<Tree>(
        'tree',
        new Tree({
          left: randomRange(minX, maxX - width),
          top: randomRange(minY, maxY - height),
          width,
          height,
          resource,
          interval: 20
        })
      );
    })
    .sort((x, y) => x.top + x.height - (y.top + y.height));
};

export default class Tree {
  left: number;
  top: number;
  width: number;
  height: number;
  resource: HTMLImageElement;
  interval: number;

  constructor(config: Partial<Tree>) {
    Object.assign(this, config);
  }

  render(ctx: CanvasRenderingContext2D) {
    const { resource, left, top, width, height } = this;

    ctx.drawImage(resource, left, top, width, height);
  }
}
