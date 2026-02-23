import * as THREE from 'three';
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
const vbcr = viewer.getBoundingClientRect()
console.log(vbcr);

renderer.setSize(vbcr.width, vbcr.height)
viewer.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(75, vbcr.width / vbcr.height, 0.1, 1000);
camera.position.z = 3
// camera.lookAt(0, -5, 0)

const scene = new THREE.Scene();

const loader = new GLTFLoader();

loader.load("./model-practice.glb", function (gltf) {
    console.log(gltf.scene.position.x = 0);
    
    scene.add(gltf.scene)
}, function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
}, function (error) {
    console.log(error)
})

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );

const geo = new THREE.IcosahedronGeometry(1.0, 1)
// const mat = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true})
const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true })
const mesh = new THREE.Mesh(geo, mat)
scene.add(mesh)

// renderer.render(scene, camera)

function animate() {
    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)