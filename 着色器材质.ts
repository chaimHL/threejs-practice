import * as THREE from 'three'

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

// 添加平面
const planeGeometry = new THREE.PlaneGeometry(30, 30)
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xdddddd })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.receiveShadow = true
plane.position.z = -20
scene.add(plane)

// 添加立方体
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
const cubeMaterial = new THREE.ShaderMaterial({
  uniforms: {
    a: {
      value: 1.0
    }
  },
  vertexShader: `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader: `
    uniform float a;
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, a);
    }
  `,
  transparent: true
})
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.castShadow = true
scene.add(cube)

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

initControl([
  {
    name: '光',
    obj: light
  },
  {
    name: '环境光',
    obj: ambientLight
  },
  {
    name: '材质',
    obj: cubeMaterial
  }], camera)



renderer.shadowMap.enabled = true

const animation = () => {
  requestAnimationFrame(animation)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  // 渲染
  renderer.render(scene, camera)

}
animation()
