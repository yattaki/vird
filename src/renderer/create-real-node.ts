import { cloneNode } from '../create-node/clone-node'
import { VirdNode } from '../vird-node/vird-node'
import { virdNodeTypes } from '../vird-node/vird-node-types'
import { onEvent } from '../vird/vird-event'
import { reserves } from './reserve'
import { updateAttribute } from './update-attributes'
import { nodeMap, virdDom } from './vird-dom'

function createElement(virdNode: VirdNode) {
  const element = document.createElement(virdNode.type)

  for (const name of Object.keys(virdNode.properties)) {
    updateAttribute(element, name, virdNode.properties[name])
  }

  onEvent(element, virdNode)

  const clone = (virdNode: VirdNode) => cloneNode(virdNode, true)
  const cloneVirdNodes = virdNode.children.map(clone)

  const fragment = document.createDocumentFragment()
  for (const child of cloneVirdNodes) {
    const childNode = createRealNode(child)
    fragment.appendChild(childNode)
  }

  const renderingReserve = requestAnimationFrame(() => {
    element.appendChild(fragment)
    virdDom.set(element, cloneVirdNodes)
  })
  reserves.push(renderingReserve)

  return element
}

/**
 * The createRealNode() function creates a node from VirdNode.
 * @param virdNode The VirdNode object from which it is created.
 */
export function createRealNode(virdNode: VirdNode) {
  let node: Node
  switch (virdNode.type) {
    case virdNodeTypes.text:
      node = document.createTextNode(virdNode.properties.textContent || '')
      break
    case virdNodeTypes.comment:
      node = document.createComment(virdNode.properties.textContent || '')
      break
    default:
      node = createElement(virdNode)
  }

  nodeMap.set(virdNode, node)

  return node
}
