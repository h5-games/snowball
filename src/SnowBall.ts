import { Entity } from './Engine';
import { utils } from './Engine';

const { getActualPixel } = utils;

interface SnowBallTail {
  x: number;
  y: number;
  degree: number;
}

interface SnowBallConfig {
  x: number;
  y: number;
  radius: number;
  direction: number;
  turnTo: boolean;
  degree: number;
  maxDegree: number;
  minDegree: number;
  distance: number;
  TAIL_MAX_LENGTH: number;
}

export default class SnowBall extends Entity<SnowBallConfig> {
  config: SnowBallConfig = {
    x: 0,
    y: 0,
    radius: 0,
    direction: -1,
    turnTo: false,
    degree: 0, // 当前偏移值
    maxDegree: 60, // 最大偏移数值
    minDegree: -60, // 最小偏移数值
    distance: 0, // 小球每次移动的距离
    TAIL_MAX_LENGTH: 50
  };
  tailList: Array<SnowBallTail> = [];

  constructor(config: Partial<SnowBallConfig>) {
    super('snowball');
    this.mergeConfig(config);
  }

  move() {
    const { tailList } = this;
    const {
      turnTo,
      direction,
      distance,
      maxDegree,
      minDegree,
      TAIL_MAX_LENGTH
    } = this.config;
    let { degree, x, y } = this.config;

    // 小球正在转向
    if (turnTo) {
      // 递增旋转角度
      degree = degree + direction * 1.2; // 增加一点转向灵敏度
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

    this.mergeConfig({ x, y, degree });

    // 记录小球移动的位置以及角度
    tailList.unshift({
      x,
      y,
      degree
    });
    if (tailList.length > TAIL_MAX_LENGTH) {
      tailList.splice(TAIL_MAX_LENGTH);
    }

    return {
      offsetX,
      offsetY
    };
  }

  render(ctx: CanvasRenderingContext2D) {
    const { tailList } = this;
    const { radius, x, y } = this.config;

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
          firstTail.x,
          firstTail.y,
          lastTail.x,
          lastTail.y
        );

        try {
          line.addColorStop(0, '#eee');
          line.addColorStop(1, '#fff');
          ctx.fillStyle = line;
        } catch (e) {
          ctx.fillStyle = '#eee';
        }

        ctx.fill();
      }
    }

    // 绘制小球
    ctx.beginPath();
    ctx.fillStyle = '#d2fdff';
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