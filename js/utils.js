export function computedBeyond (top, position) {
  return top - position
}

export function isCrash (ball, terr) {
  const { left: ballLeft, top: ballTop } = ball
  const { left: terrLeft, top: terrTop, width: terrWidth, height: terrHeight } = terr
  return ballLeft >= terrLeft && ballLeft <= terrLeft + terrWidth && ballTop >= terrTop && ballTop <= terrTop + terrHeight
}
