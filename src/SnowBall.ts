import { Entity } from './Engine';
import { utils } from './Engine';

const { getActualPixel } = utils;

interface SnowBallTail {
  x: number;
  y: number;
  degree: number;
}

interface SnowballAttributes {
  x: number;
  y: number;
  radius: number;
  direction: number;
  turnTo: boolean;
  degree: number;
  maxDegree: number;
  minDegree: number;
  distance: number;
  tailMaxLength: number;
  color: string;
}

export default class Snowball extends Entity<SnowballAttributes> {
  attributes: SnowballAttributes = {
    x: 0,
    y: 0,
    radius: 0,
    direction: -1,
    turnTo: false,
    degree: 0, // 当前偏移值
    maxDegree: 50, // 最大偏移数值
    minDegree: -50, // 最小偏移数值
    distance: 0, // 小球每次移动的距离
    tailMaxLength: 50, // 尾巴最大长度值
    color: '#d2fdff'
  };
  tailList: Array<SnowBallTail> = [];

  constructor(attributes: Partial<SnowballAttributes>) {
    super('snowball');
    this.mergeAttributes(attributes);
  }

  move() {
    const { tailList } = this;
    const {
      turnTo,
      direction, // direction 只有正负值区别
      distance,
      maxDegree,
      minDegree,
      tailMaxLength
    } = this.attributes;
    let { degree, x, y } = this.attributes;

    // 小球正在转向
    if (turnTo && direction) {
      // 递增旋转角度
      degree = degree + (direction > 0 ? 1 : -1) * 2; // 增加一点转向灵敏度
      // 限制最大、最小旋转角度
      if (degree > maxDegree) {
        degree = maxDegree;
      } else if (degree < minDegree) {
        degree = minDegree;
      }
    }

    const radian = (degree * Math.PI) / 180;
    const offsetX = Math.sin(radian) * distance;
    const offsetY = Math.cos(radian) * distance;
    x += offsetX;
    y += offsetY;

    this.mergeAttributes({ x, y, degree });

    // 记录小球移动的位置以及角度
    tailList.unshift({
      x,
      y,
      degree
    });
    if (tailList.length > tailMaxLength) {
      tailList.splice(tailMaxLength);
    }

    // 返回本次位移偏移的信息
    return {
      offsetX,
      offsetY
    };
  }

  render(ctx: CanvasRenderingContext2D) {
    const { tailList } = this;
    const { radius, x, y, color } = this.attributes;

    {
      // 绘制小球尾巴
      const tailListsLength = tailList.length;
      if (tailListsLength) {
        let index = 0;
        let step = 1;
        const paint = () => {
          if (index < 0) return;

          const { x, y, degree } = tailList[index];
          const _radius = radius - (radius * (index + 1)) / tailListsLength;
          const radian = (degree * Math.PI) / 180;
          const cos = Math.cos(radian) * _radius * step;
          const sin = Math.sin(radian) * _radius * step;
          ctx.lineTo(getActualPixel(x - cos), getActualPixel(y + sin));

          if (index === tailListsLength - 1) step = -1;
          index += step;
          paint();
        };
        paint();

        ctx.closePath();

        const firstTail = tailList[0];
        const lastTail = tailList[tailListsLength - 1];
        const line = ctx.createLinearGradient(
          getActualPixel(firstTail.x),
          getActualPixel(firstTail.y),
          getActualPixel(lastTail.x),
          getActualPixel(lastTail.y)
        );

        try {
          line.addColorStop(0, color + '80');
          line.addColorStop(1, color + '10');
          ctx.fillStyle = line;
        } catch (e) {
          ctx.fillStyle = color + '60';
        }

        ctx.fill();
      }
    }

    // 绘制小球
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(
      getActualPixel(x),
      getActualPixel(y),
      getActualPixel(radius),
      0,
      2 * Math.PI
    );
    ctx.fill();
  }
}
