interface engineConfig {
  terrNum?: number
  terrImagePath: string
}

interface engineInterface {
  config: engineConfig
  canvas: any
  context: any
  terrImage: any
  startStatus: boolean
  gameTimer: number
  ball: BallInterface
  terrList: TerrInterface[]

  initEngine: {
    (el: any, config: engineConfig): void
  }
  loadResource: {
    (config: engineConfig): any
  }
  initGame: {
    (): void
  }
  gameStart: {
    (): void
  }
  animate: {
    (): void
  }
  clearCanvas: {
    (): void
  }
  paintBall: {
    (): void
  }
}

interface BallConfigInterface {
  left?: number,
  top?: number
  direction?: boolean
  radius?: number
  color?: string
  space: number
}

interface BallInterface {
  left: number,
  top: number
  direction: boolean
  radius: number
  color: string
  space: number

  move: {
    (): void
  }
}

interface TerrConfigInterface {

}

interface TerrInterface {

}
