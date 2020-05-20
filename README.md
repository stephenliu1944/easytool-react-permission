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
    <Permission hasPermission={[1, 2, 3, 4]}>
        <div permission="1">1</div>
        <div permission="1, 2">1, 2</div>
        <div permission={[1, 2, 3]}>1, 2, 3</div>
        <MyComponent permission={4}>4</MyComponent>
    </Permission>,
    document.getElementById('app')
);
```

### Asynchronous setting permission
```jsx
var promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve([1, 2, 3]);
    }, 3000);
});

render(
    <Permission hasPermission={promise}>
        <div permission="1">1</div>
        <div permission="2">2</div>
        <div permission="3">3</div>
    </Permission>,
    document.getElementById('app')
);
```

### onLoad
```jsx
var promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve([1, 2, 3]);
    }, 3000);
});

render(
    <Permission hasPermission={promise} onLoad={<div>Loading...</div>}>
        <div permission="1">1</div>
        <div permission="2">2</div>
        <div permission="3">3</div>
    </Permission>,
    document.getElementById('app')
);
```

### onDeny
Change denied element.
```jsx
render(
    <Permission hasPermission={[1]} onDeny={el => React.cloneElement(el, { style: { color: 'red' } })}>
        <div permission="1">1</div>
        <MyComponent permission="2">2</MyComponent>
    </Permission>,
    document.getElementById('app')
);
```

Replace denied element.
```jsx
render(
    <Permission hasPermission={[1]} onDeny={<h3>Permission denied</h3>}>
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
        <div permission="1" deny={<h3>Permission denied</h3>}>1</div>
        <MyComponent permission="2" onDeny={<h3>Not Allow</h3>}>2</MyComponent>
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

Asynchronous setting permission.
```jsx
import Permission, { PermissionContext } from '@easytool/react-permission';

var promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve([1, 2, 3]);
    }, 3000);
});

render(
    <PermissionContext.Provider value={{ hasPermission: promise, onDeny: <h3>Permission denied</h3> }}>
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

Updating permission from a nested component.
```jsx
class Home extends React.Component {
    static contextType = PermissionContext;

    componentDidMount() {
        setTimeout(() => {
            this.context.togglePermission([1, 2, 3]);
        }, 2000);
    }

    render() {
        return (
            <Permission>
                <h1 permission="1">Home</h1>
                <p permission="2">permission 2</p>
                <p permission="3">permission 3</p>
            </Permission>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasPermission: [1, 2],
            togglePermission: (permissions) => {
                this.setState({
                    hasPermission: permissions
                });
            }
        };
    }

    render() {
        return (
            <PermissionContext.Provider value={this.state}>
                <Home />
            </PermissionContext.Provider>
        );
    }
}

render(
    <App />,
    document.getElementById('app')
);
```

### Work with React Router
```jsx
function Deny() {
    return <p>Permission denied</p>;
}

render(
    <Permission hasPermission={[1, 2]} onDeny={(el, index) => React.cloneElement(el, { key: index, component: Deny })}>
        <Router history={hashHistory} >
            <Route path="/" permission="1">
                <Route path="/home" component={Home} permission="2" />
                <Route path="/detail" component={Detail} permission="3" />
            </Route>
        </Router>
    </Permission>,
    document.getElementById('app')
);
```

onLoad props is required when use Lazy loading.
```jsx
var promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve([1, 2]);
    }, 3000);
});

render(
    <Permission hasPermission={promise} onLoad={<h1>Loading...</h1>}>
        <Router history={hashHistory} >
            <Route path="/" permission="1">
                <Route path="/home" component={Home} permission="2" />
                <Route path="/detail" component={Detail} permission="3" />
            </Route>
        </Router>
    </Permission>,
    document.getElementById('app')
);
```

### Work with AntD Table
```jsx
import { Table } from 'antd';
import Permission, { PermissionContext } from '@easytool/react-permission';

var dataSource = [{
    key: '1',
    permission: 1,
    name: 'Stephen'
}, {
    key: '2',
    permission: 2,
    name: 'Ricky'
}, {
    key: '3',
    permission: 3,
    name: 'Ray'
}];

render(
    <PermissionContext.Provider value={{ hasPermission: [1, 2] }}>
        <Table dataSource={dataSource}>
            <Column
                title="Name"
                dataIndex="name"
                key="name"
                render={(text, record, index) => {
                    return (
                        <Permission onDeny={<span>Permission denied</span>}>
                            <span permission={record.permission}>{text}</span>
                        </Permission>
                    );
                }}
            />
        </Table>
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
onLoad|react element|when the hasPermission prop is promise type and state is pending then will use this element to render.
onDeny|react element\|function|this method will be invoked when permission denied occur, function receive denied element and element index in parent children, return a replace element or nothing.
onError|function|when hasPermission is promise and throw error, it will be invoked.

### PermissionContext.Provider
You can specify Context Provider that will be applied to every \<Permission\>.
#### value
Param|Type|Description
-|-|-
hasPermission|string\|number\|array\|promise|as above.
comparePermission|function|as above.
onLoad|react element|as above.
onDeny|react element\|function|as above.
onError|function|as above.
