import React, { Component, useContext } from 'react';
import { render } from 'react-dom';
import { Table } from 'antd';
import Permission, { PermissionContext } from '../src/index';
import PropTypes from 'prop-types';

var Column = Table.Column;

class Test1 extends Component {

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
        }, 5000);
    }

    render() {
        return (
            <Permission hasPermission={promise}>
                <Table dataSource={this.state.dataSource} permission="1">
                    <Column
                        title="住址"
                        dataIndex="address"
                        key="address"
                        render={(text, record, index) => {
                            return (
                                <Permission hasPermission={promise} onDeny={(el) => <h1>没有权限</h1>}>
                                    <span permission={index + 1}>{text}</span>
                                </Permission>
                            );
                        }}
                    />
                </Table>
                <div permission="2">2</div>
                <div permission="3">3</div>
            </Permission>
        );
    }
} 
class Test2 extends Component {
    
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

function Test3(props) {
    var { value1 } = Object.assign({}, useContext(PermissionContext), props);
    console.log(value1);
    
    return (
        <div permission="1">
            <h1 permission="3">3</h1>
        </div>
    );
}

Test3.propTypes = {
    value1: PropTypes.object
};

// todo: test Hooks

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

// React.cloneElement(el, { key: index, style: { color: 'red' } });

render(
    <PermissionContext.Provider>
        <Test3 />
    </PermissionContext.Provider>,
    document.getElementById('app')
);