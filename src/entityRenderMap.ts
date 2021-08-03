import { entityRenderMap, TEntity, utils } from './Engine';
import paints from './utils/paints';

const UIEntityRenderMap = new Map(entityRenderMap);

const { getActualPixel } = utils;

export interface StartMask {
  width: number;
  height: number;
}

// 开始游戏遮罩
UIEntityRenderMap.set('start-mask', (ctx, options: TEntity<StartMask>) => {
  const { width, height } = options;

  paints.paintMask(ctx, { width, height });

  const top = height / 2.5;
  const center = width / 2;
  paints.paintText(ctx, '点击屏幕开始游戏', center, top, {
    fillStyle: '#fff',
    px: 28
  });

  paints.paintText(
    ctx,
    '（长按屏幕进行转向）',
    center,
    top + getActualPixel(36),
    {
      fillStyle: '#fff'
    }
  );
});

export { UIEntityRenderMap };
