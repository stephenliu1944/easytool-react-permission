# @beanreact/permission
Use for react element permission.

## Install
```
npm install -S @beanreact/permission
```

## Usage
Set user's permissions first.
```js
import { setOwnPermissions } from '@beanreact/permission';

setOwnPermissions(1);
// or
setOwnPermissions('1');
// or
setOwnPermissions('1, 2, 3');
// or
setOwnPermissions([1, 2, 3]);
// or
setOwnPermissions(['a', 'b', 'c']);
```
Set element's permissions.
```js
import { permission } from '@beanreact/permission';

@permission()
class MyComponent extends Component {

    render() {
        return (
            <div>
                {/* use "data-permission" attribute for dom element */}
                <div data-permission="1">
                    <h1>MyComponent</h1>
                    <p data-permission="2,3">
                        p1
                        <span>span1</span>
                    </p>
                </div>
                {/* use "permission" attribute for component element */}
                <SubComponent1 permission="1" />
                <SubComponent2 permission={2} />
                <SubComponent3 permission="3,4,5">
                    <SubComponent4 permission={[6, 7, 8]} />
                    <SubComponent5 permission={['a', 'b', 'c']} />
                </SubComponent3>
            </div>
        );
    }
}

render(
    <MyComponent />,
    document.getElementById('app')
);
```
Set Component's permissions.
```js
import { permission } from '@beanreact/permission';

@permission([1,2,3])
class MyComponent extends Component {

    render() {
        return (
            <div>
                .....
            </div>
        );
    }
}

render(
    <MyComponent />,
    document.getElementById('app')
);
```
Handle denied hook.
```js
import { permission } from '@beanreact/permission';

@permission((requiredPermission, deniedElement) => {
    /**
     * Demo
     */
    if (requiredPermission === 'need_login') {
        location.href = 'xxxx/login';
    } else if (requiredPermission === 2) {
        return <h1>Permissions Denied</h1>;             // use a valid element replace the denied element.
    } else if (requiredPermission === 3) {
        if (React.isValidElement(deniedElement)) {      // check deniedElement type, sometimes deniedElement type is ReactComponent.
            // rewrite deniedElement
            return React.cloneElement(deniedElement, newProps, newChildren);
        }
    }
})
// or
@permission([1,2,3], (permission, element) => {
    // do something...
})
class MyComponent extends Component {

    render() {
        return (
            <div>
                .....
            </div>
        );
    }
}

render(
    <MyComponent />,
    document.getElementById('app')
);
```

## API
```js
/**
 * @desc set global permissions for user own.
 * @param { number | string | array } permissions set user's permissions.
 */
setOwnPermissions(permissions)

/**
 * @desc
 * @param { number | string | array } permissions set component's permissions.
 * @param { function } onDenied when permission denied occur, this method will be invoked everytime, receive a required permission and denied element, could return a replace element.
 */
@permission(permissions, onDenied)
```