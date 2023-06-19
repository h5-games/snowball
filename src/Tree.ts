import { Entity } from './Engine';
import { randomRange } from './utils';
import paints from './utils/paints';

interface CreateTreeAttributes {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  resource: HTMLImageElement;
}

type TreeList = Tree[];

interface Score {
  count: number;
  top: number;
  opacity: number;
}

/**
 * @description 批量创建🌲
 * @minY 表示树最底部的最小值
 * @maxY 表示树最底部的最大值
 */
export const createTree = (
  num: number,
  { minX, minY, maxX, maxY, resource }: CreateTreeAttributes
): TreeList => {
  const width = 40;
  const height = width * 2;

  const trees: TreeList = [];
  for (let i = 0; i < num; i++) {
    const tree = new Tree({
      left: randomRange(minX, maxX - width),
      top: randomRange(minY, maxY - height),
      width,
      height,
      resource
    });
    trees.push(tree);
  }

  // 按照树的最底部排序，使下面的树覆盖上面的树
  return trees.sort((x, y) => {
    const xAttributes = x.attributes;
    const yAttributes = y.attributes;
    return (
      xAttributes.top +
      xAttributes.height -
      (yAttributes.top + yAttributes.height)
    );
  });
};

interface TreeAttributes {
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
}

export default class Tree extends Entity<TreeAttributes> {
  body!: TreeBody;
  constructor(attributes: TreeAttributes) {
    super('tree');

    // 树干为可被撞击的区域
    // 根据图片比例计算树木树干的位置与大小
    const { left, top, width, height } = attributes;
    const _width = width * 0.16;
    const _height = height * 0.1;
    const _top = top + height - _height - 1; // - 1 是为了减少小球扫到树木底部的可能性 让游戏更简单点
    const _left = left + width * 0.4;

    this.body = {
      left: _left,
      top: _top,
      width: _width,
      height: _height
    };
    this.mergeAttributes(attributes);
  }

  score: Score | null = null;
  scoreTimer: number = 0;
  dispatchScore(count: number): boolean {
    if (this.scoreTimer) return false;
    this.score = {
      count,
      top: -10,
      opacity: 1
    };
    this.scoreTimer = window.setInterval(() => {
      if (!this.score) {
        window.clearTimeout(this.scoreTimer);
        return;
      }
      this.score.opacity -= 0.1;
      if (this.score.opacity <= 0) {
        window.clearTimeout(this.scoreTimer);
      }
    }, 100);
    return true;
  }
  mergeScore(score: Partial<Score>) {
    this.score && Object.assign(this.score, score);
  }

  render(ctx: CanvasRenderingContext2D) {
    const { score, attributes } = this;

    // 绘制树木
    const { resource, left, top, width, height } = attributes;
    paints.paintImage(ctx, resource, left, top, width, height);

    // 绘制分数
    if (score) {
      const { count, top: scoreTop, opacity } = score;
      paints.paintText(ctx, `+${count}`, left + width / 2, top + scoreTop, {
        fillStyle: `rgba(50, 50, 50, ${opacity})`,
        px: 16
      });
    }
  }
}
