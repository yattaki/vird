import { VirdNode } from '../vird-node/vird-node'

export type VirdEventProperties = {
  [K in keyof HTMLElementEventMap]: VirdEventValue<K> | string
}

export type VirdEventValue<K extends string = string> =
  | VirdEventListener<K>
  | {
      listener: VirdEventListener<K>
      options: VirdEventListenerOptions
    }

export type VirdEventListener<K extends string = string> = (
  event: K extends keyof HTMLElementEventMap ? HTMLElementEventMap[K] : Event
) => boolean | void

export type VirdEventListenerOptions =
  | AddEventListenerOptions
  | boolean
  | undefined

const virdEventListenerMap: WeakMap<
  VirdNode,
  Map<string, Set<VirdEventListener<any>>>
> = new WeakMap()

const listenerOptionsMap: WeakMap<
  VirdEventListener<any>,
  VirdEventListenerOptions
> = new WeakMap()

export function addVirdEvent<K extends string>(
  virdNode: VirdNode,
  type: K,
  listener: VirdEventListener<K>,
  options?: VirdEventListenerOptions
) {
  let eventListenerMap = virdEventListenerMap.get(virdNode)
  if (!eventListenerMap) {
    eventListenerMap = new Map()
    virdEventListenerMap.set(virdNode, eventListenerMap)
  }

  let events = eventListenerMap.get(type)
  if (!events) {
    events = new Set()
    eventListenerMap.set(type, events)
  }

  events.add(listener)
  listenerOptionsMap.set(listener, options)
}

export function removeVirdEvent<K extends string>(
  virdNode: VirdNode,
  type: K,
  listener: VirdEventListener<K>
) {
  const eventListenerMap = virdEventListenerMap.get(virdNode)
  if (!eventListenerMap) return

  const events = eventListenerMap.get(type)
  if (!events) return

  events.delete(listener)
  listenerOptionsMap.delete(listener)
}

export function getVirdEventMap(virdNode: VirdNode) {
  const result: {
    [key: string]: {
      listener: VirdEventListener
      options: VirdEventListenerOptions
    }[]
  } = {}

  const eventListenerMap = virdEventListenerMap.get(virdNode)
  if (eventListenerMap) {
    for (const [key, listeners] of eventListenerMap) {
      result[key] = []
      for (const listener of listeners) {
        const options = listenerOptionsMap.get(listener)
        result[key].push({ listener, options })
      }
    }
  }

  return result
}

export function cloneVirdEvent(
  copyVirdNode: VirdNode,
  masterVirdNode: VirdNode
) {
  const eventListenerMap = virdEventListenerMap.get(masterVirdNode)
  if (!eventListenerMap) return

  for (const [key, events] of eventListenerMap) {
    for (const event of events) {
      addVirdEvent(copyVirdNode, key, event)
    }
  }
}
