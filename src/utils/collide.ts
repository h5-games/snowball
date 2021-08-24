interface RectEntity {
  left: number;
  top: number;
  width: number;
  height: number;
}
interface CircleEntity {
  x: number;
  y: number;
  radius: number;
}

export const checkRectCircleCollide = (
  rectEntity: RectEntity,
  circleEntity: CircleEntity
) => {
  let pointX = 0;
  let pointY = 0;
  if (circleEntity.x < rectEntity.left) {
    pointX = rectEntity.left;
  } else if (circleEntity.x < rectEntity.left + rectEntity.width) {
    pointX = circleEntity.x;
  } else {
    pointX = rectEntity.left + rectEntity.width;
  }
  if (circleEntity.y < rectEntity.top) {
    pointY = rectEntity.top;
  } else if (circleEntity.y < rectEntity.top + rectEntity.height) {
    pointY = circleEntity.y;
  } else {
    pointY = rectEntity.top + rectEntity.height;
  }

  const x = Math.abs(circleEntity.x - pointX);
  const y = Math.abs(circleEntity.y - pointY);

  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) < circleEntity.radius;
};
