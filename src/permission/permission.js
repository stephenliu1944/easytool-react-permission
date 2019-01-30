import React, { Children } from 'react';
import { Status } from 'constants/enum';
import SetPermissionException from 'exceptions/SetPermissionException';
import { isArray, isString, isNumber, isEmpty, trim } from 'utils/common';

var _ownPermissions = [];
var _updateComponentQueue = [];
    
function isPromise(obj) {
    return typeof obj === 'object' && obj.then && obj.catch && obj.finally;
}

function isReactDOMElement(node) {
    return node && typeof node.type === 'string';
}

function isReactComponentElement(node) {
    return node && typeof node.type === 'function';
}

function isReactText(node) {
    return typeof node === 'string' || typeof node === 'number';
}

function isReactEmpty(node) {
    return node === null || node === undefined || typeof node === 'boolean';
}

function formatPermissionValue(value) {
    var permissions = [];

    if (isArray(value)) {
        permissions = value;
    } else if (isNumber(value)) {
        permissions.push(value);
    } else if (isString(value)) {
        if (value.includes(',')) {
            // TODO: 移除开头和结尾的 ","
            permissions = value.split(',');
        } else {
            permissions.push(value);
        }
    }

    return permissions;
}

function checkPermission(permissions) {
    if (isEmpty(permissions)) {
        return true;
    }

    if (isEmpty(_ownPermissions) || isPromise(_ownPermissions)) {
        return false;
    }

    var requiredPermissions = formatPermissionValue(permissions);

    // TODO: 可自定义校验规则
    for (let i = 0; i < requiredPermissions.length; i++) {
        let requiredPermission = requiredPermissions[i];

        // Compare permission
        let allow = _ownPermissions.some((ownPermission) => {
            return trim(requiredPermission) == trim(ownPermission);
        });

        if (!allow) {
            return false;
        }
    }

    return true;
}

function handleDeniedHook(permission, element, onDenied) {
    var newElement = onDenied && onDenied(permission, element);

    if (React.isValidElement(newElement)) {
        return newElement;
    }

    return;
}

// 递归遍历 Virtual Tree
function filterPermission(element, onDenied) {
    if (!element) {
        return;
    }

    // 只处理 DOMElement 和 ComponentElement
    if (isReactDOMElement(element) || isReactComponentElement(element)) {
        var permission = element.props['data-permission'] || element.props['permission'];

        if (checkPermission(permission)) {
            let { children } = element.props;
            let newChildren;

            if (children) {
                newChildren = [];
                Children.forEach(children, (child) => {
                    let checkedChild = filterPermission(child, onDenied);
                    checkedChild && newChildren.push(checkedChild);
                });
            }
            // 返回权限过滤后的元素
            return React.cloneElement(element, null, newChildren);
        } 
        
        return handleDeniedHook(permission, element, onDenied);
    } 
    // 其他元素类型暂不处理
    return element;
}

export function setOwnPermissions(permissions) {
    // lazy load
    if (isPromise(permissions)) {
        _ownPermissions = permissions;
        _ownPermissions.then(function(_permissions) {
            _ownPermissions = formatPermissionValue(_permissions);
            // update components 
            _updateComponentQueue.forEach(component => component.forceUpdate());
        }, function(error) {
            _ownPermissions = [];
            _updateComponentQueue = [];
            throw new SetPermissionException(error);
        });
    } else {
        _ownPermissions = formatPermissionValue(permissions);
    }
}

export function permission(permissions, onDenied) {
    if (typeof permissions === 'function' && arguments.length === 1) {
        onDenied = permissions;
        permissions = null;
    }

    return function(WrappedComponent) {

        return class extends WrappedComponent {
            
            componentDidMount() {
                super.componentDidMount && super.componentDidMount();
                // 如果是 promise 则加入更新队列
                if (isPromise(_ownPermissions)) {
                    _updateComponentQueue.push(this);
                }
            }

            render() {
                var newElement = null;
                var status = checkPermission(permissions) ? Status.AUTHORIZED : Status.DENIED;

                switch (status) {
                    case Status.AUTHORIZED:
                        var originElement = super.render();                        
                        newElement = filterPermission(originElement, onDenied);
                        break;
                    case Status.DENIED:
                        newElement = handleDeniedHook(permissions, this, onDenied);
                        break;
                }

                return newElement;
            }
        };
    };
}