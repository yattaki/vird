import { ToVirdNode, VirdCommentNode, VirdFragmentNode, VirdNode, VirdTextNode } from '../vird-node/vird-node';
import { VirdNodeTypes } from '../vird-node/vird-node-types';
import { VirdProperties } from '../vird/vird-properties';
/**
 * This createNode() function creates a VirdNode.
 * @param base The base item for the created VirdNode.
 * @param properties An objects representing the VirdNode properties to create.
 */
export declare function createNode<T extends VirdNodeTypes['text'] | VirdNodeTypes['comment'] | Text | Comment | VirdTextNode | VirdCommentNode>(base: T, properties: ToVirdNode<T>['properties']): ToVirdNode<T>;
/**
 * This createNode() function creates a VirdNode.
 * @param base The base item for the created VirdNode.
 * @param text The string assigned to the value of virdTextNode.properties.textContent.
 */
export declare function createNode<T extends VirdNodeTypes['text'] | VirdNodeTypes['comment'] | Text | Comment | VirdTextNode | VirdCommentNode>(base: T, text?: string): ToVirdNode<T>;
/**
 * This createNode() function creates a VirdNode.
 * @param base The base item for the created VirdNode.
 * @param trim
 * A Boolean value that specifies the removal of elements that do not significantly affect the rendering.
 * If true, remove comments and text elements containing only spaces and line breaks.
 */
export declare function createNode<T extends VirdNodeTypes['fragment'] | DocumentFragment | VirdFragmentNode>(base: T, trim: boolean): ToVirdNode<T>;
/**
 * This createNode() function creates a VirdNode.
 * @param base The base item for the created VirdNode.
 * @param children An array or string that represents the children of the VirdNode.
 * @param trim
 * A Boolean value that specifies the removal of elements that do not significantly affect the rendering.
 * If true, remove comments and text elements containing only spaces and line breaks.
 */
export declare function createNode<T extends VirdNodeTypes['fragment'] | DocumentFragment | VirdFragmentNode>(base: T, children: string | (string | VirdNode)[], trim?: boolean): ToVirdNode<T>;
/**
 * This createNode() function creates a VirdNode.
 * @param base The base item for the created VirdNode.
 * @param childrenOrTrim Argument that can choose one of these.
 * - children : An array or string that represents the children of the VirdNode.
 * - trim : A Boolean value that specifies the removal of elements that do not significantly affect the rendering.
 * If true, remove comments and text elements containing only spaces and line breaks.
 */
export declare function createNode<T extends VirdNodeTypes['fragment'] | DocumentFragment | VirdFragmentNode>(base: T, childrenOrTrim?: string | (string | VirdNode)[] | boolean): ToVirdNode<T>;
/**
 * This createNode() function creates a VirdNode.
 * @param base The base item for the created VirdNode.
 * @param properties An objects representing the VirdNode properties to create.
 * @param children An array or string that represents the children of the VirdNode.
 * @param trim
 * A Boolean value that specifies the removal of elements that do not significantly affect the rendering.
 * If true, remove comments and text elements containing only spaces and line breaks.
 */
export declare function createNode<T extends string | Node | VirdNode>(base: T, properties: Partial<VirdProperties>, children: string | (string | VirdNode)[], trim?: boolean): ToVirdNode<T>;
/**
 * This createNode() function creates a VirdNode.
 * @param base The base item for the created VirdNode.
 * @param properties An objects representing the VirdNode properties to create.
 * @param trim
 * A Boolean value that specifies the removal of elements that do not significantly affect the rendering.
 * If true, remove comments and text elements containing only spaces and line breaks.
 */
export declare function createNode<T extends string | Node | VirdNode>(base: T, properties: Partial<VirdProperties>, trim: boolean): ToVirdNode<T>;
/**
 * This createNode() function creates a VirdNode.
 * @param base The base item for the created VirdNode.
 * @param children An array or string that represents the children of the VirdNode.
 * @param trim
 * A Boolean value that specifies the removal of elements that do not significantly affect the rendering.
 * If true, remove comments and text elements containing only spaces and line breaks.
 */
export declare function createNode<T extends string | Node | VirdNode>(base: T, children: string | (string | VirdNode)[], trim?: boolean): ToVirdNode<T>;
/**
 * This createNode() function creates a VirdNode.
 * @param base The base item for the created VirdNode.
 * @param trim
 * A Boolean value that specifies the removal of elements that do not significantly affect the rendering.
 * If true, remove comments and text elements containing only spaces and line breaks.
 */
export declare function createNode<T extends string | Node | VirdNode>(base: T, trim: boolean): ToVirdNode<T>;
/**
 * This createNode() function creates a VirdNode.
 * @param base The base item for the created VirdNode.
 * @param properties An objects representing the VirdNode properties to create.
 * @param childrenOrTrim Argument that can choose one of these.
 * - children : An array or string that represents the children of the VirdNode.
 * - trim : A Boolean value that specifies the removal of elements that do not significantly affect the rendering.
 * If true, remove comments and text elements containing only spaces and line breaks.
 */
export declare function createNode<T extends string | Node | VirdNode>(base: T, properties: Partial<VirdProperties>, childrenOrTrim?: string | (string | VirdNode)[] | boolean): ToVirdNode<T>;
/**
 * This createNode() function creates a VirdNode.
 * @param base The base item for the created VirdNode.
 * @param propertiesOrChildrenOrTrim Argument that can choose one of these.
 * - properties : An objects representing the VirdNode properties to create.
 * - children : An array or string that represents the children of the VirdNode.
 * - trim : A Boolean value that specifies the removal of elements that do not significantly affect the rendering.
 * If true, remove comments and text elements containing only spaces and line breaks.
 */
export declare function createNode<T extends string | Node | VirdNode>(base: T, propertiesOrChildrenOrTrim?: Partial<VirdProperties> | string | (string | VirdNode)[] | boolean): ToVirdNode<T>;
/**
 * This createNode() function creates a VirdNode.
 * @param base The base item for the created VirdNode.
 * @param propertiesOrChildrenOrTrim Argument that can choose one of these.
 * - properties : An objects representing the VirdNode properties to create.
 * - children : An array or string that represents the children of the VirdNode.
 * - trim : A Boolean value that specifies the removal of elements that do not significantly affect the rendering.
 * If true, remove comments and text elements containing only spaces and line breaks.
 * @param childrenOrTrim Argument that can choose one of these.
 * - children : An array or string that represents the children of the VirdNode.
 * - trim : A Boolean value that specifies the removal of elements that do not significantly affect the rendering.
 * If true, remove comments and text elements containing only spaces and line breaks.
 * @param trim
 * A Boolean value that specifies the removal of elements that do not significantly affect the rendering.
 * If true, remove comments and text elements containing only spaces and line breaks.
 */
export declare function createNode<T extends string | Node | VirdNode>(base: T, propertiesOrChildrenOrTrim?: Partial<VirdProperties> | string | (string | VirdNode)[] | boolean, childrenOrTrim?: string | (string | VirdNode)[] | boolean, trim?: boolean): ToVirdNode<T>;
