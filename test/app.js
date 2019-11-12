import React, { Component, useState } from 'react';
import { render } from 'react-dom';
import { Table } from 'antd';
import permission, { setGlobalPermissions, withPermission } from '../src/index';

var Column = Table.Column;
permission.settings({
    transformData(data) {
        return data;
    }
});

/**
 * 设置权限
 */
// 同步
// permission.setGlobalPermissions([1, 2, 3]);

// 异步
var promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve([1, 2, 'A']);
    }, 3000);
});
permission.setGlobalPermissionsPromise(promise);

// 异步获取权限
permission.getGlobalPermissionsPromise().then((p) => {
    console.log('UserPermissions Promise: ', p);
});

@permission((num, el, index) => {
    return React.cloneElement(el, { key: index, style: { color: 'red' } });
})
class MyComponent extends Component {

    state = {
        data: [],
        dataSource: []
    }

    componentDidMount() {
        // setTimeout(() => {
        //     this.setState({
        //         data: ['A', 'B', 'C']
        //     });
        // }, 2000);
        
        setTimeout(() => {
            this.setState({
                dataSource: [{
                    key: '1',
                    name: '胡彦斌1',
                    age: 32,
                    address: '西湖区湖底公园1号'
                }, {
                    key: '2',
                    name: '胡彦祖2',
                    age: 42,
                    address: '西湖区湖底公园2号'
                }, {
                    key: '3',
                    name: '胡彦祖3',
                    age: 52,
                    address: '西湖区湖底公园3号'
                }]
            });
        }, 1000);
    }

    render() {
        return (
            <Table dataSource={this.state.dataSource} >
                <Column
                    title="住址"
                    dataIndex="address"
                    key="address"
                    render={(text, record, index) => {
                        // var Wrapper = RenderWrapper(
                        //     <span permission={index + 1}>
                        //         <a href="javascript:;">{text}</a>
                        //     </span>
                        // );
                        // return <Wrapper />;
                        return <span permission="A4">{text}</span>;
                    }}
                />
            </Table>
        );
    }
} 

@permission()
class SubComponent1 extends Component {
    
    state =  {
        data: []
    }

    componentDidMount() {
        this.state.time = setTimeout(() => {
            this.setState({
                data: ['A', 'B', 'C']
            });
        }, 5000);
    }

    componentWillUnmount() {
        clearTimeout(this.state.time);
    }

    renderDate(data = []) {
        return data.map((data, index) => {
            return (<div key={index} permission={data}>
                <a href="#">{data}</a>
            </div>);
        });
    }
    
    render() {
        return (
            <div>
                SubComponent1
                <h1 data-permission={[1, 2, 3]}>SubComponent1.h1</h1>
                <p>
                    SubComponent1.p1
                    <span>SubComponent1.disable: {this.props.disable ? 'DISABLE' : 'ENABLE' }</span>    
                </p>
                { this.renderDate(this.state.data) }
            </div>
        );
    }
} 

function SubComponent2(props) {
    return (
        <div>
            <h1>SubComponent2</h1>
            { props.children }
        </div>
    );
}

function SubComponent3(props) {
    return (
        <div>
            <h1>SubComponent3</h1>
            <p>deny</p>
            { props.children }
        </div>
    );
}

var Wrapper = withPermission((props) => {
    return (
        <p id="1" name="P">
            <a permission="1" href="#">Hello1 </a>
            <a permission="2" href="#">HelloB </a>
        </p>
    );
});

var WrapperHooks = withPermission((props) => {
    // Declare a new state variable, which we'll call "count"
    const [count, setCount] = useState(0);

    return (
        <div>
            <p data-permission="444">You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
        Click me
            </button>
        </div>
    );
});

render(
    <MyComponent />,
    document.getElementById('app')
);