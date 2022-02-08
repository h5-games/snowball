import { Entity, entityRenderMap } from './Engine';
import paints from './utils/paints';

const UIEntityRenderMap = new Map(entityRenderMap);

// 开始游戏遮罩
export type StartMaskEntity = Entity<{
  width: number;
  height: number;
}>;
UIEntityRenderMap.set('start-mask', (ctx, entity: StartMaskEntity) => {
  const { width, height } = entity.config;

  paints.paintMask(ctx, {
    width,
    height
  });

  const top = height / 2.5;
  const center = width / 2;
  paints.paintText(ctx, '点击屏幕开始游戏', center, top, {
    fillStyle: '#fff',
    px: 28
  });

  paints.paintText(ctx, '（长按屏幕控制小球转向）', center, top + 36, {
    fillStyle: '#fff',
    px: 20
  });
});

// 游戏结束遮罩
export type OverMaskEntity = Entity<{
  width: number;
  height: number;
  score: number;
}>;
UIEntityRenderMap.set('over-mask', (ctx, entity: OverMaskEntity) => {
  const { width, height, score } = entity.config;

  paints.paintMask(ctx, {
    width,
    height
  });

  const top = height / 2.5;
  const center = width / 2;
  paints.paintText(ctx, `游戏结束（得分 ${score}）`, center, top, {
    fillStyle: '#fff',
    px: 28
  });

  paints.paintText(ctx, '（点击屏幕开始游戏）', center, top + 36, {
    fillStyle: '#fff'
  });
});

// 分数
export type ScoreEntity = Entity<{
  count: number;
  addCount: number;
}>;
UIEntityRenderMap.set('score', (ctx, entity: ScoreEntity) => {
  const { count } = entity.config;
  paints.paintText(ctx, `得分：${count}`, 15, 18, {
    fillStyle: '#ec8b35',
    px: 24,
    textAlign: 'left',
    textBaseline: 'top'
  });
});

// Icon
export type IconEntity = Entity<{
  icon: HTMLImageElement;
  left: number;
  top: number;
  width: number;
  height: number;
}>;
UIEntityRenderMap.set('icon', (ctx, entity: IconEntity) => {
  const { icon, left, top, width, height } = entity.config;

  paints.paintImage(ctx, icon, left, top, width, height);
});

export { UIEntityRenderMap };

// 设置遮罩
interface ButtonConfig {
  left: number;
  top: number;
  width: number;
  height: number;
}
export interface SettingMaskEntity
  extends Entity<{
    width: number;
    height: number;
    yesIcon: HTMLImageElement;
    status: number;
  }> {
  getButton1Config?(): ButtonConfig;
  getButton2Config?(): ButtonConfig;
}
UIEntityRenderMap.set('setting-mask', (ctx, entity: SettingMaskEntity) => {
  const { width, height, yesIcon, status } = entity.config;

  paints.paintMask(ctx, {
    width,
    height
  });

  const top = height / 6;
  const center = width / 2;
  paints.paintText(ctx, '设置操作方式', center, top, {
    fillStyle: '#fff',
    px: 28
  });

  const bt = top * 2;
  const bw = 240;
  const bh = 50;
  const br = 10;
  const bl = center - bw / 2;
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(255,255,255,0.8)';
  ctx.fillStyle = 'rgba(0,0,0,0.1)';

  paints.paintRoundedRect(ctx, bl, bt, bw, bh, br);
  paints.paintText(ctx, '拖拽模式', center, bt + 25, {
    fillStyle: '#fff',
    px: 20
  });
  entity.getButton1Config = () => ({
    left: bl,
    top: bt,
    width: bw,
    height: bh
  });

  const b2t = bt + 80;
  paints.paintRoundedRect(ctx, bl, b2t, bw, bh, br);
  paints.paintText(ctx, '反向模式', center, b2t + 25, {
    fillStyle: '#fff',
    px: 20
  });
  entity.getButton2Config = () => ({
    left: bl,
    top: b2t,
    width: bw,
    height: bh
  });

  const iconLeft = center - 80;
  if (status === 1) {
    paints.paintImage(ctx, yesIcon, iconLeft, bt + 12, 24, 24);
    paints.paintText(ctx, '手指按下拖拽控制小球移动', center, b2t + 180, {
      fillStyle: '#fff'
    });
  } else {
    paints.paintImage(ctx, yesIcon, iconLeft, b2t + 12, 24, 24);
    paints.paintText(
      ctx,
      '按下屏幕小球往当前朝向的反方向移动',
      center,
      b2t + 180,
      {
        fillStyle: '#fff'
      }
    );
  }
});
