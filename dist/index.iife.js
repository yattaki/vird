var vird = (function (exports) {
    'use strict';

    const virdNodeTypes = Object.defineProperties({}, {
        text: { value: '#text' },
        comment: { value: '#comment' },
        fragment: { value: '#document-fragment' }
    });

    function cloneVirdNode(virdNode, deep = false) {
        const type = virdNodeTypes.text;
        const properties = Object.assign({}, virdNode.properties);
        const children = deep ? virdNode.children.map(child => cloneVirdNode(child)) : [];
        return { type, properties, children };
    }
    function createText(text) {
        const type = virdNodeTypes.text;
        const properties = { textContent: text };
        const children = [];
        return { type, properties, children };
    }
    function createComment(comment) {
        const type = virdNodeTypes.comment;
        const properties = { textContent: comment };
        const children = [];
        return { type, properties, children };
    }
    function createFragment(...children) {
        const type = virdNodeTypes.fragment;
        const properties = {};
        return { type, properties, children };
    }
    function createVirdNode(type, properties, children) {
        if (typeof properties !== 'object' || Array.isArray(properties)) {
            children = properties;
            properties = {};
        }
        if (typeof children === 'string') {
            children = [children];
        }
        else if (!Array.isArray(children)) {
            children = [];
        }
        const createChildren = children.map(child => typeof child === 'string' ? createText(child) : child);
        return { type, properties, children: createChildren };
    }

    class EventHandler {
        constructor() {
            this._map = new Map();
        }
        /**
         * Add a new listener.
         * @param type This represents the name of the event.
         * @param listener This represents the listener to add.
         * @param options Specifies characteristics about the event listener.
         */
        addEventListener(type, listener, options = {}) {
            let onMaps = this._map.get(type);
            if (!onMaps) {
                onMaps = [];
                this._map.set(type, onMaps);
            }
            let isAdd = true;
            for (const onMap of onMaps) {
                if (onMap.listener === listener) {
                    onMap.options = options;
                    isAdd = false;
                    break;
                }
            }
            if (isAdd) {
                onMaps.push({ listener, options });
            }
            return isAdd;
        }
        /**
         * Remove the listener.
         * @param type This represents the name of the event.
         * @param listener This represents the listener to remove.
         */
        removeEventListener(type, listener) {
            const onMaps = this._map.get(type);
            if (onMaps) {
                let index = 0;
                for (const onMap of onMaps) {
                    if (onMap.listener === listener) {
                        onMaps.splice(index, 1);
                        return true;
                    }
                    index++;
                }
            }
            return false;
        }
        /**
         * Execute the registered event.
         * @param type This represents the name of the event.
         * @param data An object to be passed as an argument of the listener.
         */
        async dispatchEvent(type, data = {}) {
            const promises = [];
            const onMaps = this._map.get(type);
            if (onMaps) {
                for (const { listener, options } of [...onMaps]) {
                    const event = {
                        type,
                        target: this,
                        data: { ...(options.data || {}), ...data }
                    };
                    const promise = listener(event);
                    promises.push(promise);
                    if (options.once) {
                        this.removeEventListener(type, listener);
                    }
                    if (options.wait) {
                        await promise;
                    }
                }
            }
            await Promise.all(promises);
        }
    }

    class VirdElement extends EventHandler {
        constructor(virdNode) {
            super();
            this._parent = null;
            this.state = {};
            this.virdNode = virdNode;
            this._children = virdNode.children.map((child) => new VirdElement(child));
            this.addEventListener('mount', (e) => {
                for (const child of this.children) {
                    child.dispatchEvent('unmount', { parent: e.data.parent });
                }
            });
            this.addEventListener('unmount', (e) => {
                for (const child of this.children) {
                    child.dispatchEvent('unmount', { parent: e.data.parent });
                }
            });
        }
        insertAfter(beforeChild, ...children) {
            const newChildren = this.children;
            let index;
            if (beforeChild) {
                index = newChildren.indexOf(beforeChild) + 1;
                if (index < 1) {
                    throw Error('The VirdElement before which the new VirdElement is to be inserted is not a child of this VirdElement.');
                }
            }
            else {
                index = newChildren.length;
            }
            newChildren.splice(index, 0, ...children);
            this.setChildren(newChildren);
            this.dispatchEvent('insert-children', { children, index });
            return this;
        }
        insertBefore(afterChild, ...children) {
            return this.insertAfter(afterChild ? afterChild.prev : this.firstChild, ...children);
        }
        appendChild(...children) {
            return this.insertAfter(null, ...children);
        }
        removeChild(...children) {
            const newChildren = this.children;
            for (const child of children) {
                if (!newChildren.includes(child)) {
                    throw Error('The VirdElement to be removed is not a child of this VirdElement.');
                }
            }
            this.setChildren(newChildren.filter((child) => !children.includes(child)));
            this.dispatchEvent('remove-children', { children });
            return this;
        }
        remove() {
            const parent = this.parent;
            if (parent) {
                parent.removeChild(this);
            }
            return this;
        }
        clearChildren() {
            this.setChildren([]);
            return this;
        }
        setChildren(children) {
            const beforeChildren = this.children;
            this._children = children;
            this.virdNode.children = this.children.map((child) => child.virdNode);
            for (const child of beforeChildren) {
                if (children.includes(child)) {
                    continue;
                }
                child._parent = null;
                this.dispatchEvent('unmount', { parent: this });
            }
            for (const child of children) {
                if (beforeChildren.includes(child)) {
                    continue;
                }
                child._parent = this;
                this.dispatchEvent('mount', { parent: this });
            }
            this.update();
            return beforeChildren;
        }
        clone(deep = false) {
            const virdNode = cloneVirdNode(this.virdNode, deep);
            const virdElement = new VirdElement(virdNode);
            virdElement.setState(this.state, false);
            return virdElement;
        }
        getVirdElements(getter, includeThis = false) {
            const hitVirdElements = [];
            if (includeThis && getter(this)) {
                hitVirdElements.push(this);
            }
            for (const child of this.children) {
                if (getter(child)) {
                    hitVirdElements.push(child);
                }
            }
            return hitVirdElements;
        }
        update() {
            this.dispatchEvent('update');
        }
        setState(state, update = true) {
            const beforeState = this.state;
            for (const key of Object.keys(state)) {
                if (this.state[key] === state[key]) {
                    continue;
                }
                this.state = Object.assign(Object.assign({}, this.state), state);
                break;
            }
            if (update && beforeState !== this.state) {
                this.update();
            }
        }
        get parent() {
            return this._parent;
        }
        get children() {
            return [...this._children];
        }
        set children(value) {
            this.setChildren(value);
        }
        get firstChild() {
            return (this.children[0] || null);
        }
        get lastChild() {
            const children = this.children;
            return (children[children.length - 1] || null);
        }
        get next() {
            const parent = this.parent;
            if (!parent) {
                return null;
            }
            const children = parent.children;
            return children[children.indexOf(this) + 1] || null;
        }
        get prev() {
            const parent = this.parent;
            if (!parent) {
                return null;
            }
            const children = parent.children;
            return children[children.indexOf(this) - 1] || null;
        }
        get type() {
            return this.virdNode.type;
        }
        set type(value) {
            this.virdNode.type = value;
            this.update();
        }
        get properties() {
            return Object.assign({}, this.virdNode.properties);
        }
        set properties(value) {
            this.virdNode.properties = value;
            this.update();
        }
    }

    function createNode(nodeOrType, propertiesOrTrim = false, children) {
        if (typeof nodeOrType === 'string') {
            if (typeof propertiesOrTrim === 'boolean') {
                propertiesOrTrim = {};
            }
            return createVirdNode(nodeOrType, propertiesOrTrim, children);
        }
        else {
            const node = nodeOrType;
            const type = node.nodeName.toLocaleLowerCase();
            const properties = {};
            if (node instanceof Element) {
                for (const { name, value } of node.attributes) {
                    properties[name] = value;
                }
            }
            else {
                properties.textContent = node.textContent || '';
            }
            const trim = !!propertiesOrTrim;
            let children = [...node.childNodes].map(node => createNode(node, trim));
            if (trim) {
                const filter = (virdNode) => virdNode.type !== virdNodeTypes.comment &&
                    (virdNode.type !== virdNodeTypes.text || !/^\s*$/.test(virdNode.properties.textContent));
                children = children.filter(filter);
            }
            return createVirdNode(type, properties, children);
        }
    }

    function diff(checkObject, comparisonObjet) {
        const diffObject = {};
        if (checkObject !== comparisonObjet) {
            if (checkObject) {
                if (comparisonObjet) {
                    const checkObjectKeys = Object.keys(checkObject);
                    const comparisonObjetKeys = Object.keys(comparisonObjet);
                    const keys = new Set([...checkObjectKeys, ...comparisonObjetKeys]);
                    for (const key of keys) {
                        const checkObjetValue = checkObject[key];
                        const comparisonObjetValue = comparisonObjet[key];
                        if (checkObjetValue === comparisonObjetValue) {
                            continue;
                        }
                        diffObject[key] = [checkObjetValue, comparisonObjetValue];
                    }
                }
                else {
                    for (const key of Object.keys(checkObject)) {
                        const value = checkObject[key];
                        diffObject[key] = [value, undefined];
                    }
                }
            }
            else {
                if (comparisonObjet) {
                    for (const key of Object.keys(comparisonObjet)) {
                        const value = comparisonObjet[key];
                        diffObject[key] = [undefined, value];
                    }
                }
            }
        }
        return diffObject;
    }

    function clearFragmentNode(virdNodes, key = '#document-fragment') {
        const result = [];
        for (const virdNode of virdNodes) {
            if (virdNode.type === key) {
                const children = clearFragmentNode(virdNode.children);
                result.push(...children);
            }
            else {
                result.push(virdNode);
            }
        }
        return result;
    }

    class Renderer {
        constructor() {
            this._renderMap = new Map();
            this._oldVirdNodeMap = new Map();
            this._nodeMap = new WeakMap();
            this._virdNodeMap = new WeakMap();
            this._nodeCreatorMap = new WeakMap();
            this._propertyTypeBinderMap = new Map();
            this._propertyTypeRegExpBinderMap = new Map();
            this._customNodeCreatorMap = new Map();
            this.fragmentType = '#document-fragment';
            this.setCustomNode('#text', () => document.createTextNode(''));
            this.setCustomNode('#comment', () => document.createComment(''));
            this.setCustomNode('#cdata-section', () => document.createCDATASection(''));
            this.setPropertyTypeBind('textContent', (node, value) => { node.textContent = value.newValue || ''; });
        }
        _updateNode(node, newProperties, oldProperties) {
            const diffObject = diff(newProperties, oldProperties);
            for (const type of Object.keys(diffObject)) {
                const [newValue, oldValue] = diffObject[type];
                let isMatch = false;
                for (const [regExp, propertyTypeRegExpBinder] of this._propertyTypeRegExpBinderMap) {
                    const matchArray = type.match(regExp);
                    if (matchArray) {
                        isMatch = true;
                        propertyTypeRegExpBinder(node, matchArray, { newValue, oldValue });
                        break;
                    }
                }
                if (!isMatch) {
                    const propertyTypeBinder = this._propertyTypeBinderMap.get(type);
                    if (propertyTypeBinder) {
                        propertyTypeBinder(node, { newValue, oldValue });
                    }
                    else if (node instanceof Element) {
                        if (newValue) {
                            node.setAttribute(type, newValue);
                        }
                        else {
                            node.removeAttribute(type);
                        }
                    }
                }
            }
        }
        render(node, ...renderItems) {
            const renderVirdNodes = renderItems.map(item => typeof item === 'function' ? item(node) : item);
            const newVirdNodes = clearFragmentNode(renderVirdNodes);
            const oldVirdNodes = this.getChildrenVirdNode(node);
            const childNodes = [...node.childNodes];
            this._renderMap.set(node, renderItems);
            this._oldVirdNodeMap.set(node, newVirdNodes);
            let i = 0;
            const maxIndex = Math.max(childNodes.length, newVirdNodes.length);
            while (i < maxIndex) {
                const oldVirdNode = (oldVirdNodes[i] || null);
                const newVirdNode = (newVirdNodes[i] || null);
                const childNode = (childNodes[i] || null);
                let newNode = null;
                if (newVirdNode) {
                    if (!oldVirdNode || oldVirdNode.type !== newVirdNode.type) {
                        newNode = this.createNode(newVirdNode);
                        if (childNode) {
                            node.replaceChild(newNode, childNode);
                        }
                        else {
                            node.appendChild(newNode);
                        }
                    }
                    else {
                        newNode = childNode;
                    }
                }
                else {
                    if (childNode) {
                        node.removeChild(childNode);
                    }
                }
                if (newNode) {
                    this._updateNode(newNode, newVirdNode ? newVirdNode.properties : undefined, oldVirdNode ? oldVirdNode.properties : undefined);
                    if (newVirdNode && newVirdNode.children.length > 0) {
                        this.render(newNode, ...newVirdNode.children);
                    }
                }
                i++;
            }
            return newVirdNodes;
        }
        renderDom(node, trim = false) {
            const virdNodes = createNode(node, trim).children;
            return this.render(node, ...virdNodes);
        }
        reRender(node) {
            const virdNodes = this._renderMap.get(node);
            if (virdNodes) {
                this.render(node, ...virdNodes);
            }
        }
        createDispatcher(node) {
            return async (beforeCallback) => {
                if (beforeCallback) {
                    await beforeCallback();
                }
                this.reRender(node);
            };
        }
        createEffect(node, effect, initValue) {
            const dispatcher = this.createDispatcher(node);
            return {
                value: initValue,
                setEffect(value) {
                    dispatcher(async () => { this.value = await effect(value); });
                }
            };
        }
        createNode(virdNode) {
            let createNode;
            const realNode = this._nodeMap.get(virdNode);
            if (realNode) {
                createNode = realNode;
            }
            const beforeCreator = createNode ? this._nodeCreatorMap.get(createNode) : undefined;
            const creator = this._customNodeCreatorMap.get(virdNode.type);
            if (beforeCreator !== creator && creator) {
                createNode = creator(virdNode);
            }
            if (!createNode) {
                createNode = document.createElement(virdNode.type);
            }
            this._nodeMap.set(virdNode, createNode);
            this._virdNodeMap.set(createNode, virdNode);
            return createNode;
        }
        clone() {
            const renderer = new Renderer();
            for (const [regExp, binder] of this._propertyTypeRegExpBinderMap) {
                renderer.setPropertyTypeRegExpBind(regExp, binder);
            }
            for (const [type, binder] of this._propertyTypeBinderMap) {
                renderer.setPropertyTypeBind(type, binder);
            }
        }
        getNode(virdNode) {
            return this._nodeMap.get(virdNode) || null;
        }
        getVirdNode(node) {
            return this._virdNodeMap.get(node) || null;
        }
        getChildrenVirdNode(node) {
            return this._oldVirdNodeMap.get(node) || [];
        }
        setCustomNode(type, creator) {
            this._customNodeCreatorMap.set(type, creator);
            return this;
        }
        removeCustomNode(type) {
            this._customNodeCreatorMap.delete(type);
            return this;
        }
        setPropertyTypeRegExpBind(regExp, binder) {
            this.removePropertyTypeRegExpBind(regExp);
            this._propertyTypeRegExpBinderMap.set(regExp, binder);
            return this;
        }
        removePropertyTypeRegExpBind(regExp) {
            for (const key of this._propertyTypeRegExpBinderMap.keys()) {
                if (String(key) !== String(regExp)) {
                    continue;
                }
                this._propertyTypeRegExpBinderMap.delete(regExp);
                break;
            }
            return this;
        }
        setPropertyTypeBind(type, binder) {
            this._propertyTypeBinderMap.set(type, binder);
            return this;
        }
        removePropertyTypeBind(type) {
            this._propertyTypeBinderMap.delete(type);
            return this;
        }
    }
    const renderer = new Renderer();

    exports.Renderer = Renderer;
    exports.VirdElement = VirdElement;
    exports.cloneVirdNode = cloneVirdNode;
    exports.createComment = createComment;
    exports.createFragment = createFragment;
    exports.createNode = createNode;
    exports.createText = createText;
    exports.createVirdNode = createVirdNode;
    exports.renderer = renderer;
    exports.virdNodeTypes = virdNodeTypes;

    return exports;

}({}));
//# sourceMappingURL=index.iife.js.map
