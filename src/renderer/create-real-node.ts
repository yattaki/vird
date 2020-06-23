import { VirdNode } from '../vird-node/vird-node'
import { virdNodeTypes } from '../vird-node/vird-node-types'

export function createRealNode(virdNode: VirdNode) {
  switch (virdNode.type) {
    case virdNodeTypes.text:
      return document.createTextNode(virdNode.properties.textContent || '')
    case virdNodeTypes.comment:
      return document.createComment(virdNode.properties.textContent || '')
    default:
      return document.createElement(virdNode.type)
  }
}
