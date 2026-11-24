// UNOVA 3D Virtual Campus Engine (Three.js)

let scene, camera, renderer, controls;
let avatarGroup, buildingGroup, particleSystem;
let isWalking = false;
let avatarOutfitMesh, avatarHairMesh;

// Initialize 3D Scene & Canvas
function init3D() {
  const canvas = document.getElementById('webgl-canvas');
  
  // 1. Three.js Scene Setup
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050716, 0.015);

  // 2. Camera Setup
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 15, 30);

  // 3. Renderer Setup
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 4. Orbit Controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2.05;

  // 5. Lighting Setup
  const ambientLight = new THREE.AmbientLight(0x1a1c3b, 1.5);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0x00f3ff, 1.2);
  mainLight.position.set(20, 40, 20);
  scene.add(mainLight);

  const purplePointLight = new THREE.PointLight(0x9d4edd, 3, 50);
  purplePointLight.position.set(-15, 10, -10);
  scene.add(purplePointLight);

  // 6. Cyber Grid Ground
  const gridHelper = new THREE.GridHelper(120, 60, 0x00f3ff, 0x1e1b4b);
  gridHelper.position.y = -0.01;
  scene.add(gridHelper);

  const floorGeo = new THREE.PlaneGeometry(150, 150);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x070a1e, roughness: 0.8 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // 7. Render 3D Objects & Avatar
  createBuildings();
  createParticles();
  createAvatar();

  // Resize handler
  window.addEventListener('resize', onWindowResize);

  // Animation Loop
  animate();
}

// Render Procedural 3D University Buildings
function createBuildings() {
  buildingGroup = new THREE.Group();

  // Central Innovation Hub
  const hubGeo = new THREE.CylinderGeometry(8, 12, 16, 8);
  const hubMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7, roughness: 0.2 });
  const hub = new THREE.Mesh(hubGeo, hubMat);
  hub.position.set(0, 8, -20);
  buildingGroup.add(hub);

  // Glowing Ring on Central Hub
  const ringGeo = new THREE.TorusGeometry(8.5, 0.4, 16, 100);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.set(0, 16, -20);
  buildingGroup.add(ring);

  // Research Library (Left Building)
  const libGeo = new THREE.BoxGeometry(14, 10, 20);
  const libMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, metalness: 0.5 });
  const lib = new THREE.Mesh(libGeo, libMat);
  lib.position.set(-25, 5, -15);
  buildingGroup.add(lib);

  // 3D Dome Meeting Center (Right Building)
  const domeGeo = new THREE.SphereGeometry(7, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const domeMat = new THREE.MeshStandardMaterial({ color: 0x3b0764, transparent: true, opacity: 0.85 });
  const dome = new THREE.Mesh(domeGeo, domeMat);
  dome.position.set(25, 0, -15);
  buildingGroup.add(dome);

  // 3D Meeting Table Inside Dome
  const tableGeo = new THREE.CylinderGeometry(4, 4, 1, 16);
  const tableMat = new THREE.MeshStandardMaterial({ color: 0x00f3ff, roughness: 0.1 });
  const table = new THREE.Mesh(tableGeo, tableMat);
  table.position.set(25, 0.5, -15);
  buildingGroup.add(table);

  scene.add(buildingGroup);
}

// Floating Particle System
function createParticles() {
  const particleCount = 400;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 100;
    positions[i + 1] = Math.random() * 30 + 1;
    positions[i + 2] = (Math.random() - 0.5) * 100;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0x00f3ff, size: 0.4, transparent: true, opacity: 0.7 });
  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
}

