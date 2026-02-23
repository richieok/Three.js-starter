import * as THREE from 'three';
import { OrbitControls } from "jsm/controls/OrbitControls.js"
import { getStarfield } from "./getStarFiled.js"

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

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25

    const stars = getStarfield()
    scene.add(stars)

    const geo = new THREE.IcosahedronGeometry(1.0, 12)
    // const mat = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true})
    const loader = new THREE.TextureLoader()
    const mat = new THREE.MeshStandardMaterial({ map: loader.load("../assets/textures/earthmap1k.jpg") })
    const earthMesh = new THREE.Mesh(geo, mat)

    const earthGrp = new THREE.Group()
    earthGrp.rotation.z = -23.4 * Math.PI / 180
    scene.add(earthGrp)

    const earthSpinGrp = new THREE.Group()
    earthSpinGrp.add(earthMesh)
    earthGrp.add(earthSpinGrp)

    const lightsMat = new THREE.MeshBasicMaterial(
        {
            // color: 0x00ff00,
            // transparent: true, opacity: 0.2,
            map: loader.load("../assets/textures/earthlights1k.jpg"),
            blending: THREE.AdditiveBlending,
        }
    )
    const lightsMesh = new THREE.Mesh(geo, lightsMat)
    earthSpinGrp.add(lightsMesh)

    const cloudMat = new THREE.MeshStandardMaterial(
        {
            map: loader.load("../assets/textures/earthcloudmaptrans.jpg"),
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.1,
        }
    )
    const cloudMesh = new THREE.Mesh(geo, cloudMat)
    earthSpinGrp.add(cloudMesh)
    cloudMesh.scale.setScalar(1.01)

    const ambLight = new THREE.AmbientLight();
    scene.add(ambLight);
    // const hemilight = new THREE.HemisphereLight(0xffff00, 0x0000ff, 1)
    // scene.add(hemilight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-10, 0, 0);
    scene.add(directionalLight);
    // const ptLight = new THREE.PointLight(0xff00ff, 20);
    // ptLight.position.set(4, 0, 0)
    // scene.add(ptLight);

    const ctrls = document.querySelector(".controls")
    ctrls.addEventListener("click", (evt) => {
        let id = evt.target.id;
        switch (id) {
            case "amL":
                evt.target.checked ? scene.add(ambLight) : scene.remove(ambLight);
                break;
            case "dirL":
                evt.target.checked ? scene.add(directionalLight) : scene.remove(directionalLight);
                break
            case "shdFlat":
                evt.target.checked ? mat.flatShading = true : mat.flatShading = false;
                break
            default:
                break;
        }
    })

    animate()

    function animate() {
        requestAnimationFrame(animate);
        earthSpinGrp.rotation.y += 0.01
        // lightsMesh.rotation.y += 0.01
        renderer.render(scene, camera);
        controls.update()
    }

    // window.addEventListener("resize", ()=>{

    // })
}
