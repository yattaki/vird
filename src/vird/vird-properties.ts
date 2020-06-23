import { VirdNode } from '../vird-node/vird-node'
import { VirdEventProperties, VirdEventValue } from './vird-event'

export type VirdProperties = {
  [K in string]: VirdEventValue<K> | string
} &
  VirdEventProperties

export interface ParseVirdPropertiesResult {
  events: { [key: string]: VirdEventValue }
  properties: VirdNode['properties']
}

export function parseVirdProperties(params: Partial<VirdProperties>) {
  const result: ParseVirdPropertiesResult = {
    events: {},
    properties: {}
  }

  for (const key of Object.keys(params)) {
    const value = params[key]

    if (typeof value === 'string') {
      result.properties[key] = value
    } else if (value) {
      result.events[key] = value
    }
  }

  return result
}
