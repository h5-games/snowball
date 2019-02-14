interface engineConfig {
  terrNum?: number
  terrImagePath: string
  space?: number
  ballInitialTop?: number
  ballInitialSpace?: number
  ballTailMaxLength?: number
  canvasOffsetTop?: number
}

interface engineInterface {
  config: engineConfig
  canvas: any
  context: any
  terrImage: any
  startStatus: boolean
  gameTimer: number
  ball: BallInterface
  ballTailList: ballTailInterface[]
  terrList: {
    [key: string]: TerrInterface
  },
  isTouch: boolean

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
    (ball: BallInterface): void
  }
  paintBallTail: {
    (ballTailList: ballTailInterface[]): void
  }
  paintTerr: {
    (terr: TerrInterface): void
  }
}

interface BallConfigInterface {
  left?: number,
  top?: number
  direction?: boolean
  radius?: number
  color?: string
}

interface BallInterface {
  left: number,
  top: number
  direction: boolean
  radius: number
  color: string
  space: number
  degree: number
  maxDegree: number
  minDegree: number
  move: {
    (isTouch: boolean): void
  }
}

interface ballTailInterface {
  left: number
  top: number
  degree: number
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
