import { VirdNode } from '../../vird/index'
import { createNode } from './create-node'
import { diff } from './diff'
import { clearFragmentNode } from './clear-fragment-node'

export type VirdDomPropertyValueMap = { newValue?: string, oldValue?: string }
export type VirdDomPropertyTypeBinder = (node: Node, value: VirdDomPropertyValueMap) => void
export type VirdDomPropertyTypeRegExpBinder = (node: Node, matchArray: RegExpMatchArray, value: VirdDomPropertyValueMap) => string
export type VirdDomCustomNodeCreator = (virdNode: VirdNode) => Node

export class Renderer {
  private readonly _renderMap: WeakMap<Node, (VirdNode | ((node: Node) => VirdNode))[]> = new Map()
  private readonly _oldVirdNodeMap: WeakMap<Node, VirdNode[]> = new Map()
  private readonly _nodeMap: WeakMap<VirdNode, Node> = new WeakMap()
  private readonly _virdNodeMap: WeakMap<Node, VirdNode> = new WeakMap()
  private readonly _nodeCreatorMap: WeakMap<Node, VirdDomCustomNodeCreator> = new WeakMap()
  private _propertyTypeBinderMap: Map<string, VirdDomPropertyTypeBinder> = new Map()
  private _propertyTypeRegExpBinderMap: Map<RegExp, VirdDomPropertyTypeRegExpBinder> = new Map()
  private _customNodeCreatorMap: Map<string, VirdDomCustomNodeCreator> = new Map()
  fragmentType = '#document-fragment'

  constructor () {
    this.setCustomNode('#text', () => document.createTextNode(''))
    this.setCustomNode('#comment', () => document.createComment(''))
    this.setCustomNode('#cdata-section', () => document.createCDATASection(''))
    this.setPropertyTypeBind('textContent', (node, value) => { node.textContent = value.newValue || '' })
  }

  private _updateNode (node: Node, newProperties?: VirdNode['properties'], oldProperties?: VirdNode['properties']) {
    const diffObject = diff(newProperties, oldProperties)

    for (const type of Object.keys(diffObject)) {
      const [newValue, oldValue] = diffObject[type]

      let isMatch = false
      for (const [regExp, propertyTypeRegExpBinder] of this._propertyTypeRegExpBinderMap) {
        const matchArray = type.match(regExp)
        if (matchArray) {
          isMatch = true
          propertyTypeRegExpBinder(node, matchArray, { newValue, oldValue })
          break
        }
      }

      if (!isMatch) {
        const propertyTypeBinder = this._propertyTypeBinderMap.get(type)
        if (propertyTypeBinder) {
          propertyTypeBinder(node, { newValue, oldValue })
        } else if (node instanceof Element) {
          if (newValue) {
            node.setAttribute(type, newValue)
          } else {
            node.removeAttribute(type)
          }
        }
      }
    }
  }

  render (node: Node, ...renderItems: (VirdNode | ((node: Node) => VirdNode))[]) {
    const renderVirdNodes = renderItems.map(item => typeof item === 'function' ? item(node) : item)
    const newVirdNodes = clearFragmentNode(renderVirdNodes)
    const oldVirdNodes = this.getChildrenVirdNode(node)
    const childNodes = [...node.childNodes]
    this._renderMap.set(node, renderItems)
    this._oldVirdNodeMap.set(node, newVirdNodes)

    let i = 0
    const maxIndex = Math.max(childNodes.length, newVirdNodes.length)
    while (i < maxIndex) {
      const oldVirdNode = (oldVirdNodes[i] || null) as VirdNode | null
      const newVirdNode = (newVirdNodes[i] || null) as VirdNode | null
      const childNode = (childNodes[i] || null) as Node | null

      let newNode: Node | null = null
      if (newVirdNode) {
        if (!oldVirdNode || oldVirdNode.type !== newVirdNode.type) {
          newNode = this.createNode(newVirdNode)

          if (childNode) {
            node.replaceChild(newNode, childNode)
          } else {
            node.appendChild(newNode)
          }
        } else {
          newNode = childNode
        }
      } else {
        if (childNode) {
          node.removeChild(childNode)
        }
      }

      if (newNode) {
        this._updateNode(
          newNode, newVirdNode ? newVirdNode.properties : undefined,
          oldVirdNode ? oldVirdNode.properties : undefined
        )

        if (newVirdNode && newVirdNode.children.length > 0) {
          this.render(newNode, ...newVirdNode.children)
        }
      }

      i++
    }

    return newVirdNodes
  }

  renderDom (node: Node) {
    const virdNodes = [...node.childNodes].map(node => createNode(node))

    return this.render(node, ...virdNodes)
  }

  createDispatcher (node: Node) {
    return async (beforeCallback?: () => void | Promise<void>) => {
      if (beforeCallback) { await beforeCallback() }

      const virdNodes = this._renderMap.get(node)
      if (virdNodes) { this.render(node, ...virdNodes) }
    }
  }

  createEffect<T = any> (node: Node, effect: (value?: T) => T | Promise<T>, initValue?: T) {
    const dispatcher = this.createDispatcher(node)

    return {
      value: initValue,
      setEffect (value: T) {
        dispatcher(async () => { this.value = await effect(value) })
      }
    }
  }

  createNode (virdNode: VirdNode) {
    let createNode: Node | undefined
    const realNode = this._nodeMap.get(virdNode)
    if (realNode) { createNode = realNode }

    const beforeCreator = createNode ? this._nodeCreatorMap.get(createNode) : undefined
    const creator = this._customNodeCreatorMap.get(virdNode.type)
    if (beforeCreator !== creator && creator) {
      createNode = creator(virdNode)
    }

    if (!createNode) { createNode = document.createElement(virdNode.type) }

    this._nodeMap.set(virdNode, createNode)
    this._virdNodeMap.set(createNode, virdNode)

    return createNode
  }

  clone () {
    const renderer = new Renderer()

    for (const [regExp, binder] of this._propertyTypeRegExpBinderMap) {
      renderer.setPropertyTypeRegExpBind(regExp, binder)
    }

    for (const [type, binder] of this._propertyTypeBinderMap) {
      renderer.setPropertyTypeBind(type, binder)
    }
  }

  getNode (virdNode: VirdNode) {
    return this._nodeMap.get(virdNode) || null
  }

  getVirdNode (node: Node) {
    return this._virdNodeMap.get(node) || null
  }

  getChildrenVirdNode (node: Node) {
    return this._oldVirdNodeMap.get(node) || []
  }

  setCustomNode (type: string, creator: VirdDomCustomNodeCreator) {
    this._customNodeCreatorMap.set(type, creator)

    return this
  }

  removeCustomNode (type: string) {
    this._customNodeCreatorMap.delete(type)

    return this
  }

  setPropertyTypeRegExpBind (regExp: RegExp, binder: VirdDomPropertyTypeRegExpBinder) {
    this.removePropertyTypeRegExpBind(regExp)
    this._propertyTypeRegExpBinderMap.set(regExp, binder)

    return this
  }

  removePropertyTypeRegExpBind (regExp: RegExp) {
    for (const key of this._propertyTypeRegExpBinderMap.keys()) {
      if (String(key) !== String(regExp)) { continue }

      this._propertyTypeRegExpBinderMap.delete(regExp)
      break
    }

    return this
  }

  setPropertyTypeBind (type: string, binder: VirdDomPropertyTypeBinder) {
    this._propertyTypeBinderMap.set(type, binder)

    return this
  }

  removePropertyTypeBind (type: string) {
    this._propertyTypeBinderMap.delete(type)

    return this
  }
}
