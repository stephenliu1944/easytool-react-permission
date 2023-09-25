import PropTypes from 'prop-types';
import React, { Children, useState, useEffect, useContext } from 'react';
import { isEmpty, isArray, isPromise, trim } from 'Utils/common';
import { isReactElement } from 'Utils/react';
import { formatPermission } from 'Utils/format';
import { PermissionContext } from '../context';

// 生成一个key
function generateKey(element, index = 0) {
    // var key = '';

    // if (isReactDOMElement(element)) {
    //     key = element.type;
    // } else if (isReactComponentElement(element)) {
    //     key = element.type.name;
    // }
    // TODO: key有点多余, 先这样吧
    return `permission__${index}`;
}

function comparePermission(elementPermission = [], hasPermission = []) {
    if (elementPermission.length === 0) {
        return true;
    }
    
    if (elementPermission.length > hasPermission.length) {
        return false;
    }

    for (let i = 0; i < elementPermission.length; i++) {
        let requiredPermission = elementPermission[i];

        // Compare permission
        let allow = hasPermission.some((userPermission) => {
            return trim(requiredPermission) == trim(userPermission);
        });

        if (!allow) {
            return false;
        }
    }

    return true;
}

// 递归遍历 Virtual Tree, 首次是 Permission.props.children, 然后根据用户自定义来
function filterChildren(element, hasPermission, props, index = 0) {
    if (!element) {
        return null;
    }
    // isReactDOMElement: DOMElement.
    // isReactComponent: classComponent, functionComponent, portal.
    // isReactWrapper: fragment, suspense.
    // isReactHOC: memo, lazy, forward_ref.
    // if (isReactDOMElement(element) || isReactComponent(element) || isReactWrapper(element) || isReactHOC(element)) {
    if (isReactElement(element)) {
        if (checkElementPermission(element, hasPermission, props)) {
            // TODO: element没有子元素, 说明是通过 props 传递的.
            let { children } = element.props;
            
            if (Children.count(children) === 0) {
                return element;
            }
            
            let validChildren = filterChildren(children, hasPermission, props, index);
            let newChildren = handleChildren(validChildren, children);
            // cloneElement(element, props, children), 第二个, 第三个参数用于覆盖拷贝的 element 属性, 如果不输入默认使用原 element 的.
            // key and ref from the original element will be preserved.
            let newElement = React.cloneElement(element, {
                key: element.key || generateKey(element, index)       
            }, newChildren);    

            // 返回权限过滤后的元素. 
            return newElement;
        } 
        // 如果用户权限还未加载完成, 默认隐藏所有元素不显示, 不执行 onDeny 方法
        // isEmpty(permission) && isPromise(hasPermission) 表示当前用户权限为 pending 状态
        if (isEmpty(hasPermission) && isPromise(props.hasPermission)) {
            return null;
        }

        let onDeny = getPropertyValueByNames(element, ['onDeny', 'deny', 'data-ondeny', 'data-deny']);
        return handleDeny(element, onDeny || props.onDeny, index);
    // 处理 Array
    } else if (isArray(element)) {
        let validChildren = [];     // 有效的子元素

        // 这里筛选出有效的子元素
        Children.forEach(element, (child, _index) => {
            // checkedChild 已校验过的子元素
            let checkedChild = filterChildren(child, hasPermission, props, _index);
            checkedChild && validChildren.push(checkedChild);
        });

        return validChildren;
    } 
    // TODO: 其他元素类型暴露方法让用户自己处理, 默认不处理
    return element;
}

function checkElementPermission(element, hasPermission, props) {
    var { comparePermission } = props;
    var elementPermission = getPropertyValueByNames(element, ['permission', 'permissions', 'data-permission', 'data-permissions']);

    // 元素需要的权限, 空的表示不需要权限
    if (isEmpty(elementPermission)) {
        return true;
    }

    // 用户的权限, 空的表示没有权限或还没获取到权限
    if (isEmpty(hasPermission)) {
        return false;
    }

    return comparePermission(formatPermission(elementPermission), formatPermission(hasPermission));
}

function getPropertyValueByNames(element = {}, names = []) {
    for (let i = 0; i < names.length; i++) {
        let value = element.props[names[i]];
        // TODO: 方法优化
        if (value || value === 0) {
            return value;
        }
    }
    return null;
}

function handleChildren(newChildren, oldChildren) {
    // children 为数组时 react会检测 key 是否为空, 为空会报警告.
    if (!newChildren || newChildren.length === 0) {
        newChildren = null;
        // 确保 newChildren 和 children 数据类型保持一致(object 或 array), 如果类型被修改, 
        // 会导致 react 以为子组件被替换了, 将卸载已 render 的子组件(componentWillUnmount)并且重新渲染新的子组件(componentDidMount).
    } else if (newChildren.length === 1 && oldChildren.length === 1) {
        newChildren = newChildren[0];
    }

    return newChildren;
}

function handleDeny(element, onDeny, index) {
    if (!onDeny) {
        return null;
    }

    if (React.isValidElement(onDeny)) {
        return onDeny;
    } 

    if (typeof onDeny === 'function') {
        // TODO: 这里可能会有性能问题, 如果 onDeny 方法直接执行页面跳转, 可能来不及清除内存占用.
        let newElement = onDeny(element, index);

        // 返回值类型必须是有效的React元素
        if (React.isValidElement(newElement)) {
            return newElement;
        }
        // 非 null, undefined, 0
        if (newElement) {
            throw 'onDeny return a invalid react element.';
        }
    }

    return null;
}

function render(props, permission) {
    var { children, hasPermission, onLoad } = props;
    // isEmpty(permission) && isPromise(hasPermission) 表示当前用户权限为 pending 状态
    if (isEmpty(permission) && isPromise(hasPermission) && React.isValidElement(onLoad)) {
        return onLoad;
    }
    let newChildren = filterChildren(children, permission, props);
    return newChildren;
}

export default function Permission(_props) {
    const props = Object.assign({
        hasPermission: null,
        comparePermission: comparePermission,
        onLoad: null,
        onDeny: null,
        onError: null
    }, useContext(PermissionContext), _props);

    // TODO: 增加状态 pending, fulfill 状态.
    const [hasPermission, setHasPermission] = useState(isPromise(props.hasPermission) ? null : props.hasPermission);
    
    useEffect(() => {
        if (isPromise(props.hasPermission)) {
            props.hasPermission.then(permission => setHasPermission(permission), props.onError);
        } else {
            setHasPermission(props.hasPermission);
        }
    }, [props.hasPermission]);

    return render(props, hasPermission);
}

Permission.propTypes = {
    hasPermission: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.array,
        PropTypes.func,
        PropTypes.object
    ]),
    comparePermission: PropTypes.func,
    onLoad: PropTypes.object,
    onDeny: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.object
    ]),
    onError: PropTypes.func
};