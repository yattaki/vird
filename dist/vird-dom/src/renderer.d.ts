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
    private readonly _nodeCreatorMap;
    private _propertyTypeBinderMap;
    private _propertyTypeRegExpBinderMap;
    private _customNodeCreatorMap;
    constructor();
    private _updateNode;
    render(node: Node, ...renderItems: RenderItem[]): VirdNode[];
    renderDom(node: Node, trim?: boolean): VirdNode[];
    reRender(node: Node): void;
    createDispatcher(node: Node): (beforeCallback?: (() => void | Promise<void>) | undefined) => Promise<void>;
    createEffect<R = any>(node: Node, effect: (value: R) => R | Promise<R>, initValue: R): R;
    createEffect(node: Node, effect: () => void | Promise<void>): void;
    createEffect<R = any>(node: Node, effect: (value?: R) => R | Promise<R>, initValue?: R): R;
    createNode(virdNode: VirdNode): Node;
    clone(): void;
    getChildrenVirdNode(node: Node): VirdNode[];
    setCustomNode(type: string, creator: CustomNodeCreator): this;
    removeCustomNode(type: string): this;
    setPropertyTypeRegExpBind(regExp: RegExp, binder: PropertyTypeRegExpBinder): this;
    removePropertyTypeRegExpBind(regExp: RegExp): this;
    setPropertyTypeBind(type: string, binder: PropertyTypeBinder): this;
    removePropertyTypeBind(type: string): this;
}
export declare const renderer: Renderer;
