interface ResourceD {
  src: string;
  id: number | string;
  status?: string;
  resource?: HTMLImageElement;
}

interface EngineD {
  container: HTMLElement;
  devicePixelRatio: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D

  loadResource(
    resources: Array<ResourceD>,
    callback?: {
      (progress: number): void
    }
  ): Promise<Array<ResourceD>>
}
