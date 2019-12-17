import React, { Component, useContext } from 'react';
import { render } from 'react-dom';
import { Table } from 'antd';
import Permission, { PermissionContext } from '../src/index';
import PropTypes from 'prop-types';

var Column = Table.Column;

class CC extends Component {

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
            <Permission>
                <Table dataSource={this.state.dataSource} permission="4">
                    <Column
                        title="住址"
                        dataIndex="address"
                        key="address"
                        render={(text, record, index) => {
                            return (
                                <Permission onDeny={(el) => <h1>没有权限</h1>}>
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

function FC(props) {
    var { value1 } = Object.assign({}, useContext(PermissionContext), props);
    
    return (
        <div permission="1">
            <h1 permission="3">3</h1>
        </div>
    );
}

// 异步
var promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve([1, 2]);
    }, 3000);
});

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
    <PermissionContext.Provider value={{ hasPermission: promise }}>
        <Table dataSource={dataSource}>
            <Column
                title="Name"
                dataIndex="name"
                key="name"
                render={(text, record, index) => {
                    return (
                        <Permission onDeny={(el) => <span>Permission denied</span> }>
                            <span permission={record.permission}>{text}</span>
                        </Permission>
                    );
                }}
            />
        </Table>
    </PermissionContext.Provider>,
    document.getElementById('app')
);

/* render(
    <PermissionContext.Provider value={{ hasPermission: promise, onDeny: (el) => <h3>Permission denied</h3> }}>
        <Permission >
            <div permission="1">1</div>
            <div permission="11" deny={(el) => alert(el.props.permission)}>11</div>
        </Permission>
        <Permission hasPermission={[2]}>
            <div permission="2">2</div>
            <CC permission="21" onDeny={(el) => alert(el.props.permission)} />
        </Permission>
    </PermissionContext.Provider>,
    document.getElementById('app')
); */