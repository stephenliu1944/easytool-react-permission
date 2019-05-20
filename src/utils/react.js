export function isReactDOMElement(node) {
    return node && typeof node.type === 'string';
}

export function isReactComponentElement(node) {
    return node && typeof node.type === 'function';
}

export function isReactText(node) {
    return typeof node === 'string' || typeof node === 'number';
}

export function isReactEmpty(node) {
    return node === null || node === undefined || typeof node === 'boolean';
}