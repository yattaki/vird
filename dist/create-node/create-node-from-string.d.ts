import { VirdCommentNode, VirdFragmentNode, VirdNode, VirdTextNode } from '../vird-node/vird-node';
/**
 * This createNodeFromString() function creates a VirdNode from a string.
 * @param type A string that represents the type of VirdNode to create.
 * @param properties An object that represents the properties of the VirdNode to create.
 * @param children An array that represents the child nodes of the VirdNode to create.
 */
export declare function createNodeFromString(type: VirdTextNode['type'], properties?: VirdTextNode['properties'], children?: VirdTextNode['children']): VirdTextNode;
export declare function createNodeFromString(type: VirdCommentNode['type'], properties?: VirdCommentNode['properties'], children?: VirdCommentNode['children']): VirdCommentNode;
export declare function createNodeFromString(type: VirdFragmentNode['type'], properties?: VirdFragmentNode['properties'], children?: VirdFragmentNode['children']): VirdFragmentNode;
export declare function createNodeFromString(type: string, properties?: VirdNode['properties'], children?: VirdNode['children']): VirdNode;
