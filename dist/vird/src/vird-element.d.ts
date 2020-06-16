import { VirdNode } from './vird-node';
import EventHandler, { EventHandlerDataMap } from '@yattaki/event-handler';
export interface VirdElementEventMap extends EventHandlerDataMap {
    mount: {
        parent: VirdElement;
    };
    unmount: {
        parent: VirdElement;
    };
    update: {};
    'insert-children': {
        children: VirdElement[];
        index: number;
    };
    'remove-children': {
        children: VirdElement[];
    };
}
export declare class VirdElement<T extends {
    [key: string]: any;
} = {
    [key: string]: any;
}> extends EventHandler<VirdElementEventMap> {
    readonly virdNode: VirdNode;
    private _parent;
    private _children;
    private _state;
    acceptParentState: boolean;
    constructor(virdNode: VirdNode);
    insertAfter(beforeChild: VirdElement | null, ...children: VirdElement[]): this;
    insertBefore(afterChild: VirdElement | null, ...children: VirdElement[]): this;
    appendChild(...children: VirdElement[]): this;
    removeChild(...children: VirdElement[]): this;
    remove(): this;
    clearChildren(): this;
    setChildren(children: VirdElement[]): VirdElement<{
        [key: string]: any;
    }>[];
    clone(deep?: boolean): VirdElement<{
        [key: string]: any;
    }>;
    getVirdElements(getter: (VirdElement: VirdElement) => boolean, includeThis?: boolean): VirdElement<{
        [key: string]: any;
    }>[];
    update(): void;
    setProperties(properties: VirdNode['properties'], update?: boolean): void;
    setState(state: T, update?: boolean): void;
    getParentState(deep?: boolean): {
        [key: string]: any;
    };
    setAcceptParentStateOfChildren(bool: boolean): void;
    get parent(): VirdElement<{
        [key: string]: any;
    }> | null;
    get children(): VirdElement<{
        [key: string]: any;
    }>[];
    set children(value: VirdElement<{
        [key: string]: any;
    }>[]);
    get firstChild(): VirdElement<{
        [key: string]: any;
    }> | null;
    get lastChild(): VirdElement<{
        [key: string]: any;
    }> | null;
    get next(): VirdElement<{
        [key: string]: any;
    }> | null;
    get prev(): VirdElement<{
        [key: string]: any;
    }> | null;
    get state(): T;
    set state(value: T);
    get type(): string;
    set type(value: string);
    get properties(): {
        [key: string]: string;
    };
    set properties(value: {
        [key: string]: string;
    });
}
