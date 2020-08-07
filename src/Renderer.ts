import Scene from './Scene';
import Camera from './Camera';

class Renderer {
  domElement: HTMLCanvasElement;
  width: number;
  height: number;

  constructor(width, height) {
    this.domElement = document.createElement('canvas');
    if (width && height) {
      this.setSize(width, height);
    }
  }

  setSize(width: number, height: number) {
    const { domElement } = this;
    domElement.style.width = width + 'px';
    domElement.style.height = height + 'px';
    Object.assign(this, {
      width,
      height
    })
  }

  render(scene: Scene, camera: Camera) {
    console.log(scene, camera);
  }
}

export default Renderer;
