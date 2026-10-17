/* 3D 穴位图谱：文字定位为准；模型标记按体表投影，仅供辨认区域。 */
import * as THREE from './vendor/three/three.module.js';
import { OrbitControls } from './vendor/three/addons/controls/OrbitControls.js';
import { GLTFLoader } from './vendor/three/addons/loaders/GLTFLoader.js';

const MODEL_URL = new URL('./models/human.glb', import.meta.url).href;
const HEIGHT = 1.7;
const MERIDIAN_COLORS = [0xe79a72,0xe9bd63,0x85c6a6,0x72b3c3,0xaaa0d4,0xd693ad,0xb8c36f,0xe5a66f,0x6dbbaa,0x82a9d6,0xc59b79,0x9fc09a,0xd58c84,0xb4a4ca,0xc2b377];

let app = null; // {renderer,scene,camera,controls,box,markers,canvas}

function makeLabel(text) {
  const size = 256;
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const g = cv.getContext('2d');
  g.font = 'bold 40px "PingFang SC","Noto Sans SC","Microsoft YaHei",sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const w = g.measureText(text).width;
  g.fillStyle = 'rgba(16,24,21,0.86)';
  g.beginPath(); g.roundRect(size/2-w/2-14, size/2-26, w+28, 52, 10); g.fill();
  g.strokeStyle = 'rgba(112,210,168,0.7)'; g.lineWidth = 3; g.stroke();
  g.fillStyle = '#eafaf2';
  g.fillText(text, size/2, size/2 + 2);
  const tex = new THREE.CanvasTexture(cv);
  tex.anisotropy = 4;
  const mat = new THREE.SpriteMaterial({map:tex, depthTest:false, transparent:true});
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(0.11, 0.11, 1);
  return sprite;
}

function worldFromRel(rel) {
  const b = app.box;
  let x = rel[0], y = rel[1];
  // 模型为双臂外展姿态，原始表格按双臂下垂估算。把远端手臂坐标
  // 转换到外展姿态，并把小腿点落在胫骨区域，避免悬空/落到躯干。
  if (app.placingPoint?.part === '上肢') {
    const distal = THREE.MathUtils.clamp((0.78 - y) / 0.44, 0, 1);
    x = 0.63 + distal * 0.34;
    y = 0.77 - distal * 0.26;
  } else if (app.placingPoint?.part === '下肢') {
    const meridian = app.placingPoint.meridian;
    x = /足阳明胃经|足少阳胆经/.test(meridian) ? 0.66
      : /足太阴脾经|足少阴肾经|足厥阴肝经/.test(meridian) ? 0.59 : 0.62;
    x += (rel[0] - 0.55) * 0.12;
  }
  return new THREE.Vector3(b.min.x + x*b.size.x, b.min.y + y*b.size.y, b.min.z + rel[2]*b.size.z);
}

function surfacePosition(point, side = 1) {
  app.placingPoint = point;
  const rough = worldFromRel(point.pos);
  app.placingPoint = null;
  if (side < 0) rough.x = -rough.x;
  const crown = point.name === '百会';
  const back = point.pos[2] < 0.49 || /背部|后正中|第\d+胸椎|第\d+腰椎/.test(point.location);
  const lateral = /胆经|三焦经/.test(point.meridian) && point.pos[2] < 0.55;
  const from = crown ? new THREE.Vector3(rough.x, app.box.min.y + app.box.size.y + 0.4, rough.z)
    : lateral ? new THREE.Vector3(app.box.min.x + app.box.size.x + 0.4, rough.y, rough.z)
    : new THREE.Vector3(rough.x, rough.y, back ? app.box.min.z - 0.5 : app.box.min.z + app.box.size.z + 0.5);
  const toward = crown ? new THREE.Vector3(0, -1, 0) : lateral ? new THREE.Vector3(-1, 0, 0) : new THREE.Vector3(0, 0, back ? 1 : -1);
  const ray = new THREE.Raycaster(from, toward, 0, 3);
  let hit = ray.intersectObject(app.model, true)[0];
  if (!hit && lateral) {
    ray.set(new THREE.Vector3(rough.x, rough.y, app.box.min.z + app.box.size.z + 0.5), new THREE.Vector3(0, 0, -1));
    hit = ray.intersectObject(app.model, true)[0];
  }
  if (!hit) return null;
  return hit.point.clone().add(hit.face?.normal?.clone().transformDirection(hit.object.matrixWorld).multiplyScalar(0.009) || new THREE.Vector3(0, 0, back ? -0.009 : 0.009));
}

