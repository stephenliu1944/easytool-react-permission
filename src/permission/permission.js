import React, { Children } from 'react';
import { Status } from 'constants/enum';
import SetPermissionException from 'exceptions/SetPermissionException';
import { isEmpty, isPromise, trim } from 'utils/common';
import { isReactDOMElement, isReactComponentElement, isReactText, isReactEmpty } from 'utils/react';
import { formatPermissionValue } from 'utils/format';

var _userPermissions = [];
var _updateComponentQueue = [];
var _defaults = {
    onDenied: null,
    transformData: null,
    comparePermission(requiredPermissions, userPermissions) {
        for (let i = 0; i < requiredPermissions.length; i++) {
            let requiredPermission = requiredPermissions[i];
    
            // Compare permission
            let allow = userPermissions.some((userPermission) => {
                return trim(requiredPermission) == trim(userPermission);
            });
    
            if (!allow) {
                return false;
            }
        }
    
        return true;
    }
};

function checkPermission(permissions) {
    if (isEmpty(permissions)) {
        return true;
    }

    if (isEmpty(_userPermissions) || isPromise(_userPermissions)) {
        return false;
    }

    var requiredPermissions = formatPermissionValue(permissions);

    return _defaults.comparePermission(requiredPermissions, _userPermissions);
}

// 接收到用户的权限数据后进行处理
function handleUserPermissions(data) {
    var _permissions;
            
    if (_defaults.transformData) {
        _permissions = _defaults.transformData(data);
    } else {
        _permissions = data;
    }
    
    // 加载完后 _userPermissions 由 Promise 转为真正的权限列表
    return formatPermissionValue(_permissions);
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
        var permission = element.props['data-permission'] || element.props['data-permissions'] || element.props['permission'] || element.props['permissions'];

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

export function permission(permissions, onDenied) {
    var _permissions;
    var _onDenied;

    // 当前组件无必要权限, 只校验子组件.
    if (typeof permissions === 'function' && arguments.length === 1) {
        _onDenied = permissions;
    } else {
        _permissions = permissions;
        _onDenied = onDenied;
    }

    // 为 null 表示用户不想使用回调
    if (!_onDenied && _onDenied !== null) {
        _onDenied = _defaults.onDenied;
    }

    return function(WrappedComponent) {

        return class extends WrappedComponent {
            
            componentDidMount() {
                super.componentDidMount && super.componentDidMount();
                // 如果是 promise 则加入更新队列
                if (isPromise(_userPermissions)) {
                    _updateComponentQueue.push(this);
                }
            }

            // TODO: 销毁时清除内存占用
            // componentWillUnmount() {}

            render() {
                var newElement = null;
                // 校验当前 Component 是否满足权限
                var status = checkPermission(_permissions) ? Status.AUTHORIZED : Status.DENIED;

                switch (status) {
                    case Status.AUTHORIZED: // 认证通过
                        var originElement = super.render();                        
                        // 校验子组件是否满足权限
                        newElement = filterPermission(originElement, _onDenied);
                        break;
                    case Status.DENIED:     // 拒绝
                        // 调用 denied 回调方法
                        newElement = handleDeniedHook(_permissions, this, _onDenied);
                        break;
                }

                return newElement;
            }
        };
    };
}

// 设置默认配置
permission.settings = function(options) {
    Object.assign(_defaults, options); 
};

// 设置用户权限
permission.setUserPermissions = function(permissions) {
    // lazy load
    if (isPromise(permissions)) {
        _userPermissions = permissions;
        _userPermissions.then(function(data) {
            // 注意此处 _userPermissions 从 Promise 转为了真正的权限数据
            _userPermissions = handleUserPermissions(data);

            var component;
            while (component = _updateComponentQueue.shift()) {
                component.forceUpdate();
            }
        }, function(error) {
            _userPermissions = [];
            _updateComponentQueue = [];
            throw new SetPermissionException(error);
        });
    } else {
        _userPermissions = handleUserPermissions(permissions);
    }
};

permission.getUserPermissions = function() {
    return _userPermissions;
};