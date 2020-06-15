export interface VirdConfig {
  binding: RegExp | null
}

export const config: VirdConfig = {
  binding: /{\s*([^\s:}]+)(?:\s*:\s*((?:[^\s}]|\s+[^}])*))?\s*}/
}
