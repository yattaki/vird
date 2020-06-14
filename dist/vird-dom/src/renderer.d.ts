import { VirdNode } from '../../vird/index';
export declare type RenderItem = VirdNode | ((node: Node) => VirdNode);
export declare type PropertyValueMap = {
    newValue?: string;
    oldValue?: string;
};
export declare type PropertyTypeBinder = (node: Node, value: PropertyValueMap) => void;
export declare type PropertyTypeRegExpBinder = (node: Node, matchArray: RegExpMatchArray, value: PropertyValueMap) => string;
export declare type CustomNodeCreator = (virdNode: VirdNode) => Node;
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
    render(node: Node, ...renderItems: RenderItem[]): VirdNode[];
    renderDom(node: Node, trim?: boolean): VirdNode[];
    reRender(node: Node): void;
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
    setCustomNode(type: string, creator: CustomNodeCreator): this;
    removeCustomNode(type: string): this;
    setPropertyTypeRegExpBind(regExp: RegExp, binder: PropertyTypeRegExpBinder): this;
    removePropertyTypeRegExpBind(regExp: RegExp): this;
    setPropertyTypeBind(type: string, binder: PropertyTypeBinder): this;
    removePropertyTypeBind(type: string): this;
}
export declare const renderer: Renderer;
