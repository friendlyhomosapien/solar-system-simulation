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

let pointer = {
    x: 0,
    y: 0
}
let pointerClick = {
    x: (0 / window.innerWidth ) * 2 - 1,
    y: - (0 / window.innerHeight ) * 2 + 1
}

const canvas = document.querySelector('canvas#webgl');

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

const mesh = {
    sun: {
        normal: null,
        select: null
    },
    mercury: {
        normal: null,
        select: null
    },
    venus: {
        normal: null,
        select: null
    },
    earth: {
        normal: null,
        select: null
    },
    mars: {
        normal: null,
        select: null
    },
};

mesh.sun.normal = new CreateSphere(1, 100, 100, .005)
    .createShaderMesh(SunTexture, SunCloudTexture);
mesh.sun.select = new CreateSphere(1.005, 100, 100, .005)
    .createPoints(.025);
const sunMeshGroup = new THREE.Group();
sunMeshGroup.add(mesh.sun.normal);
sunMeshGroup.add(mesh.sun.select);

mesh.mercury.normal = new CreateSphere(.025, 20, 20)
    .createMesh(MercuryTexture);
mesh.mercury.select = new CreateSphere(.0255, 20, 20)
    .createPoints(0.01);
const mercuryMeshGroup = new THREE.Group();
    mercuryMeshGroup.add(mesh.mercury.normal);
    mercuryMeshGroup.add(mesh.mercury.select);
mercuryMeshGroup.position.x = 1.4;

mesh.venus.normal = new CreateSphere(.05, 20, 20)
    .createMesh(VenusSurfaceTexture);
mesh.venus.select = new CreateSphere(.0505, 20, 20)
    .createPoints(0.01);
const venusMeshGroup = new THREE.Group();
    venusMeshGroup.add(mesh.venus.normal);
    venusMeshGroup.add(mesh.venus.select);
venusMeshGroup.position.x = 1.8;

mesh.earth.normal = new CreateSphere(.1, 20, 20)
    .createMesh(EarthDayTexture);
mesh.earth.select = new CreateSphere(.1005, 20, 20)
    .createPoints(0.01);
const earthMeshGroup = new THREE.Group();
    earthMeshGroup.add(mesh.earth.normal);
    earthMeshGroup.add(mesh.earth.select);
earthMeshGroup.position.x = 2.2;

mesh.mars.normal = new CreateSphere(.08, 20, 20)
    .createMesh(MarsTexture);
mesh.mars.select = new CreateSphere(.0805, 20, 20)
    .createPoints(0.01);
const marsMeshGroup = new THREE.Group();
    marsMeshGroup.add(mesh.mars.normal);
    marsMeshGroup.add(mesh.mars.select);

marsMeshGroup.position.x = 2.6;

// const solarObjects = new THREE.Group();
// solarObjects.add(mesh.mercury.normal);
// solarObjects.add(mesh.venus.normal);
// solarObjects.add(mesh.earth.normal);
// solarObjects.add(mesh.mars.normal);

// solarObjects.add(mesh.sun.normal);
// solarObjects.add(mesh.sun.select);

mesh.sun.select.visible = false;

const renderModel = new RenderPass(scene, camera);
const effectBloom = new BloomPass(1.25);
const effectFilm = new FilmPass(0.35, 0.95, 2048, false);

const composer = new EffectComposer(renderer);
composer.addPass(renderModel);
composer.addPass(effectBloom);
composer.addPass(effectFilm);

const raycaster = new THREE.Raycaster();

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;

