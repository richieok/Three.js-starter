import * as THREE from 'three';
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';
import {OrbitControls} from "jsm/controls/OrbitControls.js"

const scene = new THREE.Scene();
const vbcr = viewer.getBoundingClientRect()
console.log(vbcr);
const camera = new THREE.PerspectiveCamera(75, vbcr.width / vbcr.height, 0.1, 1000);
camera.position.z = 10;
// camera.lookAt(0, 0, 0)

const camera2 = new THREE.PerspectiveCamera(75, vbcr.width / vbcr.height, 0.1, 1000);
camera2.position.z = 10;

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.setSize(vbcr.width, vbcr.height)
viewer.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

const ambLight = new THREE.AmbientLight(0xffffff, 2);
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set(-10, 5, 5);
const ptLight = new THREE.PointLight(0xff00ff, 20);
const ptLight2 = new THREE.PointLight(0xffffff, 20);
const ptLight3 = new THREE.PointLight(0x00ffff, 20);
ptLight2.position.set(3, 0, 0)
ptLight3.position.set(-3, 0, 0)
// scene.add( directionalLight );

const loader = new GLTFLoader();

let mixer; 

loader.load(
    './scenes/animated-suzanne.glb',
    function (gltf) {
        // scene
        gltf.scene.add(ambLight)
        gltf.scene.add(directionalLight)
        // gltf.scene.add(ptLight)
        // gltf.scene.add(ptLight2)
        // gltf.scene.add(ptLight3)
        scene.add(gltf.scene);
        mixer = new THREE.AnimationMixer(gltf.scene);
        const clips = gltf.animations;
        const clip = THREE.AnimationClip.findByName(clips, 'RightEarAct');
        if (clip) mixer.clipAction(clip).play();
        // clips.forEach(clip => {
        //     const action = mixer.clipAction(clip);
        //     action.play();
        // });
        // console.log(gltf.scene.getObjectByName("Cone"));
        console.log(scene);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('An error happened', error);
    }
);

let prevTime = 0;

function animate(time) {
    const delta = (time - prevTime) / 1000;
    prevTime = time;
    mixer?.update(delta);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update()
}
animate(0);