import { utils } from '../Engine';

const { getActualPixel } = utils;

type IFillText = [string, number, number, number?];

export const paintText = (
  ctx,
  fillText: IFillText,
  {
    px = 18,
    fontFamily = 'Wawati SC',
    font = `${getActualPixel(px)}px ${fontFamily}`,
    fillStyle = '#345',
    textAlign = 'center'
  }
) => {
  Object.assign(ctx, {
    fillStyle,
    textAlign,
    font
  });
  ctx.fillText(...fillText);
};

export const paintMask = (
  ctx,
  {
    width = 0,
    height = 0,
    fillRect = [0, 0, width, height],
    alpha = 0.3,
    fillStyle = `rgba(0, 0, 0, ${alpha})`
  }
) => {
  ctx.fillStyle = fillStyle;
  ctx.fillRect(...fillRect);
  ctx.fill();
};

export default {
  paintMask,
  paintText
};
