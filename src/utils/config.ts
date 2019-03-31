interface configInterface {
  terrSizes: number[]

  ballRadius: number

  init: {
    (canvas: any): void
  }
}

const config: configInterface = {
  terrSizes: [],

  ballRadius: 0,

  init({ width }) {
    // 这里依据canvas宽度来初始化部分属性 避免父盒非body造成比例错误

    config.terrSizes = [width * 0.08, width * 0.1]
    config.ballRadius = width * 0.022
  }
}

export default config;
