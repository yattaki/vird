import { VirdNode } from '../../vird/index'
import { virdNodeTypes } from '../../vird/src/vird-node-types'
import { VirdElement } from '../../vird/src/vird-element'

export function clearFragmentNode (virdNodes: (VirdNode | VirdElement)[]) {
  const result: (VirdNode | VirdElement)[] = []

  for (const virdNode of virdNodes) {
    if (virdNode.type === virdNodeTypes.fragment) {
      const children = clearFragmentNode(virdNode.children)
      result.push(...children)
    } else {
      result.push(virdNode)
    }
  }

  return result
}
