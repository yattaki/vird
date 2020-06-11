export interface VirdNode {
  type: string,
  properties: { [key: string]: string },
  children: VirdNode[]
}
