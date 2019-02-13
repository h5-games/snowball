interface configInterface {
  terrSizes: {
    1: number
    2: number
  }

  ballRadius: number

  init: {
    (canvas: any): void
  }
}

const config: configInterface = {
  terrSizes: {
    1: 0,
    2: 0
  },

  ballRadius: 0,

  init({width}) {
    // 这里依据canvas宽度来初始化部分属性 避免父盒非body造成比例错误

    config.terrSizes = {
      1: width * 0.08,
      2: width * 0.1
    }
    config.ballRadius = width * 0.024
  }
}

export default config;
