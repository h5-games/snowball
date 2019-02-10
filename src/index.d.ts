interface engineConfig {
  terrNum?: number
  terrImagePath: string
  space?: number
  ballInitialTop?: number
}

interface engineInterface {
  config: engineConfig
  canvas: any
  context: any
  terrImage: any
  startStatus: boolean
  gameTimer: number
  ball: BallInterface
  terrList: {
    [key: string]: TerrInterface
  }

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
    (BallInterface): void
  }
  paintTerr: {
    (TerrInterface): void
  }
}

interface BallConfigInterface {
  left?: number,
  top?: number
  direction?: boolean
  radius?: number
  color?: string
  space?: number
}

interface BallInterface {
  left: number,
  top: number
  direction: boolean
  radius: number
  color: string
  space: number
}

interface TerrConfigInterface {
  size: number
  left: number
  top: number
}

interface TerrInterface {
  id: string
  width: number
  height: number
  left: number
  top: number
}
