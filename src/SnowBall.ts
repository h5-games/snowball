interface SnowBallTail {
  left: number;
  top: number;
  degree: number;
}

export default class SnowBall {
  left: number = 0;
  top: number = 0;
  radius: number = 0;
  degree: number = 0;
  distance: number = 0;
  tailList: Array<SnowBallTail> = [];

  TAIL_MAX_LENGTH: number = 50;

  constructor(config: Partial<SnowBall>) {
    Object.assign(this, config);
  }

  move(distance: number) {
    const { degree, tailList, TAIL_MAX_LENGTH } = this;
    this.top += distance;

    tailList.unshift({
      left: this.left,
      top: this.top,
      degree
    });
    if (tailList.length > TAIL_MAX_LENGTH) {
      tailList.splice(TAIL_MAX_LENGTH);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    const { radius, left, top, tailList } = this;

    {
      // 绘制小球尾巴
      const tailListsLength = tailList.length;
      if (tailListsLength) {
        ctx.beginPath();
        let index = 0;
        let step = 1;
        const paint = () => {
          if (index < 0) return;

          const { left, top, degree } = tailList[index];
          const _radius = radius - (radius * (index + 1)) / tailListsLength;
          const radian = (degree * Math.PI) / 180;
          const cos = Math.cos(radian) * _radius * step;
          const sin = Math.sin(radian) * _radius * step;
          ctx.lineTo(left - cos, top + sin);

          if (index === tailListsLength - 1) step = -1;
          index += step;
          paint();
        };
        paint();

        ctx.closePath();

        const firstTail = tailList[0];
        const lastTail = tailList[tailListsLength - 1];
        const line = ctx.createLinearGradient(
          firstTail.left,
          firstTail.top,
          lastTail.left,
          lastTail.top
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
    ctx.arc(left, top, radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}
