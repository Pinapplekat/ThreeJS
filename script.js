import * as THREE from "./three.js";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const loader = new THREE.TextureLoader();

var fps = 30
var maxCameraDist = 10
var movementSpeed = 16
var rotationSmoothing = 0.05
var movementSmoothing = 0.05

var delta = 0

var cubePos = {
    x: 0,
    y: 2,
    z: 0,
    movementSpeed,
    geometry: new THREE.BoxGeometry(2, 4, 2),
    material: new THREE.MeshPhongMaterial({ color: 'purple' })
}
const cube = new THREE.Mesh(cubePos.geometry, cubePos.material);

var cameraPos = {
    x: 0,
    y: 7,
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
camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
camera.rotation.set(0, 0, 0);
const light = new THREE.HemisphereLight('#FFFFFF', '#757575', 1.7);
scene.add(light);
cube.position.set(cubePos.x, cubePos.y, cubePos.z);
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

    // Camera smoothing
    var beforeX = camera.rotation.x
    var beforeY = camera.rotation.y
    var beforeZ = camera.rotation.z
    camera.lookAt(cubePos.x, cubePos.y, cubePos.z)
    
    // Deals with a jitter when the camera changes between a rotation value of -PI to PI
    if (Math.abs(camera.rotation.z - beforeZ) >= Math.PI) {
        if (beforeZ < 0)
            var rotationZ = beforeZ - (2 * Math.PI - camera.rotation.z + beforeZ) * rotationSmoothing
        else 
            var rotationZ = beforeZ + (2 * Math.PI + camera.rotation.z - beforeZ) * rotationSmoothing

        if(Math.abs(rotationZ) > Math.PI) {
            if (rotationZ < 0)
                rotationZ = rotationZ + (2 * Math.PI)
            else 
                rotationZ = rotationZ - (2 * Math.PI)
        }
    }
    else {
        var rotationZ = beforeZ + (camera.rotation.z - beforeZ) * rotationSmoothing
    }
    if (Math.abs(camera.rotation.x - beforeX) >= Math.PI) {
        if (beforeX < 0)
            var rotationX = beforeX - (2 * Math.PI - camera.rotation.x + beforeX) * rotationSmoothing
        else 
            var rotationX = beforeX + (2 * Math.PI + camera.rotation.x - beforeX) * rotationSmoothing

        if(Math.abs(rotationX) > Math.PI) {
            if (rotationX < 0)
                rotationX = rotationX + (2 * Math.PI)
            else 
                rotationX = rotationX - (2 * Math.PI)
        }
    }
    else {
        var rotationX = beforeX + (camera.rotation.x - beforeX) * rotationSmoothing
    }

    camera.rotation.set(rotationX, beforeY + (camera.rotation.y - beforeY) * rotationSmoothing, rotationZ)

    // Camera follow player script
    var playerDist = Math.sqrt((cubePos.x - cameraPos.x)**2 + (cubePos.y - cameraPos.y)**2 + (cubePos.z - cameraPos.z)**2)
    if (playerDist > maxCameraDist) {
        var scale = maxCameraDist / playerDist
        cameraPos.x = cameraPos.x - (cameraPos.x - (cubePos.x + (cameraPos.x - cubePos.x) * scale)) * movementSmoothing
        cameraPos.y = cameraPos.y - (cameraPos.y - cubePos.y - 5) * movementSmoothing
        cameraPos.z = cameraPos.z - (cameraPos.z - (cubePos.z + (cameraPos.z - cubePos.z) * scale)) * movementSmoothing

        camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z)
    }
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
    if (keysPressed[' ']) {
        cubePos.y += cubePos.movementSpeed * delta;
    }
    if (keysPressed['c']) {
        cubePos.y -= cubePos.movementSpeed * delta;
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