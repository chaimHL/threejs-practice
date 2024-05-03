import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
// 设置相机位置
camera.position.set(1, 4, 2)
camera.lookAt(0, 0, 0)

// 创建渲染器
const renderer = new THREE.WebGLRenderer()
// 设置渲染器尺寸
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
renderer.outputColorSpace = THREE.SRGBColorSpace

const loader = new GLTFLoader()
loader.load('./assets/models/dog/scene.gltf', (gltf) => {
  // console.log(gltf)
  scene.add(gltf.scene)
  renderer.render(scene, camera)
})

// 添加光源
const light = new THREE.SpotLight(0xffffff, 100);
light.position.set(50, 50, 50);
light.castShadow = true

scene.add(light)

// 添加环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 2)
scene.add(ambientLight)

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
// controls.target.set(2.5, 0, 0)
// controls.update()
controls.addEventListener('change', () => {
  // console.log('相机参数被改变了', camera.position)
  renderer.render(scene, camera)
})

