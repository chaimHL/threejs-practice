import * as THREE from 'three'

const width = window.innerWidth
const height = window.innerHeight
// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  width / height,
  0.1,
  1000
)

// 创建渲染器
const renderer = new THREE.WebGLRenderer()
// 设置渲染器尺寸
renderer.setSize(width, height)
document.body.appendChild(renderer.domElement)

// 创建一个立方体和一个球体
const boxGeometry = new THREE.BoxGeometry(3, 3, 3)
const sphereGeometry = new THREE.SphereGeometry(2, 20, 20)
const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 })
const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 })
const cube = new THREE.Mesh(boxGeometry, boxMaterial)
const sphere = new THREE.Mesh(sphereGeometry, cubeMaterial)

cube.rotation.set(0.3, 0.5, 0)
cube.position.x = 4
sphere.position.x = -4

scene.add(cube)
scene.add(sphere)

// 添加光源
const light = new THREE.SpotLight(0xffffff, 2500);
light.position.set(10, 10, 10);
scene.add(light)
// 环境光
const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(ambientLight)

// 设置相机位置
camera.position.set(0, 0, 10)

renderer.render(scene, camera)

addEventListener('click', event => {
  // 转换坐标
  const offsetX = event.offsetX
  const offsetY = event.offsetY

  const x = (offsetX / width) * 2 - 1
  const y = -(offsetY / height) * 2 + 1

  // 生成射线
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera)

  // 检测
  const intersects: any = raycaster.intersectObjects([cube, sphere])
  if (intersects.length > 0) {
    intersects[0].object.material.color.set(0xFB3F63)
  }
})

const render = () => {
  requestAnimationFrame(render)
  // 渲染
  renderer.render(scene, camera)

}
render()
