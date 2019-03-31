interface engineConfig {
  terrImagePath: string
  ballInitialTop?: number
  ballInitialSpace?: number
  ballTailMaxLength?: number
}

interface engineInterface {
  config: engineConfig
  space: number
  terrNum: number
  canvasOffsetTop?: number
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
    (el: HTMLElement, config?: engineConfig): void
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
  left?: number
  top?: number
  direction?: boolean
  radius?: number
  color?: string
  space?: number
}

interface BallInterface {
  left: number
  top: number
  direction: boolean
  radius: number
  color: string
  space: number
  ySpace: number
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
