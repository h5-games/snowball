interface initConfig {
  baseTerrNum?: number
}

interface initEngine {
  (el: any, config?: initConfig): void
}

interface engine {
  config: object
  touchStartEventListener: any[]
  initEngine: initEngine
  initGame: any
}