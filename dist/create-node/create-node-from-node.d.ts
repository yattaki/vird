import { VirdCommentNode, VirdFragmentNode, VirdNode, VirdTextNode } from '../vird-node/vird-node';
/**
 * This createNodeFromNode() function creates a VirdNode from a Node.
 * @param node
 * A Node is used when creating a VirdNode.
 * The type of VirdNode created is the nodeName property converted to lowercase.
 */
export declare function createNodeFromNode(node: Text): VirdTextNode;
export declare function createNodeFromNode(node: Comment): VirdCommentNode;
/**
 * This createNodeFromNode() function creates a VirdNode from a Node.
 * @param node
 * A Node is used when creating a VirdNode.
 * The type of VirdNode created is the nodeName property converted to lowercase.
 * @param deep
 * A boolean that recursively duplicates child nodes.
 * If true, the node and its entire subtree are also transformed.
 * Initial value is false.
 */
export declare function createNodeFromNode(node: DocumentFragment, deep: boolean): VirdFragmentNode;
export declare function createNodeFromNode(node: Node, deep?: boolean): VirdNode;
