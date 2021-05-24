import React from 'react';
/**
 * COPY from https://github1s.com/facebook/react/blob/HEAD/fixtures/legacy-jsx-runtimes/react-16/cjs/react-jsx-runtime.development.js
 * 参考 https://stackoverflow.com/questions/33199959/how-to-detect-a-react-component-vs-a-react-element
 */ 
// ATTENTION
// When adding new symbols to this file,
// Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
// 兼容性处理
let REACT_ELEMENT_TYPE = 0xeac7;
let REACT_PORTAL_TYPE = 0xeaca;
let FRAGMENT_TYPE = 0xeacb;
let REACT_STRICT_MODE_TYPE = 0xeacc;
let REACT_PROFILER_TYPE = 0xead2;
let REACT_PROVIDER_TYPE = 0xeacd;
let REACT_CONTEXT_TYPE = 0xeace;
let REACT_FORWARD_REF_TYPE = 0xead0;
let REACT_SUSPENSE_TYPE = 0xead1;
let REACT_SUSPENSE_LIST_TYPE = 0xead8;
let REACT_MEMO_TYPE = 0xead3;
let REACT_LAZY_TYPE = 0xead4;
let REACT_BLOCK_TYPE = 0xead9;
let REACT_SERVER_BLOCK_TYPE = 0xeada;
let REACT_FUNDAMENTAL_TYPE = 0xead5;
let REACT_SCOPE_TYPE = 0xead7;
let REACT_OPAQUE_ID_TYPE = 0xeae0;
let REACT_DEBUG_TRACING_MODE_TYPE = 0xeae1;
let REACT_OFFSCREEN_TYPE = 0xeae2;
let REACT_LEGACY_HIDDEN_TYPE = 0xeae3;

if (typeof Symbol === 'function' && Symbol.for) {
    const symbolFor = Symbol.for;
    REACT_ELEMENT_TYPE = symbolFor('react.element');
    REACT_PORTAL_TYPE = symbolFor('react.portal');
    FRAGMENT_TYPE = symbolFor('react.fragment');
    REACT_STRICT_MODE_TYPE = symbolFor('react.strict_mode');
    REACT_PROFILER_TYPE = symbolFor('react.profiler');
    REACT_PROVIDER_TYPE = symbolFor('react.provider');
    REACT_CONTEXT_TYPE = symbolFor('react.context');
    REACT_FORWARD_REF_TYPE = symbolFor('react.forward_ref');
    REACT_SUSPENSE_TYPE = symbolFor('react.suspense');
    REACT_SUSPENSE_LIST_TYPE = symbolFor('react.suspense_list');
    REACT_MEMO_TYPE = symbolFor('react.memo');
    REACT_LAZY_TYPE = symbolFor('react.lazy');
    REACT_BLOCK_TYPE = symbolFor('react.block');
    REACT_SERVER_BLOCK_TYPE = symbolFor('react.server.block');
    REACT_FUNDAMENTAL_TYPE = symbolFor('react.fundamental');
    REACT_SCOPE_TYPE = symbolFor('react.scope');
    REACT_OPAQUE_ID_TYPE = symbolFor('react.opaque.id');
    REACT_DEBUG_TRACING_MODE_TYPE = symbolFor('react.debug_trace_mode');
    REACT_OFFSCREEN_TYPE = symbolFor('react.offscreen');
    REACT_LEGACY_HIDDEN_TYPE = symbolFor('react.legacy_hidden');
}

export function isReactEmpty(node) {
    return node === null || node === undefined || typeof node === 'boolean';
}

export function isReactText(node) {
    return typeof node === 'string' || typeof node === 'number';
}

/* 
    $$typeof: Symbol(react.portal)
*/
export function isReactPortal(node) {
    return node?.$$typeof === REACT_PORTAL_TYPE;
}

/* 
    $$typeof: Symbol(react.element)
*/
export function isReactElement(node) {
    return React.isValidElement(node) && node?.$$typeof === REACT_ELEMENT_TYPE;
}

/* 
    $$typeof: Symbol(react.element)
    type: "div"
*/
export function isReactDOMElement(node) {
    return isReactElement(node) && typeof node.type === 'string';
}

