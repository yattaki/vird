import * as Vird from '../../vird/index'

export function createNode (node: Node): Vird.VirdNode {
  const type = node.nodeName.toLocaleLowerCase()
  const properties: Vird.VirdNode['properties'] = {}
  if (node instanceof Element) {
    for (const { name, value } of node.attributes) {
      properties[name] = value
    }
  } else {
    properties.textContent = node.textContent || ''
  }

  const children = [...node.childNodes].map(node => createNode(node))

  return Vird.createNode(type, properties, children)
}
