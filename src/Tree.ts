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
      resource
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
}
interface TreeBody {
  left: number;
  top: number;
  width: number;
  height: number;
  bottom: number;
}

export default class Tree extends Entity<TreeConfig> {
  body!: TreeBody;
  constructor(config: TreeConfig) {
    super('tree');

    // 根据图片比例计算树木树干的位置与大小
    const { left, top, width, height } = config;
    const _width = width * 0.2;
    const _height = height * 0.8;
    const _top = top + height - _height;
    const _left = left + width * 0.37;

    this.body = {
      left: _left,
      top: _top,
      width: _width,
      height: _height,
      bottom: _top + _height
    };
    this.mergeConfig(config);
  }

  render(ctx: CanvasRenderingContext2D) {
    const { resource, left, top, width, height } = this.config;

    ctx.drawImage(resource, left, top, width, height);
  }
}