function introAnimation() {
    gsap.to(camera.position, {
        delay: 1,
        duration: 5,
        z: 4.75,
        y: 7,
        ease: "power2.inOut"
    })
    gsap.to(camera.rotation, {
        delay: 1,
        duration: 5,
        x: -1,
        ease: "power2.inOut"
    })
    gsap.to(mesh.sun.normal.rotation, {
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

    scene.add(sunMeshGroup);
    scene.add(mercuryMeshGroup);
    scene.add(venusMeshGroup);
    scene.add(earthMeshGroup);
    scene.add(marsMeshGroup);

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

    const updatePointerClick = (e) => {
        pointerClick.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        pointerClick.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
    }

    const updatePointerMove = (e) => {
        pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
        Object.keys(mesh).forEach((key) => {
            const intersect = raycaster.intersectObject(mesh[key].normal);
    
            raycaster.setFromCamera( {
                x: pointerClick.x,
                y: pointerClick.y
            }, camera);
    
            if ( intersect.length > 0 ) {
                mesh[key].select.visible = true;
            } else {
                mesh[key].select.visible = false;
            }
        })
    }

    document.addEventListener('mousemove', updatePointerMove)
    document.body.addEventListener('mouseup', updatePointerClick)

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
    lightOptionGUI.add(light, 'distance', -5, 5, .01);
    lightOptionGUI.add(light, 'decay', -5, 5, .01);
    
    const cameraPositionGUI = gui.addFolder('camera position');
    cameraPositionGUI.add(camera.position, 'x', -5, 5, 0.01);
    cameraPositionGUI.add(camera.position, 'y', -5, 100, 0.01);
    cameraPositionGUI.add(camera.position, 'z', -5, 100, 0.01);
    
    const cameraRotationGUI = gui.addFolder('camera rotation');
    cameraRotationGUI.add(camera.rotation, 'x', -5, 5, 0.01);
    cameraRotationGUI.add(camera.rotation, 'y', -5, 5, 0.01);
    cameraRotationGUI.add(camera.rotation, 'z', -5, 5, 0.01);
    
    const sunRotationGUI = gui.addFolder('sun rotation');
    sunRotationGUI.add(mesh.sun.normal.rotation, 'x', -10, 10, 0.01);
    sunRotationGUI.add(mesh.sun.normal.rotation, 'y', -10, 10, 0.01);
    sunRotationGUI.add(mesh.sun.normal.rotation, 'z', -10, 10, 0.01);

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

stars.rotation.y = (pointer.x + clock.getElapsedTime()) / 1000;
stars.rotation.x = (pointer.y + clock.getElapsedTime()) / 1000;

let selectedMesh = null;

function setSelectedMesh(key = null) {
    if (!key) {

    }
}
function setInfoPanelAttribute(key = null) {
    if (!key) {
        document.querySelector('#modal').removeAttribute('data-info-panel');
    } else {
        document.querySelector('#modal').setAttribute('data-info-panel', key);
    }
}

function animate() {
    const delta = 5 * clock.getDelta();
    const elapsedTime = clock.getElapsedTime()

    // Object.keys(mesh).forEach((key) => {
    //     const intersect = raycaster.intersectObject(mesh[key].normal);

    //     raycaster.setFromCamera( {
    //         x: pointerClick.x,
    //         y: pointerClick.y
    //     }, camera);

    //     if ( intersect.length > 0 ) {
    //         mesh[key].select.visible = true;
    //     } else {
    //         mesh[key].select.visible = false;
    //     }
    // })

    mesh.sun.normal.rotation.y = .05 * elapsedTime
    mesh.sun.normal.material.uniforms[ 'time' ].value += 0.2 * delta;

    orbitObj(mercuryMeshGroup, orbitCalc(elapsedTime, 1.4));
    orbitObj(venusMeshGroup,   orbitCalc(elapsedTime, 1.8));
    orbitObj(earthMeshGroup,   orbitCalc(elapsedTime, 2.2));
    orbitObj(marsMeshGroup,    orbitCalc(elapsedTime, 2.6));

    mesh.mercury.normal.rotation.x = elapsedTime / 50;
    mesh.mercury.normal.rotation.z = elapsedTime / 50;

    mesh.venus.normal.rotation.x = elapsedTime / 100;
    mesh.venus.normal.rotation.z = elapsedTime / 100;

    mesh.earth.normal.rotation.x = elapsedTime / 100;
    mesh.earth.normal.rotation.z = elapsedTime / 100;

    mesh.mars.normal.rotation.z = elapsedTime / 100;
    mesh.mars.normal.rotation.z = elapsedTime / 100;

    stars.rotation.y = (pointer.x * 100 + elapsedTime * 50) / 10000;
    stars.rotation.x = (pointer.y * 100 + elapsedTime) / 10000;

    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(animate)
}

init()
animate();
