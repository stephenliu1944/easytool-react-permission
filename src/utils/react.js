/* 
    $$typeof: Symbol(react.element)
    key: "1"
    props: {onClick: ƒ, children: Array(2)}
    ref: null
    type: "div"
    _owner: FiberNode {tag: 1, key: null, elementType: ƒ, type: ƒ, stateNode: _class, …}
    _store: {validated: false}
    _self: null
    _source: null
*/
export function isReactDOMElement(node) {
    return node && typeof node.type === 'string';
}

/* 
    $$typeof: Symbol(react.element)
    key: "1"
    props: {name: "stephen", children: Array(3)}
    ref: null
    type: ƒ MyComponent(props)
    _owner: FiberNode {tag: 1, key: null, elementType: ƒ, type: ƒ, stateNode: _class, …}
    _store: {validated: false}
    _self: null
    _source: null
*/
export function isReactComponentElement(node) {
    return node && typeof node.type === 'function';
}

/* 
    $$typeof: Symbol(react.element)
    key: null
    props: {name: "stephen", onClick: ƒ, children: Array(3)}
    ref: null
    type: ƒ _class()
    _owner: FiberNode {tag: 1, key: null, elementType: ƒ, type: ƒ, stateNode: _class, …}
    _store: {validated: false}
    _self: null
    _source: null
*/
export function isReactClass(node) {
    return isReactComponentElement(node) && node.type.name === '_class';
}

/* 
    $$typeof: Symbol(react.element)
    key: "1"
    props: {children: Array(3)}
    ref: null
    type: Symbol(react.fragment)
    _owner: FiberNode {tag: 1, key: null, elementType: ƒ, type: ƒ, stateNode: _class, …}
    _store: {validated: false}
    _self: null
    _source: null 
*/
export function isReactFragment(node) {    
    return node && node.type === Symbol.for('react.fragment');
}

/* 
    $$typeof: Symbol(react.portal)
    children: (3) [{…}, {…}, {…}]
    containerInfo: div#app2
    implementation: null
    key: null
*/
export function isReactPortal(node) {
    return node && typeof node.containerInfo === 'object';
}

export function isReactText(node) {
    return typeof node === 'string' || typeof node === 'number';
}

export function isReactEmpty(node) {
    return node === null || node === undefined || typeof node === 'boolean';
}
