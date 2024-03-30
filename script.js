import * as THREE from "./three.js";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const loader = new THREE.TextureLoader();

var fps = 144

var movementSpeed = 16

var delta = 0

var cubePos = {
    x: 0,
    y: 10,
    z: 0,
    movementSpeed,
    geometry: new THREE.BoxGeometry(2, 4, 2),
    material: new THREE.MeshPhongMaterial({ color: 'purple' })
}
const cube = new THREE.Mesh(cubePos.geometry, cubePos.material);

var cameraPos = {
    x: 0,
    y: 15,
    z: 0,
    movementSpeed
}

var planePos = {
    x: 0,
    y: 0,
    z: 0,
    geometry: new THREE.PlaneGeometry(100, 100),
    texture: loader.load('texture.jpg'),
    material: new THREE.MeshPhongMaterial()
}

document.querySelector('canvas').remove();
scene.background = new THREE.Color('#161718');
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.set(0, 15, 0);
camera.rotation.set(0, 0, 0);
const light = new THREE.HemisphereLight('#FFFFFF', '#757575', 1.7);
scene.add(light);
cube.position.set(0, 0, 0);
cube.rotation.set(0, 0, 0);

planePos.material.map = planePos.texture;
const plane = new THREE.Mesh(planePos.geometry, planePos.material);
plane.rotation.set(-Math.PI / 2, 0, 0)
scene.add(plane);
scene.add(cube);
renderer.render(scene, camera);
var lastMousePos = 0;

let keysPressed = {};
setInterval(() => {
    delta = 1/fps
    camera.lookAt(cubePos.x, cubePos.y, cubePos.z)
    if (keysPressed['d']) {
        cubePos.x += cubePos.movementSpeed * delta;
    }
    if (keysPressed['a']) {
        cubePos.x -= cubePos.movementSpeed * delta;
    }
    if (keysPressed['s']) {
        cubePos.z += cubePos.movementSpeed * delta;
    }
    if (keysPressed['w']) {
        cubePos.z -= cubePos.movementSpeed * delta;
    }
    cube.position.set(cubePos.x, cubePos.y, cubePos.z);
    renderer.render(scene, camera);
}, 1000/fps)

document.addEventListener('keydown', (e) => {
    keysPressed[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    delete keysPressed[e.key];
});