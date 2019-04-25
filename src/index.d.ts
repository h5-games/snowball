interface resourcesInterface {
  terrImagePath?: string
}

interface resourcesElementInterface {
  terrImagePath?: HTMLImageElement
}

interface engineConfig {
  resources: resourcesInterface
  initialSpace?: number
  ballInitialTop?: number
  ballTailMaxLength?: number
}

interface engineInterface {
  config: engineConfig
  space: number
  terrNum: number
  canvasOffsetTop?: number
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
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
    (
      resources: resourcesInterface, 
      callback?: {
        (progress: number): void
      }
    ): Promise<resourcesElementInterface>
  }
  initGame: {
    (): void
  }
  gameStart: {
    (): void
  }
  transform: {
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
  degree: number
  maxDegree: number
  minDegree: number
  move: {
    (engine: engineInterface): void
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
  trunk: {
    width: number
    height: number
    left: number
    top: number
  }
}
