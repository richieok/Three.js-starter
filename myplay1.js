import * as THREE from "three"
import {OrbitControls} from "jsm/controls/OrbitControls.js"

const renderer = new THREE.WebGLRenderer({ antialias: true })
const vbcr = viewer.getBoundingClientRect()
renderer.setSize(vbcr.width, vbcr.height)
viewer.appendChild(renderer.domElement)

// console.log(vbcr);

const geo = new THREE.BoxGeometry(1.5, 1, 0.5)
const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const box1 = new THREE.Mesh(geo, mat)

const scene = new THREE.Scene()
// scene.add(box1)

const lineMat = new THREE.LineBasicMaterial({ color: 0x0000ff })
const points = []
points.push( new THREE.Vector3( - 10, 0, 0 ) );
points.push( new THREE.Vector3( 0, 10, 0 ) );
points.push( new THREE.Vector3( 10, 0, 0 ) );
const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
const line = new THREE.Line(lineGeo, lineMat)
scene.add(line)

const camera = new THREE.PerspectiveCamera(75, vbcr.width / vbcr.height, 0.1, 100)
camera.position.z = 50
camera.lookAt(0, 0, 0)

function animate() {
    box1.rotation.x += 0.01
    box1.rotation.y += 0.02
    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)