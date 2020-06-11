import * as Vird from '../../vird/index'

export function createNode (node: Node, trim = false): Vird.VirdNode {
  const type = node.nodeName.toLocaleLowerCase()
  const properties: Vird.VirdNode['properties'] = {}
  if (node instanceof Element) {
    for (const { name, value } of node.attributes) {
      properties[name] = value
    }
  } else {
    properties.textContent = node.textContent || ''
  }

  let children = [...node.childNodes].map(node => createNode(node, trim))
  if (trim) {
    children = children.filter(child => !['#text', '#comment'].includes(child.type) || !/^\s*$/.test(child.properties.textContent))
  }

  return Vird.createNode(type, properties, children)
}
