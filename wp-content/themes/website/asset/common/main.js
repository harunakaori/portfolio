import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

const noise3D = createNoise3D();

/* ===============================
   Three.js 基本設定
================================ */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfcfcfc);
scene.fog = new THREE.Fog(0xfcfcfc, 15, 65);

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 15, 30);
camera.lookAt(0, 0, 0);

const container = document.getElementById('canvas-container');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

/* ===============================
   Light
================================ */
scene.add(new THREE.AmbientLight(0xffffff, 0.8));

const topLight = new THREE.DirectionalLight(0xffffff, 1.2);
topLight.position.set(10, 30, 10);
scene.add(topLight);

/* ===============================
   Objects
================================ */
const spheres = [];
const sphereMap = new Map();
const lines = [];

const isSP = window.innerWidth < 768;

const sizeX = isSP ? 10 : 14;
const sizeY = isSP ? 4 : 5;
const sizeZ = isSP ? 8 : 12;
const spacing = 4.2;

const sphereGeom = new THREE.SphereGeometry(0.42, 24, 24);

const redMat = new THREE.MeshPhysicalMaterial({
  color: 0xc93a3a,
  roughness: 0.2,
  transmission: 0.5,
  thickness: 1,
  ior: 1.45
});

const blueMat = new THREE.MeshPhysicalMaterial({
  color: 0x3a6bc9,
  roughness: 0.2,
  transmission: 0.5,
  thickness: 1,
  ior: 1.45
});

const lineMat = new THREE.LineBasicMaterial({
  color: 0x99aabb,
  transparent: true,
  opacity: 0.15
});

for (let x = 0; x < sizeX; x++) {
  for (let y = 0; y < sizeY; y++) {
    for (let z = 0; z < sizeZ; z++) {
      const ix = (x - (sizeX - 1) / 2) * spacing;
      const iy = (y - (sizeY - 1) / 2) * spacing;
      const iz = (z - (sizeZ - 1) / 2) * spacing;

      const mat = (x + y + z) % 2 === 0 ? redMat : blueMat;
      const sphere = new THREE.Mesh(sphereGeom, mat);
      sphere.position.set(ix, iy, iz);
      scene.add(sphere);

      const key = `${x}-${y}-${z}`;
      sphereMap.set(key, sphere);

      spheres.push({
        mesh: sphere,
        initialPos: new THREE.Vector3(ix, iy, iz)
      });

      if (x < sizeX - 1) createLine(x, y, z, x + 1, y, z);
      if (y < sizeY - 1) createLine(x, y, z, x, y + 1, z);
      if (z < sizeZ - 1) createLine(x, y, z, x, y, z + 1);
    }
  }
}

function createLine(x1, y1, z1, x2, y2, z2) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(6), 3)
  );
  const line = new THREE.Line(geo, lineMat);
  scene.add(line);

  lines.push({
    mesh: line,
    startKey: `${x1}-${y1}-${z1}`,
    endKey: `${x2}-${y2}-${z2}`
  });
}
/* ===============================
   Animation ON / OFF（完全停止）
================================ */
let isThreeActive = false;
let threeRAF = null;

function animate() {
  if (!isThreeActive) return;

  const time = performance.now() * 0.0002;

  spheres.forEach(s => {
    const p = s.initialPos;
    const dx = noise3D(p.x * 0.08, p.y * 0.08, time) * 0.6;
    const dy = noise3D(p.x * 0.08 + 50, p.z * 0.08, time * 0.7) * 0.3;
    const dz = noise3D(p.y * 0.08, p.z * 0.08 + 100, time) * 0.6;
    s.mesh.position.set(p.x + dx, p.y + dy, p.z + dz);
  });

  lines.forEach(l => {
    const s1 = sphereMap.get(l.startKey);
    const s2 = sphereMap.get(l.endKey);
    const pos = l.mesh.geometry.attributes.position.array;

    pos[0] = s1.position.x;
    pos[1] = s1.position.y;
    pos[2] = s1.position.z;
    pos[3] = s2.position.x;
    pos[4] = s2.position.y;
    pos[5] = s2.position.z;

    l.mesh.geometry.attributes.position.needsUpdate = true;
  });

  scene.rotation.y = time * 0.1;
  renderer.render(scene, camera);

  threeRAF = requestAnimationFrame(animate);
}

function startThree() {
  if (isThreeActive) return;
  isThreeActive = true;
  animate();
}

function stopThree() {
  isThreeActive = false;
  if (threeRAF) {
    cancelAnimationFrame(threeRAF);
    threeRAF = null;
  }
}

/* ===============================
   IntersectionObserver
================================ */
if (container) {
  const threeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.isIntersecting ? startThree() : stopThree();
    });
  }, { threshold: 0.1 });

  threeObserver.observe(container);
}
