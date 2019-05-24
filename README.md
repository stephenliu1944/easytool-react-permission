# @beanreact/permission
Use for react element permission.

## Install
```
npm install -S @beanreact/permission
```

## Usage
```jsx
import permission from '@beanreact/permission';
// set user's permissions first.
permission.setUserPermissions(['a', 'b', 'c']);

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

### Set User's permissions.  
setUserPermissions() support number, string, array or promise argument.
```jsx
import permission from '@beanreact/permission';
// number
permission.setUserPermissions(1);
// or string
permission.setUserPermissions('1');
// or string with dot
permission.setUserPermissions('1, 2, 3');
// or array
permission.setUserPermissions(['a', 'b', 'c']);
// or even promise
var promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(['a', 'b', 'c']);
        // or
        reject('error');
    }, 5000);
});
permission.setUserPermissions(promise);
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

Component's permissions with hook
```jsx
@permission([1,2,3], (permission, element) => {
    // do something...
})
class MyComponent extends Component {
    ...
}
```

### Handle denied hook.
```jsx
import permission from '@beanreact/permission';

@permission((requiredPermission, deniedElement) => {
    if (requiredPermission === 1) {
        // use a valid element replace the denied element.
        return <h1>Permissions Denied</h1>;
    } else if (requiredPermission === 2) {
        // rewrite deniedElement
        var { children, ...other } = deniedElement.props;
        return React.cloneElement(deniedElement, Object.assign({}, other, { disable: true }), children);
    }
})
class MyComponent extends Component {

    render() {
        return (
            <div>
                <h1>{this.props.disable ? 'DISABLE' : 'ENABLE' }</h1>
            </div>
        );
    }
}
```

### Set Default settings.
```jsx
import permission from '@beanreact/permission';

permission.settings({
    transformData(data) {
        return data.reverse();
    },
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
 * @desc
 * @param { number | string | array } permissions set required permissions of component.
 * @param { function } onDenied when permission denied occur(under the Component Class), this method will be invoked everytime, receive a required permission and denied element, return a replace element or nothing.
 */
permission(permissions, onDenied)

/**
 * @desc set global permissions for user.
 * @param { number | string | array | promise } permissions set user's permissions.
 */
permission.setUserPermissions(permissions)

/**
 * @desc
 * @param { object } options set default options.
 * @param { function } options.comparePermission custom compare function, receive(requiredPermissions, userPermissions). return true means authorized, false means denied.
 * @param { function } options.onDenied custom global onDenied, recieve(requiredPermissions, deniedElement).
 * @param { function } options.transformData will transform setUserPermissions's data,, default null.
 */
permission.settings(options)
```