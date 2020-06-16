import { VirdNode, VirdElement, cloneVirdNode, virdNodeTypes } from '../../vird/index'
import { createNode } from './node-creators'
import { diff } from './diff'
import { clearFragmentNode } from './clear-fragment-node'

export type RenderItem = VirdNode | VirdElement | ((node: Node) => VirdNode | VirdElement)
export type PropertyValueMap = { newValue?: string, oldValue?: string }
export type PropertyTypeBinder = (node: Node, value: PropertyValueMap) => void
export type PropertyTypeRegExpBinder = (node: Node, matchArray: RegExpMatchArray, value: PropertyValueMap) => string
export type CustomNodeCreator = (virdNode: VirdNode) => Node

export class Renderer {
  private readonly _renderMap: WeakMap<Node, (VirdNode | VirdElement)[]> = new Map()
  private readonly _oldVirdNodeMap: WeakMap<Node, VirdNode[]> = new Map()
  private readonly _nodeCreatorMap: WeakMap<Node, CustomNodeCreator> = new WeakMap()
  private _propertyTypeBinderMap: Map<string, PropertyTypeBinder> = new Map()
  private _propertyTypeRegExpBinderMap: Map<RegExp, PropertyTypeRegExpBinder> = new Map()
  private _customNodeCreatorMap: Map<string, CustomNodeCreator> = new Map()

  constructor () {
    this.setCustomNode(virdNodeTypes.text, () => document.createTextNode(''))
    this.setCustomNode(virdNodeTypes.comment, () => document.createComment(''))
    this.setCustomNode(
      virdNodeTypes.fragment,
      () => document.createDocumentFragment()
    )
    this.setPropertyTypeBind(
      'textContent',
      (node, value) => { node.textContent = value.newValue || '' }
    )
  }

  private _updateProperties (node: Node, newProperties?: VirdNode['properties'], oldProperties?: VirdNode['properties']) {
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

  render (node: Node, ...renderItems: RenderItem[]) {
    const renderVirdNodes = renderItems.map(item => typeof item === 'function' ? item(node) : item)
    const newVirdNodes = clearFragmentNode(renderVirdNodes)
    const oldVirdNodes = this.getChildrenVirdNode(node)
    const childNodes = [...node.childNodes]
    this._renderMap.set(node, renderVirdNodes)

    const oldVirdNodeItems = newVirdNodes
      .map(virdNode => cloneVirdNode(virdNode instanceof VirdElement ? virdNode.virdNode : virdNode))
    this._oldVirdNodeMap.set(node, oldVirdNodeItems)

    let i = 0
    const maxIndex = Math.max(childNodes.length, newVirdNodes.length)
    while (i < maxIndex) {
      const oldVirdNode = (oldVirdNodes[i] || null) as VirdNode | null
      const newVirdNode = (newVirdNodes[i] || null) as VirdNode | null
      const childNode = (childNodes[i] || null) as Node | null

      let newNode: Node | null = null
      if (newVirdNode) {
        if (newVirdNode instanceof VirdElement) {
          newVirdNode.addEventListener('update', () => { this.reRender(node) })
        }

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
        this._updateProperties(
          newNode,
          newVirdNode ? newVirdNode.properties : undefined,
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

  renderDom (node: Node, trim = false) {
    const virdNodes = createNode(node, trim).children

    return this.render(node, ...virdNodes)
  }

  reRender (node: Node) {
    const virdNodes = this._renderMap.get(node)
    if (virdNodes) { this.render(node, ...virdNodes) }
  }

  createDispatcher (node: Node) {
    return async (beforeCallback?: () => void | Promise<void>) => {
      if (beforeCallback) { await beforeCallback() }

      this.reRender(node)
    }
  }

  createEffect<R = any> (node: Node, effect: (value: R) => R | Promise<R>, initValue: R): R
  createEffect(node: Node, effect: () => void | Promise<void>): void
  createEffect<R = any> (node: Node, effect: (value?: R) => R | Promise<R>, initValue?: R): R
  createEffect<R = any> (node: Node, effect: (value?: R) => R | Promise<R>, initValue?: R) {
    const dispatcher = this.createDispatcher(node)

    return {
      value: initValue,
      setEffect (value: R) {
        dispatcher(async () => { this.value = await effect(value) })
      }
    }
  }

  createNode (virdNode: VirdNode) {
    let createNode: Node | undefined

    const beforeCreator = createNode ? this._nodeCreatorMap.get(createNode) : undefined
    const creator = this._customNodeCreatorMap.get(virdNode.type)
    if (beforeCreator !== creator && creator) {
      createNode = creator(virdNode)
    }

    if (!createNode) { createNode = document.createElement(virdNode.type) }

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

  getChildrenVirdNode (node: Node) {
    return this._oldVirdNodeMap.get(node) || []
  }

  setCustomNode (type: string, creator: CustomNodeCreator) {
    this._customNodeCreatorMap.set(type, creator)

    return this
  }

  removeCustomNode (type: string) {
    this._customNodeCreatorMap.delete(type)

    return this
  }

  setPropertyTypeRegExpBind (regExp: RegExp, binder: PropertyTypeRegExpBinder) {
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

  setPropertyTypeBind (type: string, binder: PropertyTypeBinder) {
    this._propertyTypeBinderMap.set(type, binder)

    return this
  }

  removePropertyTypeBind (type: string) {
    this._propertyTypeBinderMap.delete(type)

    return this
  }
}

export const renderer = new Renderer()
