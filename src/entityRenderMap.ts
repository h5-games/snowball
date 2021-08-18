import { Entity, entityRenderMap, utils } from './Engine';
import paints from './utils/paints';

const UIEntityRenderMap = new Map(entityRenderMap);

const { getActualPixel } = utils;

interface StartMask {
  width: number;
  height: number;
}

// 开始游戏遮罩
UIEntityRenderMap.set('start-mask', (ctx, entity: Entity<StartMask>) => {
  const { width, height } = entity.config;

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

export interface Score {
  count: number;
  translateY: number;
}

// 分数
UIEntityRenderMap.set('score', (ctx, entity: Entity<Score>) => {
  const { count, translateY } = entity.config;
  paints.paintText(ctx, `得分：${count}`, 26, -translateY + 30, {
    fillStyle: '#666',
    px: 20,
    textAlign: 'left',
    textBaseline: 'top'
  });
});

export { UIEntityRenderMap };
