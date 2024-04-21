import * as dat from 'dat.gui'
import * as THREE from 'three'
import * as SceneUtils from 'three/examples/jsm/utils/SceneUtils.js'
import type { IControl, SideType, IMesh } from '../types'
import type { Camera } from 'three'
import { func } from 'three/examples/jsm/nodes/Nodes.js'


const propOptions = {
  color: {
    method: 'addColor',
    getValue: target => target.color.getStyle(),
    setValue: (target, value) => target.color.setStyle(value)
  },
  intensity: {
    rest: [0, 1000],
    getValue: target => target.intensity,
    setValue: (target, value) => target.intensity = value
  },
  size: {
    rest: [1, 20],
    getValue: target => target.parameters.options.size,
    setValue: (target, value) => target.parameters.options.size = value
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
  },
  opacity: {
    rest: [0, 1],
    getValue: target => target.opacity,
    setValue: (target, value) => target.opacity = value
  },
  alphaTest: {
    rest: [0, 1],
    getValue: target => target.alphaTest,
    setValue: (target, value) => target.alphaTest = value
  },
  wireframe: {
    getValue: target => target.wireframe,
    setValue: (target, value) => target.wireframe = value
  },
  transparent: {
    getValue: target => target.transparent,
    setValue: (target, value) => target.transparent = value
  },
  visible: {
    getValue: target => target.visible,
    setValue: (target, value) => target.visible = value
  },
  cameraNear: {
    rest: [0, 50],
    getValue: (target, camera) => camera.near,
    setValue: (target, value, camera) => {
      camera.near = value
      camera.updateProjectionMatrix() // 更新摄像机投影矩阵。在任何参数被改变以后必须被调用。
    }
  },
  cameraFar: {
    rest: [50, 1000],
    getValue: (target, camera) => camera.far,
    setValue: (target, value, camera) => {
      camera.far = value
      camera.updateProjectionMatrix()
    }
  },
  side: {
    rest: [['front', 'back', 'double']],
    getValue: target => 'front',
    setValue: (target, value: SideType) => {
      switch (value) {
        case 'front':
          target.side = THREE.FrontSide
          break
        case 'back':
          target.side = THREE.BackSide
          break
        case 'double':
          target.side = THREE.DoubleSide
          break
      }
    }
  },
  emissive: {
    method: 'addColor',
    getValue: (target) => target.emissive.getHex(),
    setValue: (target, value) => target.emissive = new THREE.Color(value)
  },
  specular: {
    method: 'addColor',
    getValue: (target) => target.specular.getHex(),
    setValue: (target, value) => target.specular = new THREE.Color(value)
  },
  shininess: {
    rest: [0, 100],
    getValue: (target) => target.shininess,
    setValue: (target, value) => target.shininess = value
  },
  alpha: {
    rest: [0, 1],
    getValue: (target) => target.uniforms.a.value,
    setValue: (target, value) => target.uniforms.a.value = value
  },
  width: getMeshValue([0, 20], 'width'),
  height: getMeshValue([0, 20], 'height'),
  widthSegments: getMeshValue([0, 20], 'widthSegments'),
  heightSegments: getMeshValue([0, 20], 'heightSegments'),
  radius: getMeshValue([1, 10], 'radius'),
  segments: getMeshValue([3, 50], 'segments'),
  thetaStart: getMeshValue([0, Math.PI * 2], 'thetaStart'),
  thetaLength: getMeshValue([0, Math.PI * 2], 'thetaLength'),
  depth: getMeshValue([0, 20], 'depth'),
  depthSegments: getMeshValue([0, 20], 'depthSegments'),
  phiStart: getMeshValue([0, Math.PI * 2], 'phiStart'),
  phiLength: getMeshValue([0, Math.PI * 2], 'phiLength'),
  radiusTop: getMeshValue([-20, 20], 'radiusTop'),
  radiusBottom: getMeshValue([-20, 20], 'radiusBottom'),
  radialSegments: getMeshValue([1, 60], 'radialSegments'),
  openEnded: getMeshValue([], 'openEnded'),
  detail: getMeshValue([0, 5], 'detail'),
}

