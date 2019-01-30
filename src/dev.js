import React, { Component } from 'react';
import { render } from 'react-dom';
import { permission, setOwnPermissions } from './permission';

var promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        // reject('xxxxx');
        resolve('1,2');
    }, 5000);
});

setOwnPermissions(promise);

@permission((num, el) => {
    console.log(num, el);
    // return <span>deny</span>;
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
                <SubComponent1 permission={2} />
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
                    <h1 data-permission={[1,2,3]}>SubComponent1.h1</h1>
                    <p>
                    SubComponent1.p1
                        <span>SubComponent1.span1</span>    
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

render(
    <MyComponent />,
    document.getElementById('app')
);