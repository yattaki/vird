export interface VirdConfig {
  binding: RegExp | null
}

export const config: VirdConfig = { binding: null }

export function setBindingConfig (startBracket: RegExp): void
export function setBindingConfig (startBracket: string, endBracket?: string): void
export function setBindingConfig (startBracket: string, space: string, endBracket: string): void
export function setBindingConfig (startBracket: string | RegExp, space?: string, endBracket?: string): void
export function setBindingConfig (startBracket: string | RegExp, space?: string, endBracket?: string) {
  if (startBracket instanceof RegExp) {
    config.binding = startBracket
    return
  }

  if (!endBracket) { endBracket = space || startBracket }
  if (!space) { space = ':' }

  config.binding = new RegExp(`${startBracket}\\s*([^\\s${space}${endBracket}]+)(?:\\s*${space}\\s*((?:[^\\s${endBracket}]|\\s+[^${endBracket}])*))?\\s*${endBracket}`, 'g')
}

setBindingConfig('{', ':', '}')
