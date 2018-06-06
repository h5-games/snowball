export default class Terr {
  constructor (canvas, config = {}) {
    const left = Math.floor(Math.random() * canvas.width + -10)
    const top = Math.floor(Math.random() * (canvas.height * 2) + canvas.height)
    const id = Math.floor(Math.random() * 8999999 + 1000000)

    Object.assign(this, {
      id,
      left,
      top,
      width: 6,
      height: 10,
      ...config
    })
  }
}
