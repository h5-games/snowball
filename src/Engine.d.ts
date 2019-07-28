interface ResourceD {
  src: string;
  id: number | string;
  status?: string;
  resource?: HTMLImageElement;
}

interface EngineD {
  container: HTMLElement;
  devicePixelRatio: number;
}
