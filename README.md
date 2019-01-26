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
setOwnPermissions('1,2,3');
// or
setOwnPermissions([1, 2, 3]);
// or
setOwnPermissions(['a,b,c']);
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
                <SubComponent3 permission="3,4,5" />
                <SubComponent3 permission={[6, 7, 8]} />
                <SubComponent4 permission={['a', 'b', 'c']} />
            </div>
        );
    }
}

render(
    <MyComponent />,
    document.getElementById('app')
);
```
Set class's permissions.
```js
import { permission } from '@beanreact/permission';

@permission([1,2,3], (status) => {
    if (status === 'authorized') {
        // do something
    } else if (status === 'denied') {
        // do something like:
        location.href = 'xxxx/404';
        // or
        return <h1>Permissions Denied</h1>;     // use a valid element replace the original(only work in denied status).
    }
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
 * @desc
 * @param { number | string | array } permissions set component's permissions.
 * @param { function } callback check class's permissions callback, receive a status.
 */
@permission(permissions, callback)
```