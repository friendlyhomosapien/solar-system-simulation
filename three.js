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

import SunTexture from '@/Assets/Textures/SunTexture.jpg';
import SunCloudTexture from '@/Assets/Textures/SunCloudTexture.png';
import MercuryTexture from '@/Assets/Textures/MercuryTexture.jpg';
import VenusSurfaceTexture from '@/Assets/Textures/VenusSurfaceTexture.jpg';
import VenusCloudTexture from '@/Assets/Textures/VenusCloudTexture.jpg';
import EarthDayTexture from '@/Assets/Textures/EarthDayTexture.jpg';
import MarsTexture from '@/Assets/Textures/MarsTexture.jpg';


let toggleCameraControl = false, toggleOrbitAnimate = true;

const toggleCameraControlBtn = document.querySelector('#toggle-camera-control');
const toggleOrbitAnimateBtn = document.querySelector('#toggle-orbit-animate');
const modal = document.querySelector('#modal');
const toggleModalBtn = document.querySelector('#modal__close');

const prevPlanetBtn = document.querySelector('#prev-planet');
const nextPlanetBtn = document.querySelector('#next-planet');

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

const diam = {
    mercury: 4878 / 12760 * .1,
    venus: 12104 / 12760 * .1,
    earth: 1 * .1,
    mars: 6787 / 12760 * .1
}
const dist = {
    mercury: 60 * .025,
    venus: 100 * .025,
    earth: 150 * .025,
    mars: 220 * .025
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

let selectedMesh = null;

const meshOrder = [
    'sun',
    'mercury',
    'venus',
    'earth',
    'mars'
];

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

const meshGroup = {
    sun: null,
    mercury: null,
    venus: null,
    earth: null,
    mars: null
};


mesh.sun.normal = new CreateSphere(1, 100, 100)
    .createShaderMesh(SunTexture, SunCloudTexture);
mesh.sun.select = new CreateSphere(1.005, 100, 100)
    .createPoints(.025);
mesh.sun.select.visible = false;

meshGroup.sun = new THREE.Group();
meshGroup.sun.add(mesh.sun.normal);
meshGroup.sun.add(mesh.sun.select);


mesh.mercury.normal = new CreateSphere(diam.mercury, 50, 50)
    .createMesh(MercuryTexture);
mesh.mercury.select = new CreateSphere(diam.mercury + .005, 20, 20)
    .createPoints(0.01);
mesh.mercury.select.visible = false;

meshGroup.mercury = new THREE.Group();
meshGroup.mercury.add(mesh.mercury.normal);
meshGroup.mercury.add(mesh.mercury.select);


mesh.venus.normal = new CreateSphere(diam.venus, 50, 50)
    .createMesh(VenusSurfaceTexture);
mesh.venus.select = new CreateSphere(diam.venus + .005, 20, 20)
    .createPoints(0.01);
mesh.venus.select.visible = false;

meshGroup.venus = new THREE.Group();
meshGroup.venus.add(mesh.venus.normal);
meshGroup.venus.add(mesh.venus.select);


mesh.earth.normal = new CreateSphere(diam.earth, 50, 50)
    .createMesh(EarthDayTexture);
mesh.earth.select = new CreateSphere(diam.earth + .005, 20, 20)
    .createPoints(0.01);
mesh.earth.select.visible = false;

meshGroup.earth = new THREE.Group();
meshGroup.earth.add(mesh.earth.normal);
meshGroup.earth.add(mesh.earth.select);


mesh.mars.normal = new CreateSphere(diam.mars, 20, 20)
    .createMesh(MarsTexture);
mesh.mars.select = new CreateSphere(diam.mars + .005, 20, 20)
    .createPoints(0.01);
mesh.mars.select.visible = false;

meshGroup.mars = new THREE.Group();
meshGroup.mars.add(mesh.mars.normal);
meshGroup.mars.add(mesh.mars.select);


const solarObjects = new THREE.Group();
solarObjects.add(meshGroup.sun);
solarObjects.add(meshGroup.mercury);
solarObjects.add(meshGroup.venus);
solarObjects.add(meshGroup.earth);
solarObjects.add(meshGroup.mars);


const renderModel = new RenderPass(scene, camera);
const effectBloom = new BloomPass(1.25);
const effectFilm = new FilmPass(0.35, 0.95, 2048, false);


const composer = new EffectComposer(renderer);
composer.addPass(renderModel);
composer.addPass(effectBloom);
composer.addPass(effectFilm);


const raycaster = new THREE.Raycaster();

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enabled = false;

function init() {
    scene.add(camera);
    scene.add(light);
    scene.add(stars);
    scene.add(solarObjects)

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


    const setInfoPanelAttribute = (key = null) => {
        if (!key) {
            modal.removeAttribute('data-info-panel');
        } else {
            modal.setAttribute('data-info-panel', key);
        }
    }
    const setSelectedMesh = (key) => {
        mesh[key].select.visible = true;
        setInfoPanelAttribute(key);
        setTimeout(() => {
            document.querySelector('#modal__close')
                .addEventListener(
                    'click',
                    removeSelectedMesh,
                    {
                        once: true
                    }
                );
        }, 250)
    };
    const removeSelectedMesh = () => {
        if (selectedMesh !== null) {
            mesh[selectedMesh].select.visible = false;
        }
        modal.removeAttribute('data-info-panel');
    }

    const checkIntersect = () => {
        let selected = false;

        Object.keys(mesh).forEach((key) => {
            raycaster.setFromCamera( {
                x: pointerClick.x,
                y: pointerClick.y
            }, camera);

            const intersect = raycaster.intersectObject(mesh[key].normal);

            if (intersect.length > 0 && !selected) {
                mesh[key].select.visible = true;
                selected = true;
                selectedMesh = key;
                setSelectedMesh(key);
            } else {
                mesh[key].select.visible = false;
            }
        })
        if (!selected) setInfoPanelAttribute();
    };

    const navNext = () => {
        if (selectedMesh === null) selectedMesh = 'venus';

        const indexOf = meshOrder.indexOf(selectedMesh);
        mesh[selectedMesh].select.visible = false;
        if (indexOf !== meshOrder.length - 1) {
            selectedMesh = meshOrder[indexOf + 1];
        } else {
            selectedMesh = meshOrder[0];
        }
        setSelectedMesh(selectedMesh);
    };

    const navPrev = () => {
        if (selectedMesh === null) selectedMesh = 'mars';

        const indexOf = meshOrder.indexOf(selectedMesh);
        mesh[selectedMesh].select.visible = false;
        if (indexOf > 0) {
            selectedMesh = meshOrder[indexOf - 1];
        } else {
            selectedMesh = meshOrder[meshOrder.length - 1];
        }
        setSelectedMesh(selectedMesh);
    }

    prevPlanetBtn.addEventListener('click', navPrev);
    nextPlanetBtn.addEventListener('click', navNext);

    const updatePointerMove = (e) => {
        pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
    }

    const updatePointerClick = (e) => {

        pointerClick.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        pointerClick.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

        checkIntersect();
    }


    document.addEventListener('mousemove', updatePointerMove);
    canvas.addEventListener('click', updatePointerClick);


    if (toggleModalBtn) {
        toggleModalBtn
            .addEventListener('click', removeSelectedMesh, { once: true });
    }

    if (toggleCameraControlBtn) {
        toggleCameraControlBtn.addEventListener('click', () => {
            toggleCameraControl = !toggleCameraControl;
            if (toggleCameraControl) {
                toggleCameraControlBtn.classList.add('toggle-button--active');
                controls.enabled = true;
            } else {
                toggleCameraControlBtn.classList.remove('toggle-button--active');
                controls.enabled = false;
            }
        })
    }

    if (toggleOrbitAnimateBtn) {
        toggleOrbitAnimateBtn.addEventListener('click', () => {
            toggleOrbitAnimate = !toggleOrbitAnimate;

            if (toggleOrbitAnimate) {
                toggleOrbitAnimateBtn.classList.add('toggle-button--active');
            } else {
                toggleOrbitAnimateBtn.classList.remove('toggle-button--active');
            }
        })
    }
}

/**
 * Add gui for testing
 * 
 */
function addGUI() {
    const gui = new dat.GUI();

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
}

/**
 * Animate
 */

function introAnimation() {
    gsap.to(camera.position, {
        delay: 1,
        duration: 5,
        z: 12,
        ease: "power2.inOut"
    })
    // gsap.to(camera.rotation, {
    //     delay: 1,
    //     duration: 5,
    //     x: -1,
    //     ease: "power2.inOut"
    // })
    // gsap.to(mesh.sun.normal.rotation, {
    //     x: -0.87,
    //     delay: 1,
    //     duration: 5,
    //     ease: "power2.inOut"
    // })
}

function orbitCalc(time, radius, speed = 1) {
    return {
        y: (Math.cos(speed * (time / 60) * Math.PI * 2) * radius) / 10,
        z: (Math.cos(speed * (time / 60) * Math.PI * 2) * radius),
        x: (Math.sin(speed * (time / 60) * Math.PI * 2) * radius),
    };
}

function orbitObj(obj, orbitCalc) {
    obj.position.x = orbitCalc.x;
    obj.position.y = orbitCalc.y;
    obj.position.z = orbitCalc.z;
}

const clock = new THREE.Clock()

stars.rotation.y = (pointer.x + clock.getElapsedTime()) / 1000;
stars.rotation.x = (pointer.y + clock.getElapsedTime()) / 1000;
function animate() {
    const delta = 5 * clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    mesh.sun.normal.rotation.y = .05 * elapsedTime
    mesh.sun.select.rotation.x = .05 * elapsedTime
    mesh.sun.select.rotation.y = .05 * elapsedTime
    mesh.sun.normal.material.uniforms[ 'time' ].value += 0.2 * delta;

    if (toggleOrbitAnimate) {
        orbitObj(meshGroup.mercury, orbitCalc(elapsedTime + 200, dist.mercury));
        orbitObj(meshGroup.venus,   orbitCalc(elapsedTime + 400, dist.venus));
        orbitObj(meshGroup.earth,   orbitCalc(elapsedTime + 0,   dist.earth));
        orbitObj(meshGroup.mars,    orbitCalc(elapsedTime + 500, dist.mars));
    }

    raycaster.setFromCamera( {
        x: pointer.x,
        y: pointer.y
    }, camera);

    Object.keys(mesh).some((key) => {
        const intersect = raycaster.intersectObject(mesh[key].normal);
        if (intersect.length > 0) {
            canvas.style.cursor = 'pointer';
            return true;
        } else {
            canvas.style.cursor = 'unset';
        }
    });

    mesh.mercury.normal.rotation.x = elapsedTime / 50;
    mesh.mercury.normal.rotation.z = elapsedTime / 50;
    mesh.mercury.select.rotation.x = - (elapsedTime / 50);
    mesh.mercury.select.rotation.z = - (elapsedTime / 50);

    mesh.venus.normal.rotation.x = elapsedTime / 100;
    mesh.venus.normal.rotation.z = elapsedTime / 100;
    mesh.venus.select.rotation.x = - (elapsedTime / 100);
    mesh.venus.select.rotation.z = - (elapsedTime / 100);

    mesh.earth.normal.rotation.x = elapsedTime / 100;
    mesh.earth.normal.rotation.z = elapsedTime / 100;
    mesh.earth.select.rotation.x = - (elapsedTime / 100);
    mesh.earth.select.rotation.z = - (elapsedTime / 100);

    mesh.mars.normal.rotation.z = elapsedTime / 100;
    mesh.mars.normal.rotation.z = elapsedTime / 100;
    mesh.mars.select.rotation.z = - (elapsedTime / 100);
    mesh.mars.select.rotation.z = - (elapsedTime / 100);

    stars.rotation.y = (pointer.x * 100 + elapsedTime * 50) / 10000;
    stars.rotation.x = (pointer.y * 100 + elapsedTime) / 10000;

    controls.update();

    renderer.render(scene, camera);

    window.requestAnimationFrame(animate);
}

init();
introAnimation();

animate();
// addGUI();
