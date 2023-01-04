import { Table } from 'antd';
import React, { Component, useContext } from 'react';
import { Route, HashRouter, Switch } from 'react-router-dom';
import ReactDOM, { render } from 'react-dom';
import Permission, { PermissionContext } from '../src/index';

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

function FC2(props) {
    return (
        <h1>Component 2</h1>
    );
}

function FC3(props) {
    return (
        <h1>Component 3</h1>
    );
}

function Deny() {
    return <p>Permission denied</p>;
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

/**
 * react-router@3
 */
/* render(
    <Permission hasPermission={promise} onLoad={<h1>Loading...</h1>} onDeny={(el, index) => React.cloneElement(el, { key: index, component: Deny })}>
        <Router history={hashHistory} >
            <Route path="/" permission="1">
                <IndexRedirect to="/detail" />
                <Route path="/home" component={FC2} permission="3"/>
                <Route path="/detail" component={FC3} permission="2"/>
            </Route>
        </Router>
    </Permission>,
    document.getElementById('app')
); */

/**
 * react-router@4
 */
class App extends Component {

    state = {
        hasPermission: []
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                hasPermission: [1, 2]
            });
        }, 2000);
    }

    render() {
        return (
            <Permission hasPermission={this.state.hasPermission}>
                <h1>APP</h1>
                <Switch>
                    <Route path="/home" component={Home} permission="1" />
                    <Route path="/fc2" component={FC2} permission="2" />
                </Switch>
            </Permission>
        );
    }
}

function Home() {
    return (
        <h1>Home</h1>
    );
}

function NoMatch() {
    return (
        <h1>NoMatch</h1>
    );
}

class Root extends Component {
    state = {
        hasPermission: [1, 2]
    }

    componentDidMount() {
        // setTimeout(() => {
        //     console.log('------------');
        //     this.setState({
        //         hasPermission: [1, 2]
        //     });
        // }, 2000);
    }

    render() {
        return (
            // <PermissionContext.Provider value={this.state}>
            <HashRouter>
                <Switch>
                    <Route path="/" component={App} />
                    <Route exact component={NoMatch} />
                </Switch>
            </HashRouter>
            // </PermissionContext>
        );
    }
}

/**
 * 动态更新权限
 */
/* class Home extends React.Component {
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

class Root extends Component {
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
} */

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

// 不能直接用{Lazy}, 需要<Lazy>
const Lazy = React.lazy(() => import('./components/LazyComponent'));
// 不能直接用{Memo}, 需要<Memo>
const Memo = React.memo((props) => (
    <div>Memo</div>
));
// 不能直接用{ForwardRef}, 需要<ForwardRef>
const ForwardRef = React.forwardRef((props, ref) => (
    <button ref={ref} className="FancyButton">ForwardRef</button>
));
// 可以直接用ReactDOM.createPortal(<h1>Portal</h1>, document.querySelector('#modal'))
const Portal = (props) => ReactDOM.createPortal(<h1>Portal</h1>, document.querySelector('#modal'));

/**
 * 用于测试 react-router@4-5 的路由使用
 */
let res, rej;
const context = { 
    hasPermission: new Promise((resolve, reject) => {
        res = resolve;
        rej = reject;
    }),
    onDeny: (el, index) => {
        return <h1 key={index}>Deny!!</h1>;
    }
};
class Root2 extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        setTimeout(() => {
            res([1, 2]);
        }, 2000);
    }

    render() {
        return (
            <>
                <PermissionContext.Provider value={context}>
                    <Permission>
                        <React.Suspense fallback={<div>Loading...</div>} permission="2">
                            <Lazy permission="3" />
                        </React.Suspense>
                        <Portal permission="2" />
                        <Memo permission="2" />
                        <ForwardRef permission="3" />
                        <><h1>a</h1><h1>b</h1></>
                    </Permission>
                </PermissionContext.Provider>
            </>
        );
    }
}

render(
    <Root2 />,
    document.getElementById('app')
);