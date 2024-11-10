import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const camera = new THREE.PerspectiveCamera(
  10,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 45;
camera.position.y = 3;
const scene = new THREE.Scene();
let rex;
let mixer;
const loader = new GLTFLoader();

let currentAnimationIndex = 0;
let animations = [];

function playNextAnimation() {
  if (mixer && animations.length > 0) {
    mixer.stopAllAction();
    rex.rotation.y = Math.random() < 0.5 ? 100 : -100;
    const action = mixer.clipAction(animations[currentAnimationIndex]);
    action.setLoop(THREE.LoopOnce);
    action.clampWhenFinished = true;

    action.play();

    console.log(`Playing animation index: ${currentAnimationIndex}`);

    currentAnimationIndex = (currentAnimationIndex + 1) % animations.length;
  }
}

loader.load(
  "./t_rex.glb",
  function (gltf) {
    rex = gltf.scene;
    scene.add(rex);

    mixer = new THREE.AnimationMixer(rex);

    animations = gltf.animations;

    if (animations.length > 0) {
      playNextAnimation();
      mixer.addEventListener("finished", playNextAnimation);
    } else {
      console.warn("No animations found in the model.");
    }
  },
  function (xhr) {},
  function (error) {
    console.error("Error loading model:", error);
  }
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 6);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 6);
topLight.position.set(500, 500, 500);
scene.add(topLight);

const reRender3D = () => {
  requestAnimationFrame(reRender3D);
  renderer.render(scene, camera);
  if (mixer) mixer.update(0.02);
};
reRender3D();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
