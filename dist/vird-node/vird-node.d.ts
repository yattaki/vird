import { VirdFormNodeAttributes, VirdNodeAttributes } from './vird-node-attributes';
import { VirdNodeTypes } from './vird-node-types';
/** A type to get VirdNode. */
export declare type ToVirdNode<T extends string | Node | VirdNode> = T extends VirdNode ? T : T extends VirdNodeTypes['text'] | Text ? VirdTextNode : T extends VirdNodeTypes['comment'] | Comment ? VirdCommentNode : T extends VirdNodeTypes['fragment'] | DocumentFragment ? VirdFragmentNode : T extends 'form' | HTMLFormElement ? VirdFormNode : T extends 'input' ? VirdNode : VirdNode;
declare const VirdNodeSymbol: unique symbol;
/**
 * An Object to create a new VirdNode.
 * It has no side effects.
 * Since it is a simple object, it can be serialized.
 */
export interface VirdNode {
    /**
     * A string representing the VirdNode type.
     * Only lowercase letters are used for Roman letters.
     */
    readonly type: string;
    /** An object representing the properties of the Node. */
    properties: Partial<VirdNodeAttributes>;
    /** An array that represents the child nodes of this node. */
    children: VirdNode[];
    [VirdNodeSymbol]: never;
}
export interface VirdTextNode extends VirdNode {
    readonly type: VirdNodeTypes['text'];
    /**
     * An object representing the properties of the Node.
     * There are no keys other than textContent.
     */
    properties: {
        textContent: string;
    };
    /**
     * An array representing the children of the VirdNode.
     * This is always empty.
     */
    readonly children: [];
}
export interface VirdCommentNode extends VirdNode {
    readonly type: VirdNodeTypes['comment'];
    /**
     * An object representing the properties of the Node.
     * There are no keys other than textContent.
     */
    properties: {
        textContent: string;
    };
    /**
     * An array representing the children of the VirdNode.
     * This is always empty.
     */
    children: [];
}
export interface VirdFragmentNode extends VirdNode {
    readonly type: VirdNodeTypes['fragment'];
    /**
     * An object representing the properties of the Node.
     * This is always empty.
     */
    readonly properties: Readonly<{}>;
}
export interface VirdFormNode extends VirdNode {
    readonly: 'form';
    properties: Partial<VirdFormNodeAttributes>;
}
export { };
