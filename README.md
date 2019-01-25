# @beanreact/permission
Use for control react component permission

## Install
npm install -S @beanreact/permission

## Usage
Set user's permissions
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
Config element's permissions
```js
import { permission } from '@beanreact/permission';

@permission()
class MyComponent extends Component {

    render() {
        return (
            <div>
                <div data-permission="1">
                    <h1>MyComponent</h1>
                    <p data-permission="2,3">
                        p1
                        <span>span1</span>
                    </p>
                </div>
                <SubComponent1 permission="1" />
                <SubComponent2 permission={2} />
                <SubComponent3 permission="3,4,5" />
                <SubComponent3 permission={[6, 7, 8]} />
                <SubComponent4 permission={['a', 'b', 'c']} />
            </div>
        );
    }
}
```