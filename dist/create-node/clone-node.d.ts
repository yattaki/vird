import { VirdNode } from '../vird-node/vird-node';
/**
 * The options object specifies the replication characteristics.
 */
export interface CloneNodeOptions {
    /**
     * A boolean that recursively duplicates child nodes.
     * If true, the node and its entire subtree are also copied.
     * Initial value is false.
     */
    deep: boolean;
    /**
     * A boolean that recursively duplicates the events.
     * If true, apply the event registered in the node to the copy destination as well.
     * Initial value is false.
     */
    event: boolean;
}
/**
 * This cloneNode() function duplicates VirdNode.
 * @param virdNode VirdNode to duplicate.
 * @param options
 */
export declare function cloneNode<R extends VirdNode>(virdNode: VirdNode, options?: Partial<CloneNodeOptions> | boolean): R;
