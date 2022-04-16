import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js';

import { gsap } from 'gsap';

import * as dat from 'dat.gui'

import CreateCamera from '@/Create/CreateCamera.js';
import CreateLight from '@/Create/CreateLight.js';
import CreateStars from '@/Create/CreateStars.js';
import CreateSphere from '@/Create/CreateSphere.js';

import SunTexture from '@/Textures/SunTexture.jpg';
import SunCloudTexture from '@/Textures/SunCloudTexture.png';
import MercuryTexture from '@/Textures/MercuryTexture.jpg';
import VenusSurfaceTexture from '@/Textures/VenusSurfaceTexture.jpg';
import VenusCloudTexture from '@/Textures/VenusCloudTexture.jpg';
import EarthDayTexture from '@/Textures/EarthDayTexture.jpg';
import MarsTexture from '@/Textures/MarsTexture.jpg';

const gui = new dat.GUI();

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

let mouseY = 0;
let mouseX = 0;

const canvas = document.querySelector('canvas#app');

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2( 0x000000, 0.001 );

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(new THREE.Color('#001517'));

const camera = CreateCamera(sizes);
camera.position.z = 20;

const light = CreateLight();

const stars = new CreateStars();

const sunMesh = new CreateSphere(1, 150, 150, .005).createShaderMesh(SunTexture, SunCloudTexture);

const mercuryMesh = new CreateSphere(.025, 20, 20).createMesh(MercuryTexture);
const venusMesh = new CreateSphere(.05, 20, 20).createMesh(VenusSurfaceTexture);
const earthMesh = new CreateSphere(.1, 20, 20).createMesh(EarthDayTexture);
const marsMesh = new CreateSphere(.08, 20, 20).createMesh(MarsTexture);

const solarObjects = new THREE.Group();
solarObjects.add(mercuryMesh);
solarObjects.add(venusMesh);
solarObjects.add(earthMesh);
solarObjects.add(marsMesh);
solarObjects.add(sunMesh);

const renderModel = new RenderPass(scene, camera);
const effectBloom = new BloomPass(1.25);
const effectFilm = new FilmPass(0.35, 0.95, 2048, false);

const composer = new EffectComposer(renderer);
composer.addPass(renderModel);
composer.addPass(effectBloom);
composer.addPass(effectFilm);

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;

function introAnimation() {
    gsap.to(camera.position, {
        delay: 1,
        duration: 5,
        z: 4.75,
        // y: 7,
        ease: "power2.inOut"
    })
    gsap.to(camera.rotation, {
        delay: 1,
        duration: 5,
        x: -1,
        ease: "power2.inOut"
    })
    gsap.to(sunMesh.rotation, {
        x: -0.87,
        delay: 1,
        duration: 5,
        ease: "power2.inOut"
    })
}

function init() {
    /**
     * Add objects to scene
     * 
     * */ 
    scene.add(camera);
    scene.add(light);
    scene.add(stars);
    scene.add(solarObjects);

    window.addEventListener('resize', () =>
    {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    const updateMouse = (e) => {
        mouseY = e.clientY;
        mouseX = e.clientX;
    }

    document.addEventListener('mousemove', updateMouse)

    /**
     * Add gui for testing
     * 
     */
    const lightPositionGUI = gui.addFolder('light position');
    lightPositionGUI.add(light.position, 'x', -10, 10, 0.01);
    lightPositionGUI.add(light.position, 'y', -10, 10, 0.01);
    lightPositionGUI.add(light.position, 'z', -10, 10, 0.01);
    
    const lightOptionGUI = gui.addFolder('light options');
    lightOptionGUI.add(light, 'intensity', -5, 5, .01);
    // lightOptionGUI.add(light, 'distance', -5, 5, .01);
    // lightOptionGUI.add(light, 'decay', -5, 5, .01);
    
    const cameraPositionGUI = gui.addFolder('camera position');
    cameraPositionGUI.add(camera.position, 'x', -5, 5, 0.01);
    cameraPositionGUI.add(camera.position, 'y', -5, 100, 0.01);
    cameraPositionGUI.add(camera.position, 'z', -5, 100, 0.01);
    
    const cameraRotationGUI = gui.addFolder('camera rotation');
    cameraRotationGUI.add(camera.rotation, 'x', -5, 5, 0.01);
    cameraRotationGUI.add(camera.rotation, 'y', -5, 5, 0.01);
    cameraRotationGUI.add(camera.rotation, 'z', -5, 5, 0.01);
    
    const sunRotationGUI = gui.addFolder('sun rotation');
    sunRotationGUI.add(sunMesh.rotation, 'x', -10, 10, 0.01);
    sunRotationGUI.add(sunMesh.rotation, 'y', -10, 10, 0.01);
    sunRotationGUI.add(sunMesh.rotation, 'z', -10, 10, 0.01);

    introAnimation();
}

/**
 * Animate
 */

 function orbitCalc(time, radius, speed = 1) {
    return {
        y: (Math.sin(speed * (time / 60) * Math.PI * 2) * radius),
        z: (Math.cos(speed * (time / 60) * Math.PI * 2) * radius),
        x: (Math.sin(speed * (time / 60) * Math.PI * 2) * radius),
    };
}

function orbitObj(obj, orbitCalc) {
    obj.position.x = orbitCalc.x;
    obj.position.z = orbitCalc.z;
}

const clock = new THREE.Clock()

stars.rotation.y = (mouseX + clock.getElapsedTime()) / 1000;
stars.rotation.x = (mouseY + clock.getElapsedTime()) / 1000;

function animate() {
    const delta = 5 * clock.getDelta();
    const elapsedTime = clock.getElapsedTime()

    sunMesh.rotation.y = .05 * elapsedTime
    sunMesh.material.uniforms[ 'time' ].value += 0.2 * delta;

    orbitObj(mercuryMesh, orbitCalc(elapsedTime, 1.4));
    orbitObj(venusMesh,   orbitCalc(elapsedTime, 1.8));
    orbitObj(earthMesh,   orbitCalc(elapsedTime, 2.2));
    orbitObj(marsMesh,    orbitCalc(elapsedTime, 2.6));

    mercuryMesh.rotation.x = elapsedTime / 50;
    mercuryMesh.rotation.z = elapsedTime / 50;

    venusMesh.rotation.x = elapsedTime / 100;
    venusMesh.rotation.z = elapsedTime / 100;

    earthMesh.rotation.x = elapsedTime / 100;
    earthMesh.rotation.z = elapsedTime / 100;

    marsMesh.rotation.z = elapsedTime / 100;
    marsMesh.rotation.z = elapsedTime / 100;

    stars.rotation.y = (mouseX + elapsedTime * 50) / 10000;
    stars.rotation.x = (mouseY + elapsedTime) / 10000;

    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(animate)
}

init()
animate();