// fragment, suspense
export function isReactWrapper(node) {
    return isReactElement(node) && (typeof node.type === 'symbol' || typeof node.type === 'number');  // number 用于兼容IE
}

// memo, forward_ref, lazy
export function isReactHOC(node) {    
    return isReactElement(node) && typeof node.type === 'object';
}

// classComponent, functionComponent
export function isReactComponent(node) {
    return isReactElement(node) && typeof node.type === 'function';
}

/* 
    $$typeof: Symbol(react.element)
    key: "1"
    props: {children: Array(3)}
    ref: null
    type: Symbol(react.fragment)
    _owner: FiberNode {tag: 1, key: null, elementType: ƒ, type: ƒ, stateNode: _class, …}
    _store: {validated: false}
*/
export function isReactFragment(node) {    
    return isReactWrapper(node) && node.type === FRAGMENT_TYPE;
}

/* 
    $$typeof: Symbol(react.element)
    key: null
    props: {fallback: {…}}
    ref: null
    type: Symbol(react.suspense)
    _owner: FiberNode {tag: 1, key: null, stateNode: Root2, elementType: ƒ, type: ƒ, …}
    _store: {validated: true}
*/
export function isReactSuspense(node) {    
    return isReactWrapper(node) && node.type === REACT_SUSPENSE_TYPE;
}

/* 
    $$typeof: Symbol(react.element)
    key: "1"
    props: {name: "stephen", children: Array(3)}
    ref: null
    type: ƒ MyComponent(props)
    _owner: FiberNode {tag: 1, key: null, elementType: ƒ, type: ƒ, stateNode: _class, …}
    _store: {validated: false}
*/
export function isReactFunctionComponent(node) {
    return isReactComponent(node) && !node.type.prototype.isReactComponent;
}

/* 
    $$typeof: Symbol(react.element)
    key: null
    props: {name: "stephen", onClick: ƒ, children: Array(3)}
    ref: null
    type: ƒ CC()
        name: "CC"
        prototype: Component
        componentDidMount: ƒ componentDidMount()
        constructor: ƒ CC()
        isMounted: (...)
        render: ƒ render()
        replaceState: (...)
        __proto__: Object
            forceUpdate: ƒ (callback)
            isReactComponent: {}        // 通过该属性判断
            setState: ƒ (partialState, callback)
            constructor: ƒ Component(props, context, updater)
            isMounted: (...)
            replaceState: (...)
    _owner: FiberNode {tag: 1, key: null, elementType: ƒ, type: ƒ, stateNode: _class, …}
    _store: {validated: false}
*/
export function isReactClassComponent(node) {
    return isReactComponent(node) && !!node.type.prototype.isReactComponent;
}

/*     
    $$typeof: Symbol(react.element)
    key: null
    props: {permission: "3", type: "primary", children: "Primary Button"}
    ref: null
    type: {
        $$typeof: Symbol(react.forward_ref)
        Group: ƒ ButtonGroup(props)
        displayName: "Button"
        render: ƒ InternalButton(props, ref)    
    }
*/
export function isReactForwardRef(node) {
    return isReactHOC(node) && node.type.$$typeof === REACT_FORWARD_REF_TYPE;
}

/*
    $$typeof: Symbol(react.element)
    key: null
    props: {permission: "3"}
    ref: null
    type: {
        $$typeof: Symbol(react.memo)
        compare: null
        type: ƒ (props)
    }
*/ 
export function isReactMemo(node) {
    return isReactHOC(node) && node.type.$$typeof === REACT_MEMO_TYPE;
}

/* 
    $$typeof: Symbol(react.element)
    key: null
    props: {permission: "3", children: {…}}
    ref: null
    type: {
        $$typeof: Symbol(react.lazy)
        _ctor: ƒ ()
        _result: null
        _status: -1
        defaultProps: (...)
        propTypes: (...)
        get defaultProps: ƒ ()
        set defaultProps: ƒ (newDefaultProps)
        get propTypes: ƒ ()
        set propTypes: ƒ (newPropTypes)
        __proto__: Object
        _owner: FiberNode {tag: 1, key: null, stateNode: Root2, elementType: ƒ, type: ƒ, …}
        _store: {validated: true} 
    }
*/
export function isReactLazy(node) {
    return isReactHOC(node) && node.type.$$typeof === REACT_LAZY_TYPE;
}