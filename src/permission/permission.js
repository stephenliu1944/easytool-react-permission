import React, { Children } from 'react';
import { Status } from 'constants/enum';
import SetPermissionException from 'exceptions/SetPermissionException';
import { isEmpty, isPromise, trim } from 'utils/common';
import { isReactDOMElement, isReactComponentElement, isReactText, isReactEmpty } from 'utils/react';
import { formatPermissionValue } from 'utils/format';

var _userPermissions;
var _userPermissionsPromise;
var _updateComponentQueue = [];
var _defaults = {
    onDenied: null,
    transformData: null,
    comparePermission(requiredPermissions = [], userPermissions = []) {
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

function checkPermission(permissions, userPermissions) {
    // 必要的权限
    if (isEmpty(permissions)) {
        return true;
    }

    // 用户的权限
    if (isEmpty(userPermissions)) {
        return false;
    }

    var requiredPermissions = formatPermissionValue(permissions);

    return _defaults.comparePermission(requiredPermissions, userPermissions);
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
function filterPermission(element, userPermissions, onDenied, index) {
    if (!element) {
        return;
    }

    // 只处理 DOMElement 和 ComponentElement
    if (isReactDOMElement(element) || isReactComponentElement(element)) {
        var permission = element.props['data-permission'] || element.props['data-permissions'] || element.props['permission'] || element.props['permissions'];
        
        // TODO: 返回缺失的权限数组
        if (checkPermission(permission, userPermissions)) {
            let newChildren = [];
            let { children } = element.props;

            if (children) {
                Children.forEach(children, (child, _index) => {
                    let checkedChild = filterPermission(child, userPermissions, onDenied, _index);
                    checkedChild && newChildren.push(checkedChild);
                });
            }
            
            // children 为数组时 react会检测 key 是否为空, 为空会报警告.
            if (newChildren.length === 0) {
                newChildren = null;
            } else if (newChildren.length === 1) {
                newChildren = newChildren[0];
            }

            // cloneElement(element, props, children), 第二个, 第三个参数用于覆盖拷贝的 element 属性, 如果不输入默认使用原 element 的.
            // key and ref from the original element will be preserved. 第二个参数可以覆盖 key 和 ref.
            let newElement = React.cloneElement(element, { 
                key: element.key || index 
            }, newChildren);    
            // 返回权限过滤后的元素. 
            return newElement;
        } 
        
        return handleDeniedHook(permission, element, onDenied);
    } 
    // 其他元素类型暂不处理
    return element;
}

function updateComponents(componentQueue = []) {
    var component;
    while (component = componentQueue.shift()) {
        component.forceUpdate();
    }
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

    // 为 null 表示用户不想使用回调, 包括默认的 onDenied
    if (!_onDenied && _onDenied !== null) {
        _onDenied = _defaults.onDenied;
    }

    return function(WrappedComponent) {
        
        return class extends WrappedComponent {
            
            componentDidMount() {
                super.componentDidMount && super.componentDidMount();
                // 如果 _userPermissionsPromise 存在说明 Promise 还是 pending 状态.
                // TODO: 目前只能延迟刷新 Class Component, 考虑纯函数组件: Hooks 和 stateless Component
                if (!_userPermissions && _userPermissionsPromise) {
                    _updateComponentQueue.push(this);
                }
            }

            componentWillUnmount() {
                super.componentWillUnmount && super.componentWillUnmount();
                
                // 组件被销毁时, 从更新队列中移除
                var index = _updateComponentQueue.findIndex((component) => component === this);
                if (index !== -1) {
                    _updateComponentQueue.splice(index, 1);
                }
            }

            render() {
                var newElement = null;
                // 校验当前 Component 是否满足权限
                var status = checkPermission(_permissions, _userPermissions) ? Status.AUTHORIZED : Status.DENIED;

                switch (status) {
                    case Status.AUTHORIZED: // 认证通过
                        var originElement = super.render();       
                        // 校验子组件是否满足权限
                        newElement = filterPermission(originElement, _userPermissions, _onDenied);
                        break;
                    case Status.DENIED:     // 拒绝
                        // 调用 denied 回调方法
                        newElement = handleDeniedHook(_permissions, this, _onDenied);
                        break;
                }
                
                return newElement || null;  // 不能返回 undefined, 要报错.
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
    if (permissions) {
        _userPermissions = handleUserPermissions(permissions);
    }
};

// lazy load
permission.setUserPermissionsAsync = function(permissions) {
    if (isPromise(permissions)) {
        _userPermissionsPromise = permissions;
        _userPermissionsPromise.then((data) => {
            permission.setUserPermissions(data);
            // 拿到用户权限后刷新队列里的组件, 重新检测权限
            updateComponents(_updateComponentQueue);
        }, (error) => {
            _userPermissions = null;
            _userPermissionsPromise = null;
            _updateComponentQueue = [];
            throw new SetPermissionException(error);
        // 接收数据后清除 _userPermissionsPromise
        }).finally(() => {
            _userPermissionsPromise = null;
        });
    } 
};

permission.getUserPermissions = function() {
    return _userPermissions;
};

permission.getUserPermissionsAsync = function(cb) {
    if (_userPermissionsPromise) {
        _userPermissionsPromise.then((data) => {
            permission.setUserPermissions(data);
            cb(_userPermissions);
        }, cb);
    } else {
        cb(_userPermissions);
    }
};