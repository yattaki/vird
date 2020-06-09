import { VirdNode } from '../../vird/index';
export declare type VirdDomPropertyValueMap = {
    newValue?: string;
    oldValue?: string;
};
export declare type VirdDomPropertyTypeBinder = (node: Node, value: VirdDomPropertyValueMap) => void;
export declare type VirdDomPropertyTypeRegExpBinder = (node: Node, matchArray: RegExpMatchArray, value: VirdDomPropertyValueMap) => string;
export declare type VirdDomCustomNodeCreator = (virdNode: VirdNode) => Node;
export declare class Renderer {
    private readonly _renderMap;
    private readonly _oldVirdNodeMap;
    private readonly _nodeMap;
    private readonly _virdNodeMap;
    private readonly _nodeCreatorMap;
    private _propertyTypeBinderMap;
    private _propertyTypeRegExpBinderMap;
    private _customNodeCreatorMap;
    fragmentType: string;
    constructor();
    private _updateNode;
    render(node: Node, ...renderItems: (VirdNode | ((node: Node) => VirdNode))[]): VirdNode[];
    renderDom(node: Node): VirdNode[];
    createDispatcher(node: Node): (beforeCallback?: (() => void | Promise<void>) | undefined) => Promise<void>;
    createEffect<T = any>(node: Node, effect: (value?: T) => T | Promise<T>, initValue?: T): {
        value: T | undefined;
        setEffect(value: T): void;
    };
    createNode(virdNode: VirdNode): Node;
    clone(): void;
    getNode(virdNode: VirdNode): Node | null;
    getVirdNode(node: Node): VirdNode | null;
    getChildrenVirdNode(node: Node): VirdNode[];
    setCustomNode(type: string, creator: VirdDomCustomNodeCreator): this;
    removeCustomNode(type: string): this;
    setPropertyTypeRegExpBind(regExp: RegExp, binder: VirdDomPropertyTypeRegExpBinder): this;
    removePropertyTypeRegExpBind(regExp: RegExp): this;
    setPropertyTypeBind(type: string, binder: VirdDomPropertyTypeBinder): this;
    removePropertyTypeBind(type: string): this;
}
