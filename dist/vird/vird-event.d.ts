import { VirdNode } from '../vird-node/vird-node';
export declare type VirdEventProperties = {
    [K in keyof HTMLElementEventMap]: VirdEventValue<K> | string;
};
export declare type VirdEventValue<K extends string = string> = VirdEventListener<K> | {
    listener: VirdEventListener<K>;
    options: VirdEventListenerOptions;
};
export declare type VirdEventListener<K extends string = string> = (event: K extends keyof HTMLElementEventMap ? HTMLElementEventMap[K] : Event) => boolean | void;
export declare type VirdEventListenerOptions = AddEventListenerOptions | boolean | undefined;
export declare function addVirdEvent<K extends string>(virdNode: VirdNode, type: K, listener: VirdEventListener<K>, options?: VirdEventListenerOptions): void;
export declare function removeVirdEvent<K extends string>(virdNode: VirdNode, type: K, listener: VirdEventListener<K>): void;
export declare function getVirdEventMap(virdNode: VirdNode): {
    [key: string]: {
        listener: VirdEventListener;
        options: VirdEventListenerOptions;
    }[];
};
export declare function cloneVirdEvent(copyVirdNode: VirdNode, masterVirdNode: VirdNode): void;
