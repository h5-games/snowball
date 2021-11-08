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
  textBaseline?: string;
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
  option?: PaintTextOption
) => {
  let _option: PaintTextOption | undefined;
  const fillText: TFillText = [text, getActualPixel(left), getActualPixel(top)];
  if (typeof maxWidth === 'number') {
    fillText.push(maxWidth);
    _option = option;
  } else if (typeof maxWidth === 'object') {
    _option = maxWidth;
  }

  const {
    px = 18,
    fontFamily = 'Wawati SC,Heiti SC',
    font = `${getActualPixel(px)}px ${fontFamily}`,
    fillStyle = '#345',
    textAlign = 'center',
    textBaseline = 'middle'
  } = (_option || {}) as PaintTextOption;

  Object.assign(ctx, {
    fillStyle,
    textAlign,
    textBaseline,
    font
  });
  ctx.fillText(...fillText);
};

// 绘制图片
interface PaintImage {
  (
    ctx: CanvasRenderingContext2D,
    settingIcon: HTMLImageElement,
    left: number,
    top: number,
    width: number,
    height: number
  ): void;
}
export const paintImage: PaintImage = (
  ctx: CanvasRenderingContext2D,
  settingIcon,
  left,
  top,
  width,
  height
) => {
  ctx.drawImage(
    settingIcon,
    getActualPixel(left),
    getActualPixel(top),
    getActualPixel(width),
    getActualPixel(height)
  );
};

// 绘制遮罩
interface PaintMaskOption {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  alpha?: number;
  fillStyle?: string;
}
export const paintMask = (
  ctx: CanvasRenderingContext2D,
  {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    alpha = 0.36,
    fillStyle = `rgba(0, 0, 0, ${alpha})`
  }: PaintMaskOption
) => {
  ctx.fillStyle = fillStyle;
  ctx.rect(x, y, getActualPixel(width), getActualPixel(height));
  ctx.fill();
};

// 绘制圆角矩形
interface PaintRoundedRect {
  (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void;
}
export const paintRoundedRect: PaintRoundedRect = (
  ctx,
  x,
  y,
  width,
  height,
  radius
) => {
  ctx.beginPath();
  ctx.moveTo(getActualPixel(x), getActualPixel(y + radius));
  ctx.lineTo(getActualPixel(x), getActualPixel(y + height - radius));
  ctx.quadraticCurveTo(
    getActualPixel(x),
    getActualPixel(y + height),
    getActualPixel(x + radius),
    getActualPixel(y + height)
  );
  ctx.lineTo(getActualPixel(x + width - radius), getActualPixel(y + height));
  ctx.quadraticCurveTo(
    getActualPixel(x + width),
    getActualPixel(y + height),
    getActualPixel(x + width),
    getActualPixel(y + height - radius)
  );
  ctx.lineTo(getActualPixel(x + width), getActualPixel(y + radius));
  ctx.quadraticCurveTo(
    getActualPixel(x + width),
    getActualPixel(y),
    getActualPixel(x + width - radius),
    getActualPixel(y)
  );
  ctx.lineTo(getActualPixel(x + radius), getActualPixel(y));
  ctx.quadraticCurveTo(
    getActualPixel(x),
    getActualPixel(y),
    getActualPixel(x),
    getActualPixel(y + radius)
  );
  ctx.stroke();
};

export default {
  paintText,
  paintImage,
  paintMask,
  paintRoundedRect
};
