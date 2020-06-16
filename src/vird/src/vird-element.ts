import { VirdNode } from './vird-node'
import { cloneVirdNode } from './vird-node-creators'
import { config } from './config'
import EventHandler, { EventHandlerDataMap } from '@yattaki/event-handler'

export interface VirdElementEventMap extends EventHandlerDataMap {
  mount: { parent: VirdElement }
  unmount: { parent: VirdElement }
  update: {}
  'insert-children': { children: VirdElement[]; index: number }
  'remove-children': { children: VirdElement[] }
}

export class VirdElement<T extends { [key: string]: any } = { [key: string]: any }> extends EventHandler<VirdElementEventMap> {
  readonly virdNode: VirdNode

  private _parent: VirdElement | null = null
  private _children: VirdElement[] = []
  private _state: T = {} as T

  acceptParentState = false

  constructor (virdNode: VirdNode) {
    super()

    if (virdNode instanceof VirdElement) {
      this.virdNode = virdNode.virdNode
      virdNode.addEventListener('update', () => { this.update() })
    } else {
      this.virdNode = cloneVirdNode(virdNode)
    }

    this.setChildren(virdNode.children.map((child) =>
      child instanceof VirdElement
        ? child
        : new VirdElement(child))
    )

    this.addEventListener('mount', (e) => {
      for (const child of this.children) {
        child.dispatchEvent('unmount', { parent: e.data.parent })
      }
    })

    this.addEventListener('unmount', (e) => {
      for (const child of this.children) {
        child.dispatchEvent('unmount', { parent: e.data.parent })
      }
    })
  }

  insertAfter (beforeChild: VirdElement | null, ...children: VirdElement[]) {
    const newChildren = this.children

    let index: number
    if (beforeChild) {
      index = newChildren.indexOf(beforeChild) + 1
      if (index < 1) {
        throw Error('The VirdElement before which the new VirdElement is to be inserted is not a child of this VirdElement.')
      }
    } else {
      index = newChildren.length
    }

    newChildren.splice(index, 0, ...children)
    this.setChildren(newChildren)
    this.dispatchEvent('insert-children', { children, index })

    return this
  }

  insertBefore (afterChild: VirdElement | null, ...children: VirdElement[]) {
    return this.insertAfter(
      afterChild ? afterChild.prev : this.firstChild,
      ...children
    )
  }

  appendChild (...children: VirdElement[]) {
    return this.insertAfter(null, ...children)
  }

  removeChild (...children: VirdElement[]) {
    const newChildren = this.children
    for (const child of children) {
      if (!newChildren.includes(child)) {
        throw Error('The VirdElement to be removed is not a child of this VirdElement.')
      }
    }

    this.setChildren(newChildren.filter((child) => !children.includes(child)))
    this.dispatchEvent('remove-children', { children })

    return this
  }

  remove () {
    const parent = this.parent
    if (parent) {
      parent.removeChild(this)
    }

    return this
  }

  clearChildren () {
    this.setChildren([])

    return this
  }

  setChildren (children: VirdElement[]) {
    const beforeChildren = this.children
    this._children = children
    this.virdNode.children = this.children.map((child) => child.virdNode)

    for (const child of beforeChildren) {
      if (children.includes(child)) { continue }
      child._parent = null
      this.dispatchEvent('unmount', { parent: this })
    }

    for (const child of children) {
      if (beforeChildren.includes(child)) { continue }
      child._parent = this
      this.dispatchEvent('mount', { parent: this })
    }

    this.update()

    return beforeChildren
  }

  clone (deep = false) {
    const virdNode = cloneVirdNode(this.virdNode, deep)

    const virdElement = new VirdElement(virdNode)
    virdElement.setState(this.state, false)

    return virdElement
  }

  getVirdElements (
    getter: (VirdElement: VirdElement) => boolean,
    includeThis = false
  ) {
    const hitVirdElements: VirdElement[] = []

    if (includeThis && getter(this)) {
      hitVirdElements.push(this)
    }

    for (const child of this.children) {
      if (getter(child)) {
        hitVirdElements.push(child)
      }

      const childHits = child.getVirdElements(getter)
      if (childHits.length > 0) {
        hitVirdElements.push(...childHits)
      }
    }

    return hitVirdElements
  }

  update () {
    this.dispatchEvent('update')
  }

  setProperties (properties: VirdNode['properties'], update = true) {
    const beforeProperties = this.virdNode.properties
    for (const key of Object.keys(properties)) {
      if (this.state[key] === beforeProperties[key]) { continue }

      this.virdNode.properties = { ...this.virdNode.properties, ...properties }
      break
    }

    if (update && beforeProperties !== this.virdNode.properties) { this.update() }
  }

  setState (state: T, update = true) {
    const beforeState = this._state
    for (const key of Object.keys(state)) {
      if (this.state[key] === state[key]) { continue }

      this._state = { ...this.state, ...state }
      break
    }

    if (update && beforeState !== this._state) { this.update() }
  }

  getParentState (deep = true) {
    const parentStates: VirdElement['state'][] = [this.state]
    const pushParentState = (virdElement: VirdElement | null) => {
      if (!virdElement) { return }

      parentStates.push(virdElement.state)

      if (!deep || !virdElement.acceptParentState) { return }
      pushParentState(virdElement.parent)
    }

    pushParentState(this.parent)

    let catchState: VirdElement['state'] = {}
    for (const parentState of parentStates) {
      catchState = { ...parentState, ...catchState }
    }
    return catchState
  }

  setAcceptParentStateOfChildren (bool: boolean) {
    for (const child of this.children) {
      child.acceptParentState = bool
      child.setAcceptParentStateOfChildren(bool)
    }
  }

  get parent () {
    return this._parent
  }

  get children () {
    return [...this._children]
  }

  set children (value) {
    this.setChildren(value)
  }

  get firstChild () {
    return (this.children[0] || null) as VirdElement | null
  }

  get lastChild () {
    const children = this.children
    return (children[children.length - 1] || null) as VirdElement | null
  }

  get next () {
    const parent = this.parent
    if (!parent) {
      return null
    }

    const children = parent.children
    return children[children.indexOf(this) + 1] || null
  }

  get prev () {
    const parent = this.parent
    if (!parent) {
      return null
    }

    const children = parent.children
    return children[children.indexOf(this) - 1] || null
  }

  get state () {
    return this._state
  }

  set state (value) {
    this._state = value
  }

  get type () {
    return this.virdNode.type
  }

  set type (value) {
    this.virdNode.type = value
    this.update()
  }

  get properties () {
    let resultProperties: VirdNode['properties'] = {}
    const properties = { ...this.virdNode.properties }
    if (config.binding) {
      const mergeState = this.getParentState()

      const replacer = (_: string, key: string, defaultValue = '') =>
        key in mergeState
          ? String(mergeState[key])
          : defaultValue

      for (const key of Object.keys(properties)) {
        const value = properties[key]
        resultProperties[key] = value.replace(config.binding, replacer)
      }
    } else {
      resultProperties = properties
    }

    return resultProperties
  }

  set properties (value) {
    this.virdNode.properties = value
    this.update()
  }
}
