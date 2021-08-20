import { Entity, entityRenderMap, utils } from './Engine';
import paints from './utils/paints';

const UIEntityRenderMap = new Map(entityRenderMap);

const { getActualPixel } = utils;

// 开始游戏遮罩
export type StartMaskEntity = Entity<{
  width: number;
  height: number;
}>;
UIEntityRenderMap.set('start-mask', (ctx, entity: StartMaskEntity) => {
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

// 游戏结束遮罩
export type OverMaskEntity = Entity<{
  width: number;
  height: number;
  score: number;
}>;
UIEntityRenderMap.set('over-mask', (ctx, entity: OverMaskEntity) => {
  const { width, height, score } = entity.config;

  paints.paintMask(ctx, { width, height });

  const top = height / 2.5;
  const center = width / 2;
  paints.paintText(ctx, `Game Over 得分 ${score}`, center, top, {
    fillStyle: '#fff',
    px: 28
  });

  paints.paintText(
    ctx,
    '（点击屏幕开始游戏）',
    center,
    top + getActualPixel(36),
    {
      fillStyle: '#fff'
    }
  );
});

// 分数
export type ScoreEntity = Entity<{
  count: number;
}>;
UIEntityRenderMap.set('score', (ctx, entity: ScoreEntity) => {
  const { count } = entity.config;
  paints.paintText(
    ctx,
    `得分：${count}`,
    getActualPixel(15),
    getActualPixel(18),
    {
      fillStyle: '#ec8b35',
      px: 24,
      textAlign: 'left',
      textBaseline: 'top'
    }
  );
});

// 时间
export type TimerEntity = Entity<{
  millisecond: number;
  rendererWidth: number;
}>;
UIEntityRenderMap.set('timer', (ctx, entity: TimerEntity) => {
  const { millisecond, rendererWidth } = entity.config;
  let time = millisecond / 1000;
  let unix = 's';
  if (time > 60) {
    unix = 'm';
    time /= 60;
  }
  if (time > 60) {
    unix = 'h';
    time /= 60;
  }
  paints.paintText(
    ctx,
    time.toFixed(2) + unix,
    rendererWidth - getActualPixel(15),
    getActualPixel(18),
    {
      fillStyle: 'rgba(0,0,0,0.6)',
      textAlign: 'right',
      textBaseline: 'top'
    }
  );
});

export { UIEntityRenderMap };