function highlight(name) {
  if (!app) return;
  app.activeName = name;
  app.markers.forEach(m => {
    const active = m.name === name;
    m.mesh.scale.setScalar(active ? 1.9 : 1);
    m.mesh.material.color.set(active ? 0x3ad79c : m.color);
    m.mesh.material.emissive.set(active ? 0x1fbf8a : m.color);
    m.label.visible = active;
  });
}
function select(name) {
  highlight(name);
  const marker = app?.markers.find(m => m.name === name);
  if (marker) {
    const target = marker.mesh.position;
    const back = marker.point.pos[2] < 0.49;
    const lateral = /胆经|三焦经/.test(marker.meridian) && marker.point.pos[2] < 0.55;
    app.controls.target.copy(target);
    app.camera.position.copy(target).add(new THREE.Vector3(lateral ? 0.82 : 0.18, 0.12, lateral ? 0.20 : back ? -0.82 : 0.82));
    app.controls.update();
  }
  if (window.ATLAS3D_ON_SELECT) window.ATLAS3D_ON_SELECT(name);
}
function setView(view) {
  if (!app) return;
  const offsets = {front:[0,0,2.75],back:[0,0,-2.75],side:[2.75,0,0]};
  app.controls.target.set(0, 0.85, 0);
  app.camera.position.set(...(offsets[view] || offsets.front)).add(app.controls.target);
  app.controls.update();
}
function setFilter(visibleNames, activeName) {
  if (!app) return;
  const v = new Set(visibleNames || []);
  app.markers.forEach(m => {
    const vis = v.has(m.name);
    m.mesh.visible = vis;
    if (!vis) m.label.visible = false;
  });
  if (activeName) highlight(activeName);
}

