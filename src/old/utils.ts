export function randomPosition(min: number, max: number) {
  if (min > 0) return Math.floor(Math.random() * (max - min) + min);
  return Math.floor(Math.random() * (max - min) + min);
}
