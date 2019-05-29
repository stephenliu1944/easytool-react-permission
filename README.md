# @beanreact/permission
Happy to handle React Component permissions.

## Install
```
npm install -S @beanreact/permission
```

## Usage
```jsx
import permission from '@beanreact/permission';
// 1. you need to set user's permissions first.
permission.setUserPermissions(['a', 'b', 'c']);

// 2. add annotation on Component.
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

// 3. then use it.
render(
    <MyComponent />,
    document.getElementById('app')
);
```

### Set User's permissions.  
#### setUserPermissions()  
Sync to set User's permissions, method receive number, string or array args.
```js
import permission from '@beanreact/permission';
// number
permission.setUserPermissions(1);
// or string
permission.setUserPermissions('1');
// or string with dot
permission.setUserPermissions('1, 2, 3');
// or array
permission.setUserPermissions(['a', 'b', 'c']);
```

#### setUserPermissionsAsync()  
Async to set User's permissions. method receive a Promise instance.
```js
import permission from '@beanreact/permission';
// or even promise
var promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(['a', 'b', 'c']);
        // or
        reject('error');
    }, 5000);
});
permission.setUserPermissionsAsync(promise);
```

### Get User's permissions.  
#### getUserPermissions()  
Sync to get userPermissions data.
```js
var userPermissions = permission.getUserPermissions();
```

#### getUserPermissionsAsync()  
Async to get userPermissions data. If you use setUserPermissionsAsync() method to set user's permissions, you better to use this method to get userPermissions data.
```js
permission.getUserPermissionsAsync((userPermissions) => {
    console.log(userPermissions);
});
```

### Set Element's permissions.
It means User need to have these permissions which is elements set, then them will activate in this Component.
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
                <SubComponent1 permission={1} />
                <SubComponent2 permission="2" />
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
It means it's the required permissions on this Components.
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
    // handle denied
})
class MyComponent extends Component {
    ...
}
```

### Set Function Component's permissions.
withPermission method is use for Function Component.
```jsx
import { setUserPermissions, withPermission } from '@beanreact/permission';

setUserPermissions('1, 2, 3');

var Permission = withPermission((props) => {
    return (
        <p>
            <a permission="1" href="#">Hello 1 </a>
            <a permission="2" href="#">Hello 2 </a>
        </p>
    );
});

render(
    <Permission />,
    document.getElementById('app')
);
```

Set Function Component's permission.
```jsx
var Permission = withPermission((props) => {
    return (
        <p>
            <a permission="1" href="#">Hello 1 </a>
            <a permission="2" href="#">Hello 2 </a>
        </p>
    );
}, [1, 2, 3]);
```

Function Component with Hook.
```jsx
var Permission = withPermission((props) => {
    return (
        <p>
            <a permission="1" href="#">Hello 1 </a>
            <a permission="2" href="#">Hello 2 </a>
        </p>
    );
}, (permission, element) => {
    // handle denied
});
// or
var Permission = withPermission((props) => {
    return (
        <p>
            <a permission="1" href="#">Hello 1 </a>
            <a permission="2" href="#">Hello 2 </a>
        </p>
    );
}, [1, 2, 3], (permission, element) => {
    // handle denied
});
```

### Handle denied.
```jsx
import permission, { setUserPermissions } from '@beanreact/permission';

setUserPermissions('3');

@permission((requiredPermission, deniedElement) => {
    if (requiredPermission === 1) {
        // use a valid element replace the denied element.
        return <h1>Permissions Denied</h1>;
    } else if (requiredPermission === 2) {
        // rewrite deniedElement
        return React.cloneElement(deniedElement, { style: { color: 'red' });
    }
})
class MyComponent extends Component {

    render() {
        return (
            <div>
                <p data-permissions="1">Hello</p>
                <p data-permissions="2">World</p>
            </div>
        );
    }
}
```

### Set Default options.
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
 * @desc enable permission feature for Class Component.
 * @param { number | string | array } permissions set required permissions of component.
 * @param { function } onDenied when permission denied occur(under the Component Class), this method will be invoked everytime, receive a required permission and denied element, return a replace element or nothing.
 */
permission(permissions, onDenied)

/**
 * @desc set global permissions for user.
 * @param { number | string | array } permissions set user's permissions.
 */
permission.setUserPermissions(permissions)

/**
 * @desc async to set global permissions for user.
 * @param { promise } promise a promise instance to async receive user's permissions.
 */
permission.setUserPermissionsAsync(promise)

/**
 * @desc sync to get user's permissions.
 * @return user's permissions.
 */
permission.getUserPermissions(permissions)

/**
 * @desc async to get user's permissions.
 * @param { function } callback method receive a param that is userPermissions data.
 */
permission.getUserPermissionsAsync(callback)

/**
 * @desc
 * @param { object } options set default options.
 * @param { function } options.comparePermission custom compare function, receive(requiredPermissions, userPermissions). return true means authorized, false means denied.
 * @param { function } options.onDenied custom global onDenied, recieve(requiredPermissions, deniedElement).
 * @param { function } options.transformData will transform setUserPermissions's data,, default null.
 */
permission.settings(options)

/**
 * @desc enable permission feature for Function Component.
 * @param { function } WrappedComponent Function Component.
 * @param { number | string | array } permissions set required permissions of Function Component.
 * @param { function } onDenied when permission denied occur(under the Function Component), this method will be invoked everytime, function receive required permission and denied element, return a replace element or nothing.
 */
withPermission(WrappedComponent, permissions, onDenied)
```