async function mount(canvas, data) {
  dispose();
  if (!canvas || !data || !data.points || !data.points.length) return;
  app = { canvas, markers: [], activeName: null };
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1c2120);
  const w = Math.max(1, canvas.clientWidth || 400);
  const h = Math.max(1, canvas.clientHeight || 520);
  const camera = new THREE.PerspectiveCamera(40, w/h, 0.05, 100);
  camera.position.set(0, 0.85, 2.75);
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, preserveDrawingBuffer:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(w, h);
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0.85, 0);
  controls.minDistance = 0.5;
  controls.maxDistance = 3.4;
  controls.enableDamping = true;
  controls.dampingFactor = 0.12;
  scene.add(new THREE.HemisphereLight(0xd7e6df, 0x232b28, 1.35));
  const dl = new THREE.DirectionalLight(0xfff4e6, 2.0);
  dl.position.set(1.5, 2.6, 1.6);
  scene.add(dl);
  const dl2 = new THREE.DirectionalLight(0xcfe9e0, 1.1);
  dl2.position.set(-1.4, 0.6, -1.2);
  scene.add(dl2);
  const dl3 = new THREE.DirectionalLight(0xbfe0ff, 0.5);
  dl3.position.set(0, 1.0, -1.8);
  scene.add(dl3);

  app.scene = scene; app.camera = camera; app.renderer = renderer; app.controls = controls;

  await new Promise(res => {
    new GLTFLoader().load(MODEL_URL, g => {
      const m = g.scene;
      scene.add(m);
      const b0 = new THREE.Box3().setFromObject(m);
      const y0 = b0.max.y - b0.min.y;
      m.scale.setScalar(HEIGHT / (y0 || 1));
      let box = new THREE.Box3().setFromObject(m);
      const c = new THREE.Vector3(); box.getCenter(c);
      m.position.x -= c.x; m.position.y -= (c.y - 0.85); m.position.z -= c.z;
      m.updateMatrixWorld(true);
      box = new THREE.Box3().setFromObject(m);
      const size = new THREE.Vector3(); box.getSize(size);
      app.box = { min: box.min.clone(), size };
      app.model = m;
      res();
    }, undefined, e => { console.error('模型加载失败', e); app.modelError = e; res(); });
  });
  if (!app.box) {
    canvas.insertAdjacentHTML('afterend', '<div class="atlas3d-fallback">人体模型加载失败；请检查模型资源或刷新页面。穴位目录与标准定位登记仍可使用。</div>');
    return;
  }

  // 穴位标记球 + 标签
  const geo = new THREE.SphereGeometry(0.009, 16, 16);
  const meridians = [...new Set(data.points.map(p => p.meridian))];
  app.unmapped = [];
  data.points.forEach(p => {
    if (p.name === '四神聪') { app.unmapped.push(p.name); return; }
    const pos = surfacePosition(p);
    if (!pos) { app.unmapped.push(p.name); return; }
    const color = MERIDIAN_COLORS[meridians.indexOf(p.meridian) % MERIDIAN_COLORS.length];
    const mat = new THREE.MeshStandardMaterial({color, emissive:color, emissiveIntensity:0.35, roughness:0.4});
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    mesh.userData.name = p.name;
    scene.add(mesh);
    const label = makeLabel(p.name);
    label.visible = false;
    label.position.copy(pos); label.position.y += 0.045;
    scene.add(label);
    app.markers.push({name:p.name, meridian:p.meridian, point:p, color, mesh, label});
  });

  // 仅凭离散穴位不能还原经脉循行路线，不绘制误导性的自动连线。

  // 交互：hover 高亮 + 点击选中
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(-2, -2);
  const rect = () => canvas.getBoundingClientRect();
  canvas.addEventListener('pointermove', e => {
    const r = rect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(app.markers.map(m => m.mesh));
    const hov = hits.length ? hits[0].object.userData.name : null;
    app.markers.forEach(m => { if (m.name !== app.activeName) m.label.visible = (m.name === hov); });
    canvas.style.cursor = hits.length ? 'pointer' : 'grab';
  }, {passive:true});
  canvas.addEventListener('pointerdown', e => {
    const r = rect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  });
  canvas.addEventListener('pointerup', e => {
    const r = rect();
    const x = ((e.clientX - r.left) / r.width) * 2 - 1;
    const y = -((e.clientY - r.top) / r.height) * 2 + 1;
    if (Math.abs(x - pointer.x) < 0.04 && Math.abs(y - pointer.y) < 0.04) {
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      const hits = raycaster.intersectObjects(app.markers.map(m => m.mesh));
      if (hits.length) select(hits[0].object.userData.name);
    }
  });

  renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera); });

  // 默认选中第一个穴位
  if (data.points.length) highlight(data.points[0].name);
}

function dispose() {
  if (app) {
    app.renderer.setAnimationLoop(null);
    app.scene.traverse(o => {
      if (o.isMesh) { o.geometry?.dispose?.(); o.material?.dispose?.(); }
      if (o.isLine) { o.geometry?.dispose?.(); o.material?.dispose?.(); }
    });
    app.renderer.dispose();
    if (app.canvas && app.canvas.parentNode) app.canvas.parentNode.removeChild(app.canvas);
    app = null;
  }
}

async function tryInit() {
  const cv = document.getElementById('atlas3dCanvas');
  if (cv && window.ATLAS3D_DATA && window.ATLAS3D_DATA.points) {
    try { await mount(cv, window.ATLAS3D_DATA); }
    catch (e) { console.error('3D图谱初始化失败', e); }
  }
}
window.addEventListener('atlas:ready', async e => {
  const detail = e.detail || {};
  try { await mount(detail.canvas, detail.data); }
  catch (err) { console.error('3D图谱渲染失败', err); }
});
window.__atlas3d = {
  highlight: select,
  setView,
  setFilter,
  dispose,
  diagnostics: () => app ? {mapped:app.markers.length,unmapped:app.unmapped.slice()} : null
};
tryInit();
