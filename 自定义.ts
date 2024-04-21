import * as THREE from 'three'
import * as SceneUtils from 'three/examples/jsm/utils/SceneUtils.js'

import { initControl } from './utils/control'


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


const shape = new THREE.Shape()
shape.moveTo(0, 0)
shape.lineTo(0, 3)
shape.lineTo(3, 3)
shape.lineTo(3, 0)
shape.lineTo(0, 0)
const geometry = new THREE.ShapeGeometry(shape)
const lambert = new THREE.MeshLambertMaterial({ color: 0xff0000 })
const basic = new THREE.MeshBasicMaterial({ wireframe: true })
const mesh = {
  pointer: SceneUtils.createMultiMaterialObject(geometry, [lambert, basic])
}
mesh.pointer.castShadow = true
scene.add(mesh.pointer)

// 添加光源
const light = new THREE.SpotLight(0xffffff, 100);
light.position.set(50, 50, 50);
light.castShadow = true

scene.add(light)

// 添加环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 2)
scene.add(ambientLight)

// 设置相机位置
camera.position.set(0, 0, 10)

renderer.shadowMap.enabled = true

const animation = () => {
  requestAnimationFrame(animation)
  // mesh.pointer.rotation.x += 0.01
  // mesh.pointer.rotation.y += 0.01
  // 渲染
  renderer.render(scene, camera)

}
animation()
