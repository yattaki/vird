(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.vird = {}));
}(this, (function (exports) { 'use strict';

    const virdEventListenerMap = new WeakMap();
    const listenerOptionsMap = new WeakMap();
    function addVirdEvent(virdNode, type, listener, options) {
        let eventListenerMap = virdEventListenerMap.get(virdNode);
        if (!eventListenerMap) {
            eventListenerMap = new Map();
            virdEventListenerMap.set(virdNode, eventListenerMap);
        }
        let events = eventListenerMap.get(type);
        if (!events) {
            events = new Set();
            eventListenerMap.set(type, events);
        }
        events.add(listener);
        listenerOptionsMap.set(listener, options);
    }
    function clearVirdEvent(virdEvent) {
        virdEventListenerMap.delete(virdEvent);
    }
    function cloneVirdEvent(copyVirdNode, masterVirdNode) {
        const eventListenerMap = virdEventListenerMap.get(masterVirdNode);
        if (!eventListenerMap)
            return;
        for (const [key, events] of eventListenerMap) {
            for (const event of events) {
                addVirdEvent(copyVirdNode, key, event);
            }
        }
    }
    function onEvent(node, virdNode) {
        const eventListenerMap = virdEventListenerMap.get(virdNode);
        if (eventListenerMap) {
            for (const [name, eventMap] of eventListenerMap) {
                for (const listener of eventMap) {
                    node.addEventListener(name, listener, listenerOptionsMap.get(listener));
                }
            }
        }
    }
    function offEvent(node, virdNode) {
        const eventListenerMap = virdEventListenerMap.get(virdNode);
        if (eventListenerMap) {
            for (const [name, eventMap] of eventListenerMap) {
                for (const listener of eventMap) {
                    node.removeEventListener(name, listener);
                }
            }
        }
    }

    const virdNodeTypes = {
        text: '#text',
        comment: '#comment',
        fragment: '#document-fragment'
    };

    function createNodeFromString(type, properties = {}, children = []) {
        type = type.toLocaleLowerCase();
        properties = Object.assign({}, properties);
        children = [...children];
        if (!properties.textContent &&
            (virdNodeTypes.text === type || virdNodeTypes.comment === type)) {
            properties.textContent = '';
        }
        return { type, properties, children };
    }

    /**
     * This cloneNode() function duplicates VirdNode.
     * @param virdNode VirdNode to duplicate.
     * @param options
     */
    function cloneNode(virdNode, options = {}) {
        if (typeof options === 'boolean') {
            options = { deep: options, event: options };
        }
        const { deep = false, event = false } = options;
        const type = virdNode.type;
        const properties = Object.assign({}, virdNode.properties);
        const children = deep
            ? virdNode.children.map(child => cloneNode(child, options))
            : [];
        const cloneVirdNode = createNodeFromString(type, properties, children);
        if (event) {
            cloneVirdEvent(cloneVirdNode, virdNode);
        }
        return cloneVirdNode;
    }

    function parseVirdProperties(params) {
        const result = {
            events: {},
            properties: {}
        };
        for (const key of Object.keys(params)) {
            const value = params[key];
            if (typeof value === 'string') {
                result.properties[key] = value;
            }
            else if (value) {
                result.events[key] = value;
            }
        }
        return result;
    }

    function createNodeFromNode(node, deep = false) {
        const type = node.nodeName;
        const properties = {};
        if (node instanceof Element) {
            for (const { name, value } of node.attributes) {
                properties[name] = value;
            }
            if ('value' in node) {
                properties.value = node.value;
            }
        }
        else if (node instanceof Comment || node instanceof Text) {
            properties.textContent = node.textContent || '';
        }
        const mapCallback = (child) => createNodeFromNode(child, deep);
        const children = deep ? [...node.childNodes].map(mapCallback) : [];
        return createNodeFromString(type, properties, children);
    }

    function createNode(base, propertiesOrChildrenOrTrim, childrenOrTrim, trim) {
        // create virdNode
        const virdNode = typeof base === 'string'
            ? createNodeFromString(base)
            : base instanceof Node
                ? createNodeFromNode(base, true)
                : cloneNode(base, { deep: true });
        // add properties
        if (typeof propertiesOrChildrenOrTrim === 'object' &&
            !Array.isArray(propertiesOrChildrenOrTrim)) {
            const { events, properties } = parseVirdProperties(propertiesOrChildrenOrTrim);
            virdNode.properties = Object.assign(Object.assign({}, virdNode.properties), properties);
            // add events
            for (const key of Object.keys(events)) {
                const value = events[key];
                if (typeof value === 'function') {
                    addVirdEvent(virdNode, key, value);
                }
                else {
                    addVirdEvent(virdNode, key, value.listener, value.options);
                }
            }
        }
        else if (propertiesOrChildrenOrTrim !== undefined) {
            childrenOrTrim = propertiesOrChildrenOrTrim;
        }
        // add children
        if (typeof childrenOrTrim === 'string') {
            const lastTypes = [virdNodeTypes.text, virdNodeTypes.comment];
            if (lastTypes.includes(virdNode.type)) {
                virdNode.properties.textContent = childrenOrTrim;
            }
            else {
                virdNode.children = [
                    createNodeFromString('#text', { textContent: childrenOrTrim })
                ];
            }
        }
        else if (Array.isArray(childrenOrTrim)) {
            virdNode.children = childrenOrTrim.map(stringOrVirdNode => {
                return typeof stringOrVirdNode === 'string'
                    ? createNodeFromString('#text', { textContent: stringOrVirdNode })
                    : stringOrVirdNode;
            });
        }
        else if (childrenOrTrim !== undefined) {
            trim = childrenOrTrim;
        }
        // trimming
        if (trim) {
            virdNode.children = virdNode.children.filter(child => {
                if (child.type === virdNodeTypes.comment)
                    return false;
                if (child.type === virdNodeTypes.text) {
                    if (child.properties.textContent === undefined)
                        return false;
                    if (!/^\s*$/.test(child.properties.textContent))
                        return false;
                }
                return true;
            });
        }
        return virdNode;
    }

    const reserves = [];

    function updateAttribute(element, name, value) {
        if (value != null) {
            const attrValue = Array.isArray(value) ? value.join(' ') : String(value);
            switch (name) {
                case 'value':
                    element.value = attrValue;
                    break;
                default:
                    element.setAttribute(name, attrValue);
                    break;
            }
        }
        else {
            element.removeAttribute(name);
        }
    }

    const virdDom = new WeakMap();
    const nodeMap = new WeakMap();

    function createElement(virdNode) {
        const element = document.createElement(virdNode.type);
        for (const name of Object.keys(virdNode.properties)) {
            updateAttribute(element, name, virdNode.properties[name]);
        }
        onEvent(element, virdNode);
        const clone = (virdNode) => cloneNode(virdNode, true);
        const cloneVirdNodes = virdNode.children.map(clone);
        const fragment = document.createDocumentFragment();
        for (const child of cloneVirdNodes) {
            const childNode = createRealNode(child);
            fragment.appendChild(childNode);
        }
        const renderingReserve = requestAnimationFrame(() => {
            element.appendChild(fragment);
            virdDom.set(element, cloneVirdNodes);
        });
        reserves.push(renderingReserve);
        return element;
    }
    /**
     * The createRealNode() function creates a node from VirdNode.
     * @param virdNode The VirdNode object from which it is created.
     */
    function createRealNode(virdNode) {
        let node;
        switch (virdNode.type) {
            case virdNodeTypes.text:
                node = document.createTextNode(virdNode.properties.textContent || '');
                break;
            case virdNodeTypes.comment:
                node = document.createComment(virdNode.properties.textContent || '');
                break;
            default:
                node = createElement(virdNode);
        }
        nodeMap.set(virdNode, node);
        return node;
    }

    /**
     * The diff () function gets the diff of an object.
     * @param checkObject An object to compare the differences.
     * @param comparisonObjet An object to compare.
     */
    function diff(checkObject, comparisonObjet) {
        const diffObject = {};
        if (checkObject !== comparisonObjet) {
            if (checkObject) {
                const checkObjectKey = Object.keys(checkObject);
                if (comparisonObjet) {
                    const comparisonObjetKey = Object.keys(comparisonObjet);
                    const keys = new Set([
                        ...checkObjectKey,
                        ...comparisonObjetKey
                    ]);
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
                    for (const key of checkObjectKey) {
                        const value = checkObject[key];
                        diffObject[key] = [value, undefined];
                    }
                }
            }
            else {
                if (comparisonObjet) {
                    const comparisonObjetKey = Object.keys(comparisonObjet);
                    for (const key of comparisonObjetKey) {
                        const value = comparisonObjet[key];
                        diffObject[key] = [undefined, value];
                    }
                }
            }
        }
        return diffObject;
    }

    function removeVirdDom(node) {
        virdDom.delete(node);
        for (const childNode of node.childNodes) {
            removeVirdDom(childNode);
        }
    }
    function diffRender(rootNode, newVirdNodes) {
        const oldVirdNodes = virdDom.get(rootNode) ||
            [...rootNode.childNodes].map(child => createNode(child));
        let index = 0;
        let newVirdNodeIndex = 0;
        let oldVirdNodeIndex = 0;
        const newVirdNodeLength = newVirdNodes.length;
        const oldVirdNodeLength = oldVirdNodes.length;
        const maxIndex = Math.max(newVirdNodeLength, oldVirdNodeLength);
        while (index < maxIndex) {
            const newVirdNode = newVirdNodes[newVirdNodeIndex];
            const oldVirdNode = oldVirdNodes[oldVirdNodeIndex];
            const oldNode = oldVirdNode && nodeMap.get(oldVirdNode);
            if (newVirdNode) {
                if (!oldVirdNode || oldVirdNode.type !== newVirdNode.type) {
                    const realNode = createRealNode(newVirdNode);
                    if (oldNode) {
                        removeVirdDom(oldNode);
                        const parent = oldNode.parentElement;
                        if (parent === rootNode) {
                            if (newVirdNodeLength > oldVirdNodeLength) {
                                parent.insertBefore(realNode, oldNode);
                                oldVirdNodeIndex--;
                            }
                            else if (newVirdNodeLength < oldVirdNodeLength) {
                                parent.removeChild(oldNode);
                                newVirdNodeIndex--;
                            }
                            else {
                                parent.replaceChild(realNode, oldNode);
                            }
                        }
                    }
                    else {
                        rootNode.appendChild(realNode);
                    }
                }
                else if (oldNode) {
                    nodeMap.delete(oldVirdNode);
                    nodeMap.set(newVirdNode, oldNode);
                    const diffProperties = diff(newVirdNode.properties, oldVirdNode.properties);
                    if (oldNode instanceof Element) {
                        for (const name of Object.keys(diffProperties)) {
                            const newValue = diffProperties[name];
                            const value = newValue && newValue[0];
                            updateAttribute(oldNode, name, value);
                        }
                        if (oldVirdNode) {
                            offEvent(oldNode, oldVirdNode);
                            clearVirdEvent(oldVirdNode);
                        }
                        onEvent(oldNode, newVirdNode);
                    }
                    else {
                        if (diffProperties.textContent) {
                            oldNode.textContent = diffProperties.textContent[0] || '';
                        }
                    }
                    diffRender(oldNode, newVirdNode.children);
                }
            }
            else if (oldNode) {
                const parent = oldNode.parentElement;
                if (parent) {
                    parent.removeChild(oldNode);
                }
            }
            index++;
            newVirdNodeIndex++;
            oldVirdNodeIndex++;
        }
        virdDom.set(rootNode, newVirdNodes);
    }

    function filterIgnoreVirdNode(virdNodes) {
        const result = [];
        for (const virdNode of virdNodes) {
            if (virdNode.type === virdNodeTypes.fragment) {
                const children = filterIgnoreVirdNode(virdNode.children);
                result.push(...children);
            }
            else {
                result.push(virdNode);
            }
        }
        return result;
    }
    /**
     * The render() function renders a VirdNode into a Dom.
     * @param rootNode A node to render.
     * @param virdNodes An array of VirdNode objects to render.
     */
    function render(rootNode, ...virdNodes) {
        for (const reserve of reserves) {
            cancelAnimationFrame(reserve);
        }
        reserves.length = 0;
        const newVirdNodeLength = virdNodes.length;
        if (newVirdNodeLength < 1)
            return;
        // Create a VirdNode for rendering.
        const clone = (virdNode) => cloneNode(virdNode, true);
        const cloneVirdNodes = virdNodes.map(clone);
        const newVirdNodes = filterIgnoreVirdNode(cloneVirdNodes);
        // rendering.
        diffRender(rootNode, newVirdNodes);
    }

    exports.cloneNode = cloneNode;
    exports.createNode = createNode;
    exports.render = render;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.umd.js.map
