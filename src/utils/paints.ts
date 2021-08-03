import { utils } from '../Engine';

const { getActualPixel } = utils;

// 绘制文字
type TFillText = [string, number, number, number?];
interface PaintTextOption {
  px?: number;
  fontFamily?: string;
  font?: string;
  fillStyle?: string;
  textAlign?: string;
}
export interface IPaintText {
  (
    ctx: CanvasRenderingContext2D,
    text: string,
    left: number,
    top: number,
    maxWidth: number,
    option?: PaintTextOption
  ): void;
}
export interface IPaintText {
  (
    ctx: CanvasRenderingContext2D,
    text: string,
    left: number,
    top: number,
    option?: PaintTextOption
  ): void;
}
export const paintText: IPaintText = (
  ctx,
  text,
  left,
  top,
  maxWidth,
  option?
) => {
  let _option: PaintTextOption;
  const fillText: TFillText = [text, left, top];
  if (typeof maxWidth === 'number') {
    fillText.push(maxWidth);
    _option = option;
  } else if (typeof maxWidth === 'object') {
    _option = maxWidth;
  }
  const {
    px = 18,
    fontFamily = 'Wawati SC',
    font = `${getActualPixel(px)}px ${fontFamily}`,
    fillStyle = '#345',
    textAlign = 'center'
  } = _option || {};

  Object.assign(ctx, {
    fillStyle,
    textAlign,
    font
  });
  ctx.fillText(...fillText);
};

// 绘制遮罩
type TFillRect = [number, number, number, number];
interface PaintMaskOption {
  width?: number;
  height?: number;
  fillRect?: TFillRect;
  alpha?: number;
  fillStyle?: string;
}
export const paintMask = (
  ctx: CanvasRenderingContext2D,
  {
    width = 0,
    height = 0,
    fillRect = [0, 0, width, height],
    alpha = 0.3,
    fillStyle = `rgba(0, 0, 0, ${alpha})`
  }: PaintMaskOption
) => {
  ctx.fillStyle = fillStyle;
  ctx.rect(...fillRect);
  ctx.fill();
};

export default {
  paintMask,
  paintText
};
