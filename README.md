# @easytool/react-permission
Easy to handle react component permissions.

## Install
```
npm install -S @easytool/react-permission
```

## Usage
```jsx
import Permission from '@easytool/react-permission';
import React from 'react';
import { render } from 'react-dom';

render(
    <Permission hasPermission={[1, 2, 3]}>
        <div permission="1">1</div>
        <div permission="1, 2">1, 2</div>
        <div permission={[2, 3]}>2, 3</div>
        <MyComponent permission="1, 2, 3">1, 2, 3</MyComponent>
    </Permission>,
    document.getElementById('app')
);
```

### Lazy loading
```jsx
var promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve([1, 2, 3]);
    }, 3000);
});

render(
    <Permission hasPermission={promise}>
        <div permission="1">1</div>
        <div permission="1, 2">1, 2</div>
        <div permission={[2, 3]}>2, 3</div>
    </Permission>,
    document.getElementById('app')
);
```

### onDeny
Replace denied element.
```jsx
render(
    <Permission hasPermission={[1]} onDeny={(deniedElement) => <h3>Permission denied</h3>}>
        <div permission="1">1</div>
        <MyComponent permission="2">2</MyComponent>
    </Permission>,
    document.getElementById('app')
);
```

Change denied element.
```jsx
render(
    <Permission hasPermission={[1]} onDeny={(deniedElement) => React.cloneElement(deniedElement, { style: { color: 'red' } })}>
        <div permission="1">1</div>
        <MyComponent permission="2">2</MyComponent>
    </Permission>,
    document.getElementById('app')
);
```

Handle deny to specific element.
```jsx
render(
    <Permission hasPermission={[1]}>
        // DOM Elements can not use 'onxxx' custom attributes, so use 'deny' in place of it.
        <div permission="1" deny={(el) => <h3>Permission denied</h3>}>1</div>
        <MyComponent permission="2" onDeny={(el) => <h3>Permission denied</h3>}>2</MyComponent>
    </Permission>,
    document.getElementById('app')
);
```

### Use Context Provider
Set global Permission.
```jsx
import Permission, { PermissionContext } from '@easytool/react-permission';

render(
    <PermissionContext.Provider value={{ hasPermission: [1, 2, 3] }}>
        <Permission>
            <div permission="1">1</div>
            <div permission="2">2</div>
        </Permission>
        <Permission>
            <div permission="3">3</div>
            <MyComponent permission="4" />
        </Permission>
    </PermissionContext.Provider>,
    document.getElementById('app')
);
```

Lazy loading also works.
```jsx
import Permission, { PermissionContext } from '@easytool/react-permission';

var promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve([1, 2, 3]);
    }, 3000);
});

render(
    <PermissionContext.Provider value={{ hasPermission: promise, onDeny: (el) => <h3>Permission denied</h3> }}>
        <Permission>
            <div permission="1">1</div>
            <div permission="2">2</div>
        </Permission>
        <Permission>
            <div permission="3">3</div>
            <MyComponent permission="4" />
        </Permission>
    </PermissionContext.Provider>,
    document.getElementById('app')
);
```

## API
### Permission
Param|Type|Description
-|-|-
hasPermission|string\|number\|array\|promise|set user's permission.
comparePermission|function|custom compare function, receive(elementPermission, hasPermission). return true means authorized, false means denied.
onDeny|function|when permission denied occur(under the Component Class), this method will be invoked everytime, function receive required permission, denied element and element index in parent children, return a replace element or nothing.
onError|function|when hasPermission is promise and throw error, it will be invoked.

### PermissionContext.Provider
#### value
Param|Type|Description
-|-|-
hasPermission|string\|number\|array\|promise|as above.
comparePermission|function|as above.
onDeny|function|as above.
onError|function|as above.
