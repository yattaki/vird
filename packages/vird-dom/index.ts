import { createNode } from './src/create-node'
import {
  Renderer,
  PropertyTypeBinder,
  PropertyTypeRegExpBinder,
  PropertyValueMap,
  CustomNodeCreator
} from './src/renderer'

const renderer = new Renderer()

export {
  Renderer,
  PropertyTypeRegExpBinder,
  PropertyTypeBinder,
  PropertyValueMap,
  CustomNodeCreator,
  renderer,
  createNode
}
