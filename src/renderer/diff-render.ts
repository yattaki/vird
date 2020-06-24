import { createNode } from '../create-node/create-node'
import { VirdNode } from '../vird-node/vird-node'
import { clearVirdEvent, offEvent, onEvent } from '../vird/vird-event'
import { createRealNode } from './create-real-node'
import { diff } from './diff'
import { updateAttribute } from './update-attributes'
import { nodeMap, virdDom } from './vird-dom'

function removeVirdDom(node: Node) {
  virdDom.delete(node)
  for (const childNode of node.childNodes) {
    removeVirdDom(childNode)
  }
}

export function diffRender(rootNode: Node, newVirdNodes: VirdNode[]) {
  const oldVirdNodes =
    virdDom.get(rootNode) ||
    [...rootNode.childNodes].map(child => createNode(child))

  let index = 0
  let newVirdNodeIndex = 0
  let oldVirdNodeIndex = 0
  const newVirdNodeLength = newVirdNodes.length
  const oldVirdNodeLength = oldVirdNodes.length
  const maxIndex = Math.max(newVirdNodeLength, oldVirdNodeLength)

  while (index < maxIndex) {
    const newVirdNode = newVirdNodes[newVirdNodeIndex] as VirdNode | undefined
    const oldVirdNode = oldVirdNodes[oldVirdNodeIndex] as VirdNode | undefined
    const oldNode = oldVirdNode && nodeMap.get(oldVirdNode)

    if (newVirdNode) {
      if (!oldVirdNode || oldVirdNode.type !== newVirdNode.type) {
        const realNode = createRealNode(newVirdNode)

        if (oldNode) {
          removeVirdDom(oldNode)
          const parent = oldNode.parentElement
          if (parent === rootNode) {
            if (newVirdNodeLength > oldVirdNodeLength) {
              parent.insertBefore(realNode, oldNode)
              oldVirdNodeIndex--
            } else if (newVirdNodeLength < oldVirdNodeLength) {
              parent.removeChild(oldNode)
              newVirdNodeIndex--
            } else {
              parent.replaceChild(realNode, oldNode)
            }
          }
        } else {
          rootNode.appendChild(realNode)
        }
      } else if (oldNode) {
        nodeMap.delete(oldVirdNode)
        nodeMap.set(newVirdNode, oldNode)

        const diffProperties = diff(
          newVirdNode.properties,
          oldVirdNode.properties
        )

        if (oldNode instanceof Element) {
          for (const name of Object.keys(diffProperties)) {
            const newValue = diffProperties[name]
            const value = newValue && newValue[0]

            updateAttribute(oldNode, name, value)
          }

          if (oldVirdNode) {
            offEvent(oldNode, oldVirdNode)
            clearVirdEvent(oldVirdNode)
          }

          onEvent(oldNode, newVirdNode)
        } else {
          if (diffProperties.textContent) {
            oldNode.textContent = diffProperties.textContent[0] || ''
          }
        }

        diffRender(oldNode, newVirdNode.children)
      }
    } else if (oldNode) {
      const parent = oldNode.parentElement
      if (parent) {
        parent.removeChild(oldNode)
      }
    }

    index++
    newVirdNodeIndex++
    oldVirdNodeIndex++
  }

  virdDom.set(rootNode, newVirdNodes)
}
