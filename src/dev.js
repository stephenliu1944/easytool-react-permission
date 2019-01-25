import React, { Component } from 'react';
import { render } from 'react-dom';
import { permission, setOwnPermissions } from './permission';

setOwnPermissions('1,2');

@permission()
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
                <SubComponent2 />
            </div>
        );
    }
} 

@permission()
class SubComponent1 extends Component {

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

function SubComponent2() {
    return (
        <div>
            SubComponent2
            <h1>SubComponent2.h1</h1>
            <SubComponent1 />
        </div>
    );
}

render(
    <MyComponent />,
    document.getElementById('app')
);