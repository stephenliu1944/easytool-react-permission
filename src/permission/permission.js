import React, { Children } from 'react';
import { isArray, isString, isNumber, isEmpty, trim } from 'utils/common';

var _ownPermissions = [];

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

function validatePermission(permissions) {
    if (isEmpty(permissions)) {
        return true;
    }

    if (isEmpty(_ownPermissions)) {
        return false;
    }

    var requiredPermissions = formatPermissionValue(permissions);

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

function checkPermission(element) {
    // TODO: 可配置权限属性
    var requiredPermissions = element.props['data-permission'] || element.props['permission'];
    var allow = validatePermission(requiredPermissions);

    return allow;
}

function filterPermission(element) {
    if (!element) {
        return;
    }

    if (isReactDOMElement(element)) {
        if (checkPermission(element)) {
            let newChildren;
            let { children } = element.props;

            if (children) {
                newChildren = [];
                Children.forEach(children, (child) => {
                    let checkedChild = filterPermission(child);
                    checkedChild && newChildren.push(checkedChild);
                });
            }
    
            return React.cloneElement(element, null, newChildren);
        // 没权限, 被忽略掉
        } 
        return;
         
    } else if (isReactComponentElement(element)) {
        // 组件类型判断不了子元素
        if (checkPermission(element)) {
            return element;
        // 没权限, 被忽略掉
        } 
        return;
        
    // 其他元素类型暂不处理
    } 
    return element;

}

export function setOwnPermissions(permissions) {
    _ownPermissions = formatPermissionValue(permissions);
}

export function permission(options = {}) {

    return function(WrappedComponent) {
        return class extends WrappedComponent {
            render() {
                var element = super.render();
                var newElement = filterPermission(element);

                return newElement;
            }
        };
    };
}