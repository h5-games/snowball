export const randomRange = (min: number, max: number) => {
  if (min > 0) return Math.floor(Math.random() * (max - min) + min);
  return Math.floor(Math.random() * (max - min) + min);
};

interface Point {
  x: number;
  y: number;
}
export const isNear = (pointX: Point, pointY: Point, distance: number) => {
  return (
    Math.pow(Math.abs(pointY.x - pointX.x), 2) +
      Math.pow(Math.abs(pointY.y - pointX.y), 2) <=
    Math.pow(distance, 2)
  );
};
