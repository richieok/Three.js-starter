import * as THREE from 'three';
import { OrbitControls } from "jsm/controls/OrbitControls.js"


setup()

function setup() {
    const scene = new THREE.Scene();
    const vbcr = document.querySelector("main").getBoundingClientRect()
    // console.log(vbcr);
    const camera = new THREE.PerspectiveCamera(75, vbcr.width / vbcr.height, 0.1, 1000);
    camera.position.z = 5;
    const camera2 = new THREE.PerspectiveCamera(75, vbcr.width / vbcr.height, 0.1, 1000);
    camera2.position.x = 5;
    camera2.position.y = 3;
    camera2.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(vbcr.width, vbcr.height)
    document.querySelector("main").appendChild(renderer.domElement)

    let activeCamera = camera;

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25

    const controls2 = new OrbitControls(camera2, renderer.domElement)
    controls2.enableDamping = true
    controls2.dampingFactor = 0.25
    controls2.enabled = false

    // persist camera state
    function saveCamState(key, cam, ctrl) {
        localStorage.setItem(key, JSON.stringify({
            position: cam.position.toArray(),
            target: ctrl.target.toArray()
        }));
    }

    function loadCamState(key, cam, ctrl) {
        const saved = localStorage.getItem(key);
        if (!saved) return;
        const { position, target } = JSON.parse(saved);
        cam.position.fromArray(position);
        ctrl.target.fromArray(target);
        ctrl.update();
    }

    loadCamState('jupiter_cam1', camera, controls);
    loadCamState('jupiter_cam2', camera2, controls2);

    const savedActive = localStorage.getItem('jupiter_activeCamera');
    if (savedActive === 'cam2') {
        activeCamera = camera2;
        controls.enabled = false;
        controls2.enabled = true;
        document.getElementById('cam2').checked = true;
        document.getElementById('cam1').checked = false;
    }

    controls.addEventListener('change', () => saveCamState('jupiter_cam1', camera, controls));
    controls2.addEventListener('change', () => saveCamState('jupiter_cam2', camera2, controls2));

    const loader = new THREE.TextureLoader()

    const geo = new THREE.IcosahedronGeometry(1.0, 12)
    // const mat = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true})
    const mat = new THREE.MeshStandardMaterial({ map: loader.load("../assets/textures/jupitermap.jpg")})
    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)
    const ambLight = new THREE.AmbientLight();
    scene.add(ambLight);
    // const hemilight = new THREE.HemisphereLight(0xffff00, 0x0000ff, 1)
    // scene.add(hemilight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    scene.add(directionalLight);
    // const ptLight = new THREE.PointLight(0xff00ff, 20);
    // ptLight.position.set(4, 0, 0)
    // scene.add(ptLight);

    const ctrls = document.querySelector(".controls")
    ctrls.addEventListener("click", (evt)=>{
        let id = evt.target.id;
        switch(id) {
            case "amL":
                evt.target.checked ? scene.add(ambLight) : scene.remove(ambLight);
                break;
            case "dirL":
                evt.target.checked ? scene.add(directionalLight) : scene.remove(directionalLight);
                break
            case "shdFlat":
                evt.target.checked ? mat.flatShading = true : mat.flatShading = false;
                break
            case "cam1":
                activeCamera = camera;
                controls.enabled = true;
                controls2.enabled = false;
                localStorage.setItem('jupiter_activeCamera', 'cam1');
                break;
            case "cam2":
                activeCamera = camera2;
                controls.enabled = false;
                controls2.enabled = true;
                localStorage.setItem('jupiter_activeCamera', 'cam2');
                break;
            default:
                break;
        }
    })

    animate()

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, activeCamera);
        (activeCamera === camera ? controls : controls2).update()
    }

    // window.addEventListener("resize", ()=>{

    // })
}
