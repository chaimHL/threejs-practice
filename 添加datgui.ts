import * as THREE from 'three'
import * as dat from 'dat.gui'


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
const cubeMaterial = new THREE.MeshPhongMaterial()
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.name = 'myCube'
scene.add(cube)


// 添加聚光灯
const spotLight = new THREE.SpotLight(0x24A7EA, 3000)
spotLight.position.set(10, 10, 30)
scene.add(spotLight)

const animation = () => {
  requestAnimationFrame(animation)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  // 渲染
  renderer.render(scene, camera)

}
animation()

// 以下为 dat.gui 相关代码
const threeObj = {
  SpotLight: ['color', 'intensity', 'distance', 'angle', 'penumbra', 'decay'],
}

// 各个属性的取赋值信息
const propsGetSet = {
  color: {
    method: 'addColor',
    getValue: target => target.color.getStyle(),
    setValue: (target, value) => target.color.setStyle(value)
  },
  intensity: {
    rest: [0, 3000],
    getValue: target => target.intensity,
    setValue: (target, value) => target.intensity = value
  },
  distance: {
    rest: [0, 2],
    getValue: target => target.distance,
    setValue: (target, value) => target.distance = value
  },
  angle: {
    rest: [0, Math.PI / 2],
    getValue: target => target.angle,
    setValue: (target, value) => target.angle = value
  },
  penumbra: {
    rest: [0, 1],
    getValue: target => target.penumbra,
    setValue: (target, value) => target.penumbra = value
  },
  decay: {
    rest: [0, 4],
    getValue: target => target.decay,
    setValue: (target, value) => target.decay = value
  }
}

interface IControl {
  name: string
  target: any
}
// 初始化 dat.gui
function initDatGui(controls: IControl[]) {
  if (!controls?.length) {
    return
  }
  const controlData = {}
  const gui = new dat.GUI()
  controls.forEach(item => {
    const target = item.target
    const props = threeObj[target.type]
    if (!props?.length) {
      return
    }
    const folder = gui.addFolder(item.name)
    props.forEach((prop, i) => {
      const propObj = propsGetSet[prop]
      if (propObj) {
        // 设置 dat.gui 控件各个属性的默认值
        controlData[props[i]] = propObj.getValue(target)
        const rest = propObj.rest || []
        // 当调整 dat.gui 控件时
        folder[propObj.method || 'add'](controlData, prop, ...rest).onChange(value => {
          propObj.setValue(target, value)
        })
      }
    })
    folder.open()
  })
}

initDatGui([
  {
    name: '聚光灯',
    target: spotLight
  }
])

