var vird = (function (exports) {
    'use strict';

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
    function getVirdEventMap(virdNode) {
        const result = {};
        const eventListenerMap = virdEventListenerMap.get(virdNode);
        if (eventListenerMap) {
            for (const [key, listeners] of eventListenerMap) {
                result[key] = [];
                for (const listener of listeners) {
                    const options = listenerOptionsMap.get(listener);
                    result[key].push({ listener, options });
                }
            }
        }
        return result;
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

    function createRealNode(virdNode) {
        switch (virdNode.type) {
            case virdNodeTypes.text:
                return document.createTextNode(virdNode.properties.textContent || '');
            case virdNodeTypes.comment:
                return document.createComment(virdNode.properties.textContent || '');
            default:
                return document.createElement(virdNode.type);
        }
    }

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

    const beforeVirdNodes = new WeakMap();
    const nodeMap = new WeakMap();
    function diffRender(rootNode, newVirdNodes) {
        const oldVirdNodes = beforeVirdNodes.get(rootNode) ||
            [...rootNode.childNodes].map(child => createNode(child));
        beforeVirdNodes.set(rootNode, newVirdNodes);
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
                let nextNode = oldNode;
                if (!oldVirdNode || oldVirdNode.type !== newVirdNode.type) {
                    const realNode = createRealNode(newVirdNode);
                    nextNode = realNode;
                    if (oldNode) {
                        beforeVirdNodes.delete(oldNode);
                        if (newVirdNodeLength > oldVirdNodeLength) {
                            rootNode.insertBefore(realNode, oldNode);
                            oldVirdNodeIndex--;
                        }
                        else if (newVirdNodeLength < oldVirdNodeLength) {
                            rootNode.removeChild(oldNode);
                            newVirdNodeIndex--;
                        }
                        else {
                            rootNode.replaceChild(realNode, oldNode);
                        }
                    }
                    else {
                        rootNode.appendChild(realNode);
                    }
                }
                if (nextNode) {
                    nodeMap.set(newVirdNode, nextNode);
                    const diffProperties = diff(newVirdNode.properties, oldVirdNode && oldVirdNode.properties);
                    if (nextNode instanceof Element) {
                        for (const name of Object.keys(diffProperties)) {
                            const newValue = diffProperties[name];
                            const value = newValue && newValue[0];
                            if (value) {
                                nextNode.setAttribute(name, value);
                            }
                            else {
                                nextNode.removeAttribute(name);
                            }
                        }
                        if (oldVirdNode) {
                            const oldEventMap = getVirdEventMap(oldVirdNode);
                            for (const name of Object.keys(oldEventMap)) {
                                const eventMap = oldEventMap[name];
                                for (const { listener } of eventMap) {
                                    nextNode.removeEventListener(name, listener);
                                }
                            }
                        }
                        const oldEventMap = getVirdEventMap(newVirdNode);
                        for (const name of Object.keys(oldEventMap)) {
                            const eventMap = oldEventMap[name];
                            for (const { listener, options } of eventMap) {
                                nextNode.addEventListener(name, listener, options);
                            }
                        }
                    }
                    else {
                        if (diffProperties.textContent) {
                            nextNode.textContent = diffProperties.textContent[0] || '';
                        }
                    }
                    diffRender(nextNode, newVirdNode.children);
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
    function render(rootNode, ...virdNodes) {
        const newVirdNodeLength = virdNodes.length;
        if (newVirdNodeLength < 1)
            return;
        // Create a VirdNode for rendering.
        const clone = (virdNode) => cloneNode(virdNode, true);
        const newVirdNodes = filterIgnoreVirdNode(virdNodes).map(clone);
        // rendering.
        diffRender(rootNode, newVirdNodes);
    }

    exports.cloneNode = cloneNode;
    exports.createNode = createNode;
    exports.render = render;

    return exports;

}({}));
//# sourceMappingURL=index.iife.js.map
