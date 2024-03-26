import * as THREE from 'three'


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
// 单个赋值
camera.position.z = 10
// 或者通过 set 方法赋值
// camera.position.set(0, 0, 10)

// 创建渲染器
const renderer = new THREE.WebGLRenderer()

// 设置渲染器尺寸
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 添加立方体
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 })
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.name = 'myCube'
scene.add(cube)

// 添加聚光灯
const spotLight = new THREE.SpotLight()
spotLight.position.set(10, 10, 30)
spotLight.intensity = 1000
scene.add(spotLight)

// 添加平面
const planeGeometry = new THREE.PlaneGeometry(30, 30)
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xefefef })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.position.z = -20
scene.add(plane)

// 开启阴影效果
spotLight.castShadow = true
cube.castShadow = true
plane.receiveShadow = true
renderer.shadowMap.enabled = true

const animation = () => {
  requestAnimationFrame(animation)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  // console.log(cube.matrix.elements)
  // 渲染
  renderer.render(scene, camera)

}
animation()


