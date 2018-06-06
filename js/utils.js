export function computedBeyond (top, position) {
  return top - position
}

export function isCrash (ball, terr) {
  const { left: ballLeft, top: ballTop } = ball
  const { left: terrLeft, top: terrTop, width: terrWidth, height: terrHeight } = terr
  return ballLeft >= terrLeft && ballLeft <= terrLeft + terrWidth && ballTop >= terrTop && ballTop <= terrTop + terrHeight
}

export function isNear (ball, terr, distance) {
  const { left: ballLeft, top: ballTop } = ball
  const { left: terrLeft, top: terrTop, width: terrWidth, height: terrHeight } = terr
  const _terrLeft = terrLeft + terrWidth / 2
  const _terrTop = terrTop + terrHeight / 2
  return Math.pow(Math.abs(_terrLeft - ballLeft), 2) + Math.pow(Math.abs(_terrTop - ballTop), 2) <= Math.pow(distance, 2)
}
