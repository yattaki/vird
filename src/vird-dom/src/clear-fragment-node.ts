import { VirdNode } from '../../vird/index'
import { virdNodeTypes } from '../../vird/src/vird-node-types'

export function clearFragmentNode (virdNodes: VirdNode[]) {
  const result: VirdNode[] = []

  const pushVirdNodes: VirdNode[] = []
  for (const virdNode of virdNodes) {
    if (virdNode.type === virdNodeTypes.fragment) {
      const children = clearFragmentNode(virdNode.children)
      result.push(...children)
      pushVirdNodes.push(...children)
    } else {
      result.push(virdNode)
      pushVirdNodes.push(virdNode)
    }
  }

  return result
}
