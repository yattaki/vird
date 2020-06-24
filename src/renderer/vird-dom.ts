import { VirdNode } from '../vird-node/vird-node'

export const virdDom: WeakMap<Node, VirdNode[]> = new WeakMap()
export const nodeMap: WeakMap<VirdNode, Node> = new WeakMap()
