// main.js

// import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load textures and set up the scene
const textureLoader = new THREE.TextureLoader();
textureLoader.load('https://cdn.pengine.dev/products/templates/renders/Background-1--xC07VHSavwduU3rN.png', (texture) => {
    const geometry = new THREE.PlaneGeometry(4, 4);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    camera.position.z = window.userData.zPosition;
    renderer.render(scene, camera);
});

const button = document.getElementById('capture');
button.addEventListener('click', () => {
    renderer.setSize(1000, 1000);
    renderer.render(scene, camera);

    const dataURL = renderer.domElement.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = dataURL;
    link.click();
});
