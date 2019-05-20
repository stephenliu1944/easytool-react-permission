import React, { Component } from 'react';
import { render } from 'react-dom';
import permission, { setUserPermissions } from './index';

var promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        // reject('xxxxx');
        resolve('1,2');
    }, 5000);
});

setUserPermissions(promise);

@permission((num, el) => {
    console.log('denied: ', num, el);
    var { children, ...other } = el.props;
    return React.cloneElement(el, Object.assign({}, other, { disable: true }), children);
})
class MyComponent extends Component {

    render() {
        return (
            <div>
                <div data-permission={['1']}>
                    <h1>MyComponent</h1>
                    <p>
                        p1
                        <span>span1</span>    
                    </p>
                </div>
                <SubComponent1 permission={2} disable={false} />
                <SubComponent2>
                    <div data-permission="1">sc2</div>
                    <SubComponent1 permission={3} />
                </SubComponent2>
            </div>
        );
    }
} 

@permission()
class SubComponent1 extends Component {
    
    componentDidMount() {
        console.log('-------------SubComponent1');
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

render(
    <MyComponent />,
    document.getElementById('app')
);