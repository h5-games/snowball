interface ElementInterface {
  x: number;
  y: number;

}

interface EventInterface {
  name: string;

}

interface EngineInterface {
  eventListener: {
    start: EventInterface[]
  }
}

class Engine {

}

export default Engine;
