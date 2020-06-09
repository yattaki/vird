function createText(text) {
    const type = '#text';
    const properties = { textContent: text };
    const children = [];
    return { type, properties, children };
}
function createComment(comment) {
    const type = '#comment';
    const properties = { textContent: comment };
    const children = [];
    return { type, properties, children };
}
function createFragment(...children) {
    const type = '#document-fragment';
    const properties = {};
    return { type, properties, children };
}
function createNode(type, properties, children) {
    if (!properties || typeof properties === 'string' || Array.isArray(properties)) {
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

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createText: createText,
    createFragment: createFragment,
    createNode: createNode,
    createComment: createComment
});

function createNode$1(node) {
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
    const children = [...node.childNodes].map(node => createNode$1(node));
    return createNode(type, properties, children);
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const diff = (checkObject, comparisonObjet) => {
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
};

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
    renderDom(node) {
        const virdNodes = [...node.childNodes].map(node => createNode$1(node));
        return this.render(node, ...virdNodes);
    }
    createDispatcher(node) {
        return (beforeCallback) => __awaiter(this, void 0, void 0, function* () {
            if (beforeCallback) {
                yield beforeCallback();
            }
            const virdNodes = this._renderMap.get(node);
            if (virdNodes) {
                this.render(node, ...virdNodes);
            }
        });
    }
    createEffect(node, effect, initValue) {
        const dispatcher = this.createDispatcher(node);
        return {
            value: initValue,
            setEffect(value) {
                dispatcher(() => __awaiter(this, void 0, void 0, function* () { this.value = yield effect(value); }));
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

var index$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Renderer: Renderer,
    renderer: renderer,
    createNode: createNode$1
});

export { index as Vird, index$1 as VirdDom };
//# sourceMappingURL=index.js.map
