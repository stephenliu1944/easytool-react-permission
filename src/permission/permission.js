import React, { Children } from 'react';
import { UserStatus, CheckStatus } from 'constants/enum';
import SetPermissionException from 'exceptions/SetPermissionException';
import { isEmpty, isNotEmpty, isArray, isPromise, trim } from 'utils/common';
import { isReactDOMElement, isReactComponentElement, isReactClass, isReactFragment, isReactPortal } from 'utils/react';
import { formatPermissionValue } from 'utils/format';

var _userStatus = UserStatus.UNSET;
var _userPromise;
var _userPermissions;
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
// 生成一个key
function generateKey(element, index = 0) {
    var key = '';

    if (isReactDOMElement(element)) {
        key = element.type;
    } else if (isReactComponentElement(element)) {
        key = element.type.name;
    }
    // TODO: key有点多余, 先这样吧
    return `permission__${index}`;
}

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
// TODO: index 默认值为0可能有问题
function handleDeniedHook(permission, element, onDenied, index = 0) {
    // 用户权限还未加载完成, 默认隐藏所有元素不显示, 不执行 onDenied 方法
    if (_userStatus !== UserStatus.DONE) {
        return;
    }

    // TODO: 这里可能会有性能问题, 如果 onDenied 方法直接执行页面跳转, 可能来不及清除内存占用.
    var newElement = onDenied && onDenied(permission, element, index);

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
    
    // 处理 DOMElement, ComponentElement, ClassElement
    if (isReactDOMElement(element) 
            || isReactComponentElement(element)
            || isReactClass(element)) {
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
            // 确保 newChildren 和 children 数据类型保持一致(object 或 array), 如果类型被修改, 
            // 会导致 react 以为子组件被替换了, 将卸载已 render 的子组件(componentWillUnmount)并且重新渲染新的子组件(componentDidMount).
            } else if (newChildren.length === 1 && children.length === 1) {
                newChildren = newChildren[0];
            }

            // cloneElement(element, props, children), 第二个, 第三个参数用于覆盖拷贝的 element 属性, 如果不输入默认使用原 element 的.
            // key and ref from the original element will be preserved. 第二个参数可以覆盖 key 和 ref.
            let newElement = React.cloneElement(element, {
                key: element.key || generateKey(element, index)       
            }, newChildren);    

            // 返回权限过滤后的元素. 
            return newElement;
        } 
        
        return handleDeniedHook(permission, element, onDenied, index);
    // 处理 Array
    } else if (isArray(element)
            || isReactFragment(element)
            || isReactPortal(element)) {
        
        let _children = element?.props?.children || element.children || element;

        return Children.map(_children, (el, _index) => filterPermission(el, userPermissions, onDenied, _index));
    }
    // 其他元素类型暂不处理
    return element;
}

function updateQueue(componentQueue = []) {
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
                // TODO: 目前只能延迟刷新 Class Component, 考虑纯函数组件: Hooks 和 stateless Component
                // 用户权限未加载完成时将组件加入刷新队列, 待用户权限加载后重新校验.
                if (_userStatus !== UserStatus.DONE) {
                    _updateComponentQueue.push(this);
                }
            }

            componentWillUnmount() {
                // 组件被销毁时, 从更新队列中移除
                var index = _updateComponentQueue.findIndex((component) => component === this);
                if (index !== -1) {
                    _updateComponentQueue.splice(index, 1);
                }

                super.componentWillUnmount && super.componentWillUnmount();
            }

            render() {
                var newElement = null;
                var { AUTHORIZED, DENIED } = CheckStatus;
                // 校验当前 Component 是否满足权限
                var status = checkPermission(_permissions, _userPermissions) ? AUTHORIZED : DENIED;
                
                switch (status) {
                    case AUTHORIZED: // 认证通过
                        var originElement = super.render();   
                        // 校验子组件是否满足权限
                        newElement = filterPermission(originElement, _userPermissions, _onDenied);                        
                        break;
                    case DENIED:     // 拒绝
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
permission.setGlobalPermissions = function(permissions) {
    _userPermissions = handleUserPermissions(permissions);
    // 用户权限设置完成
    _userStatus = UserStatus.DONE;
    // 拿到用户权限后刷新队列里的组件, 重新检测它们的权限
    if (isNotEmpty(_updateComponentQueue)) {
        updateQueue(_updateComponentQueue);
    }
};

// lazy load
permission.setGlobalPermissionsPromise = function(permissionPromise) {
    if (isPromise(permissionPromise)) {
        _userPromise = permissionPromise;
        // 用户权限状态改为 pending 状态
        _userStatus = UserStatus.PENDING;

        _userPromise.then((data) => {
            permission.setGlobalPermissions(data);
        }, (error) => {
            // 设置出错恢复到未设置状态
            _userStatus = UserStatus.ERROR;
            _userPermissions = null;
            throw new SetPermissionException(error);
        }).finally(() => {
            // 接收数据后清除 _userPromise
            _userPromise = null;
        });
    } 
};

permission.getGlobalPermissions = function() {
    return _userPermissions;
};

permission.getGlobalPermissionsPromise = function() {
    return new Promise((resolve, reject) => {
        // 延迟到下一个宏任务执行, 确保异步保存可以拿到数据
        setTimeout(() => {
            if (_userPromise) {
                _userPromise.then(data => resolve(handleUserPermissions(data)), reject);
            } else {
                resolve(_userPermissions);
            }
        }, 0);
    });
};