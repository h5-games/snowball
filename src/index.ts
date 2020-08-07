import Renderer from './Renderer';
import Scene from './Scene';
import Entity from './Entity';

const { offsetWidth, offsetHeight } = document.body;
const renderer = new Renderer(offsetWidth, offsetHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  const { offsetWidth, offsetHeight } = document.body;
  renderer.setSize(offsetWidth, offsetHeight);
});

const scene = new Scene();
const tree = new Entity();
scene.add(tree);
