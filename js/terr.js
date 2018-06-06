import { terrSizeLists } from './lists.js'

export default class Terr {
  constructor (canvas, config = {}, terrImg) {
    const left = Math.floor(Math.random() * canvas.width + -10)
    const top = config.top || Math.floor(Math.random() * (canvas.height * 2) + canvas.height)
    const id = Math.floor(Math.random() * 8999999 + 1000000)

    const random = Math.floor(Math.random() * terrSizeLists.length)
    const randomSize = terrSizeLists[random]
    const { width, height } = randomSize
    const terrImage = {}
    if (terrImg) {
      const terrImgWidth = width * 6
      const terrImgHeight = terrImgWidth / (terrImg.width / terrImg.height)
      const terrImgLeft = left - terrImgWidth * 0.32
      const terrImgTop = top - terrImgHeight + height

      Object.assign(terrImage, {
        terrImg,
        terrImgWidth,
        terrImgHeight,
        terrImgLeft,
        terrImgTop
      })
    }

    Object.assign(this, {
      id,
      left,
      top,
      width,
      height,
      isNear: false,
      ...terrImage,
      ...config
    })
  }
}
