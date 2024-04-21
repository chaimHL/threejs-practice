import * as THREE from 'three'
import * as SceneUtils from 'three/examples/jsm/utils/SceneUtils.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'

import { initControl, vertices, indices } from './utils/control'


// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

// 创建渲染器
const renderer = new THREE.WebGLRenderer()
// 设置渲染器尺寸
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

let fontOptions
const fontLoader = new FontLoader()
function loadFont() {
  return new Promise((resolve, reject) => {
    fontLoader.load('node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      fontOptions = {
        font: font,
        size: 2,
        depth: 10,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 5,
        bevelOffset: 0
      }
      resolve('')
    })
  })
}
await loadFont()

const geometry = new TextGeometry('THR', fontOptions)
const material = new THREE.MeshLambertMaterial({ color: 0x666666 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)


// 添加光源
const light = new THREE.SpotLight(0xffffff, 100);
light.position.set(30, 30, 30);
light.castShadow = false

scene.add(light)

// 添加环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 2)
scene.add(ambientLight)

// 设置相机位置
camera.position.set(0, 0, 10)

initControl(
  [
    {
      name: '立方体',
      obj: geometry
    }
  ],
  camera,
)

renderer.shadowMap.enabled = true

const animation = () => {
  requestAnimationFrame(animation)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  // 渲染
  renderer.render(scene, camera)

}
animation()
