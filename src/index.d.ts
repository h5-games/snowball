interface config {
  terrNum?: number
  terrImagePath: string
}

interface initEngine {
  (el: any, config: config): void
}

interface loadResource {
  (config: config): any
}

interface engine {
  config: config
  canvas: any,
  context: any,
  terrImage: any
  startStatus: boolean
  initEngine: initEngine
  loadResource: loadResource
  initGame: any
  startGame: any
}