// Render Customizable 3D Avatar
function createAvatar() {
  avatarGroup = new THREE.Group();

  // Outfit Mesh
  const bodyGeo = new THREE.CylinderGeometry(0.6, 0.8, 2.2, 12);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x00f3ff, roughness: 0.3 });
  avatarOutfitMesh = new THREE.Mesh(bodyGeo, bodyMat);
  avatarOutfitMesh.position.y = 1.1;
  avatarGroup.add(avatarOutfitMesh);

  // Head Mesh
  const headGeo = new THREE.SphereGeometry(0.55, 16, 16);
  const headMat = new THREE.MeshStandardMaterial({ color: 0xffdbac });
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.y = 2.5;
  avatarGroup.add(head);

  // Hairstyle Mesh
  const hairGeo = new THREE.ConeGeometry(0.65, 0.6, 12);
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x9d4edd });
  avatarHairMesh = new THREE.Mesh(hairGeo, hairMat);
  avatarHairMesh.position.y = 3.0;
  avatarGroup.add(hairMesh = avatarHairMesh);

  avatarGroup.position.set(0, 0, 5);
  scene.add(avatarGroup);
}

// Animation Loop
let clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();

  // Particles rotation
  if (particleSystem) particleSystem.rotation.y = elapsedTime * 0.03;

  // Avatar Walking / Idle movement
  if (avatarGroup) {
    if (isWalking) {
      avatarGroup.position.z -= 0.05;
      avatarGroup.position.y = Math.sin(elapsedTime * 10) * 0.1;
      if (avatarGroup.position.z < -10) avatarGroup.position.z = 10;
    } else {
      avatarGroup.position.y = Math.sin(elapsedTime * 2) * 0.05;
    }
  }

  controls.update();
  renderer.render(scene, camera);
}

// Handle Window Resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// UI Navigation and Camera Transitions
function switchView(viewId) {
  document.querySelectorAll('.overlay-view').forEach(view => view.classList.remove('active'));
  const targetView = document.getElementById(`view-${viewId}`);
  if (targetView) targetView.classList.add('active');

  // Smooth Camera Positions
  if (viewId === 'home') setCameraPos(0, 15, 30, 0, 0, 0);
  else if (viewId === 'campus') setCameraPos(0, 25, 40, 0, 0, 0);
  else if (viewId === 'avatar') setCameraPos(0, 3, 10, 0, 2, 5);
  else if (viewId === 'meeting') setCameraPos(25, 8, -5, 25, 0, -15);
  else if (viewId === 'research') setCameraPos(-25, 12, 5, -25, 5, -15);
}

function teleportCamera(loc) {
  if (loc === 'plaza') setCameraPos(0, 15, 25, 0, 0, 0);
  if (loc === 'tech') setCameraPos(0, 12, -5, 0, 8, -20);
  if (loc === 'library') setCameraPos(-25, 10, 5, -25, 5, -15);
  if (loc === 'meeting') setCameraPos(25, 8, -5, 25, 0, -15);
}

function setCameraPos(px, py, pz, tx, ty, tz) {
  camera.position.set(px, py, pz);
  controls.target.set(tx, ty, tz);
}

// Avatar Customizer Functions
function updateAvatarProfile() {
  const name = document.getElementById('avatar-name').value || 'Student';
  const uni = document.getElementById('avatar-uni').value;
  document.getElementById('nav-user-name').innerText = `${name} (${uni})`;
}

function updateAvatarAppearance() {
  const outfitColor = document.getElementById('avatar-color').value;
  const hairColor = document.getElementById('hair-color').value;

  if (avatarOutfitMesh) avatarOutfitMesh.material.color.set(outfitColor);
  if (avatarHairMesh) avatarHairMesh.material.color.set(hairColor);
}

function toggleAvatarAnim() {
  isWalking = !isWalking;
}

// Interactive Features
function sendMessage() {
  const input = document.getElementById('chat-input');
  const chatBox = document.getElementById('chat-box');
  if (input.value.trim() !== '') {
    const user = document.getElementById('nav-user-name').innerText;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg';
    msgDiv.innerHTML = `<strong>${user}:</strong> ${input.value}`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    input.value = '';
  }
}

function saveNotes() {
  alert('Whiteboard notes saved to UNOVA workspace!');
}

function triggerPresentation() {
  alert('Screen share mode active on 3D room board!');
}

function openChat() {
  switchView('meeting');
}

// Initialize on load
window.onload = init3D;
