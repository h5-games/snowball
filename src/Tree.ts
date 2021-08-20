import { Entity, utils } from './Engine';
import { randomRange } from './utils';

const { getActualPixel } = utils;

interface CreateTreeConfig {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  resource: HTMLImageElement;
}

type TreeList = Tree[];

/**
 * @description 批量创建🌲
 * @minY 表示树最底部的最小值
 * @maxY 表示树最底部的最大值
 */
export const createTree = (
  num: number,
  { minX, minY, maxX, maxY, resource }: CreateTreeConfig
): TreeList => {
  const width = getActualPixel(40);
  const height = width * 2;

  const trees: TreeList = [];
  for (let i = 0; i < num; i++) {
    const tree = new Tree({
      left: randomRange(minX, maxX - width),
      top: randomRange(minY - height, maxY),
      width,
      height,
      resource,
      interval: 20
    });
    trees.push(tree);
  }

  // 按照树的最底部排序，使下面的树覆盖上面的树
  return trees.sort((x, y) => {
    const xConfig = x.config;
    const yConfig = y.config;
    return xConfig.top + xConfig.height - (yConfig.top + yConfig.height);
  });
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
