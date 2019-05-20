# @beanreact/permission
Use for react element permission.

## Install
```
npm install -S @beanreact/permission
```

## Usage
```jsx
import permission, { setUserPermissions } from '@beanreact/permission';
// set user's permissions first.
setUserPermissions(['a', 'b', 'c']);

// add annotation on Component
@permission()
class MyComponent extends Component {

    render() {
        return (
            <div>
                {/* set dom element permission */}
                <div data-permission="a">MyComponent</div>
                {/* set component element permissions */}
                <SubComponent permission={['b', 'c']} />
            </div>
        );
    }
}

render(
    <MyComponent />,
    document.getElementById('app')
);
```

### setUserPermissions
Support number, string, array or promise argument.
```jsx
import { setUserPermissions } from '@beanreact/permission';
// number
setUserPermissions(1);
// string
setUserPermissions('1');
// string with dot
setUserPermissions('1, 2, 3');
// array
setUserPermissions(['a', 'b', 'c']);
// even promise
var promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(['a', 'b', 'c']);
        // or
        reject('error');
    }, 5000);
});
setUserPermissions(promise);
```

### Set Element's permissions.
```jsx
import permission from '@beanreact/permission';

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
```

### Set Component's permissions.
```jsx
import permission from '@beanreact/permission';

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
```

### Handle denied hook.
```jsx
import permission from '@beanreact/permission';

@permission((requiredPermission, deniedElement) => {
    if (requiredPermission === 1) {                     
        // need log in
        location.href = 'http://www.xxxx.com/login';    
    } else if (requiredPermission === 2) {              
        // use a valid element replace the denied element.
        return <h1>Permissions Denied</h1>;             
    } else if (requiredPermission === 3) {              
        // rewrite deniedElement
        var { children, ...other } = deniedElement.props;
        return React.cloneElement(deniedElement, Object.assign({}, other, { disable: true }), children);
    }
})
// or component's permissions with hook
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
```

### Set Default settings.
```jsx
import permission from '@beanreact/permission';

permission.settings({
    onDenied(requiredPermission, deniedElement) {
        ...
    },
    comparePermission(requiredPermissions, userPermissions) {
        ...
        return true/false;
    }
});
```

## API
```js
/**
 * @desc set global permissions for user own.
 * @param { number | string | array | promise } permissions set user's permissions.
 */
setUserPermissions(permissions)

/**
 * @desc
 * @param { number | string | array } permissions set component's permissions.
 * @param { function } onDenied when permission denied occur, this method will be invoked everytime, receive a required permission and denied element, could return a replace element.
 */
permission(permissions, onDenied)

/**
 * @desc
 * @param { object } options set default options.
 * @param { function } options.comparePermission custom compare function, receive(requiredPermissions, userPermissions). return true means authorized, false means denied.
 * @param { function } options.onDenied custom global onDenied, recieve(requiredPermissions, deniedElement).
 */
permission.settings(options)
```