import { Entity } from './Engine';
import { randomRange } from './utils';
import { utils } from './Engine';

const { getActualPixel } = utils;

interface CreateTreeConfig {
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
  { minX, minY, maxX, maxY, resource }: CreateTreeConfig
) => {
  return new Array(num)
    .fill(null)
    .map(() => {
      const width = getActualPixel(40);
      const height = width * 2;
      return new Tree({
        left: randomRange(minX, maxX - width),
        top: randomRange(minY, maxY - height),
        width,
        height,
        resource,
        interval: 20
      });
    })
    .sort(
      (x, y) =>
        x.config.top + x.config.height - (y.config.top + y.config.height)
    );
};

interface TreeConfig {
  left: number;
  top: number;
  width: number;
  height: number;
  resource: HTMLImageElement;
  interval: number;
}

export default class Tree extends Entity<TreeConfig> {
  constructor(config: Partial<TreeConfig>) {
    super('tree');
    this.mergeConfig(config);
  }

  render(ctx: CanvasRenderingContext2D) {
    const { resource, left, top, width, height } = this.config;

    ctx.drawImage(resource, left, top, width, height);
  }
}
