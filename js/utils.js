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

export function sortTerr (terrLists) {
  const _terrLists = {}
  const terrListsArr = Object.entries(terrLists)
  terrListsArr.sort((x, y) => {
    const xTerr = x[1]
    const yTerr = y[1]
    return xTerr.top + xTerr.height - yTerr.top + yTerr.height
  })
  terrListsArr.forEach(item => {
    _terrLists[item[0]] = item[1]
  })
  return _terrLists
}

export function computedPixe (pixe) {
  return pixe * (window.devicePixelRatio || 1)
}
