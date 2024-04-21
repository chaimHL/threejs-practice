import * as THREE from 'three'

export interface IControl {
  name: string
  obj: any
}

export enum SideType {
  Front = 'front',
  Back = 'back',
  Double = 'double',
}

export interface IMesh {
  pointer: THREE.Group<THREE.Object3DEventMap>;
}
