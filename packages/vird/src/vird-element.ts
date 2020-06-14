import { VirdNode } from '../../index'
import { cloneVirdNode } from './creates'
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
  private _children: VirdElement[]

  state: T = {} as T

  constructor (virdNode: VirdNode) {
    super()

    this.virdNode = virdNode
    this._children = virdNode.children.map((child) => new VirdElement(child))

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
    }

    return hitVirdElements
  }

  update () {
    this.dispatchEvent('update')
  }

  setState (state: T, update = true) {
    const beforeState = this.state
    for (const key of Object.keys(state)) {
      if (this.state[key] === state[key]) { continue }

      this.state = { ...this.state, ...state }
      break
    }

    if (update && beforeState !== this.state) { this.update() }
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

  get type () {
    return this.virdNode.type
  }

  set type (value) {
    this.virdNode.type = value
    this.update()
  }

  get properties () {
    return { ...this.virdNode.properties }
  }

  set properties (value) {
    this.virdNode.properties = value
    this.update()
  }
}
