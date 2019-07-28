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
    config.terrSizes = [width * 0.08, width * 0.1]
    config.ballRadius = width * 0.022
  }
}

export default config;