const threeObj = {
  SpotLight: ['color', 'intensity', 'distance', 'angle', 'penumbra', 'decay'],
  AmbientLight: ['color'],
  PointLight: ['color', 'intensity', 'distance', 'decay'],
  DirectionalLight: ['color', 'intensity'],
  MeshBasicMaterial: ['color', 'opacity', 'transparent', 'alphaTest', 'wireframe', 'visible'],
  MeshDepthMaterial: ['wireframe', 'cameraNear', 'cameraFar'],
  MeshNormalMaterial: ['wireframe', 'side'],
  MeshLambertMaterial: ['wireframe', 'side', 'emissive'],
  MeshPhongMaterial: ['color', 'wireframe', 'specular', 'shininess'],
  ShaderMaterial: ['alpha'],
  PlaneGeometry: ['width', 'height', 'widthSegments', 'heightSegments'],
  CircleGeometry: ['radius', 'segments', 'thetaStart', 'thetaLength'],
  BoxGeometry: ['width', 'height', 'depth', 'widthSegments', 'heightSegments', 'depthSegments'],
  SphereGeometry: ['radius', 'widthSegments', 'heightSegments', 'phiStart', 'phiLength', 'thetaStart', 'thetaLength'],
  CylinderGeometry: ['radiusTop', 'radiusBottom', 'height', 'radialSegments', 'heightSegments', 'openEnded'],
  PolyhedronGeometry: ['radius', 'detail'],
  TextGeometry: ['size']
}

// 顶点坐标（创建多面体使用）
export const vertices = [
  1, 1, 1,
  -1, -1, 1,
  -1, 1, -1,
  1, -1, -1
]
// 索引
export const indices = [
  2, 1, 0,
  0, 3, 2,
  1, 3, 0,
  2, 3, 1
]

const roundValues = ['detail']

function isPolyhedron(target) {
  return target.type === 'PolyhedronGeometry'
}

function createMaterial(geometry) {
  const lambert = new THREE.MeshLambertMaterial({ color: 0xff0000 })
  const basic = new THREE.MeshBasicMaterial({ wireframe: true })
  return SceneUtils.createMultiMaterialObject(geometry, [lambert, basic])
}

function removeAndAdd(target, value, camera?: Camera, mesh?: IMesh, scene?: THREE.Scene, controlData?) {
  if (mesh) {
    const { x, y, z } = mesh.pointer.rotation
    if (scene) {

      // 先删除
      scene.remove(mesh.pointer)
      // 再创建
      const args: any[] = []
      for (const key in controlData) {
        if (roundValues.includes(key)) {
          controlData[key] = ~~controlData[key]
        }
        args.push(controlData[key])
      }

      // 如果是多面体
      if (isPolyhedron(target)) {
        args.unshift(vertices, indices)
      }
      mesh.pointer = createMaterial(new THREE[target.type](...args))
      mesh.pointer.rotation.set(x, y, z)
      scene.add(mesh.pointer)
    }
  }

}

function getMeshValue(rest, name) {
  return {
    rest,
    getValue: (target, camera, mesh) => mesh.children[0].geometry.parameters[name],
    setValue: (target, value, camera?: Camera, mesh?: IMesh, scene?: THREE.Scene, controlData?) => removeAndAdd(target, value, camera, mesh, scene, controlData)
  }
}

export function initControl(controls: IControl[], camera?: Camera, mesh?: IMesh, scene?: THREE.Scene) {
  const controlData = {}
  if (!controls?.length) {
    return
  }
  const gui = new dat.GUI()
  controls.forEach(item => {
    const target = item.obj
    const typeList = threeObj[target.type]
    if (!typeList?.length) {
      return
    }

    const folder = gui.addFolder(item.name)
    typeList.forEach((child, i) => {
      const prop = propOptions[child]
      if (prop) {
        controlData[typeList[i]] = prop.getValue(target, camera, mesh?.pointer)
        const rest = prop.rest || []
        folder[prop.method || 'add'](controlData, child, ...rest).onChange((value) => {
          prop.setValue(target, value, camera, mesh, scene, controlData)
        })
      }
    })
    folder.open()
  })
}
