import React from 'react';
import { permission } from '../permission';

// for Function Component
export function withPermission(WrappedComponent, permissions, onDenied) {
    return @permission(permissions, onDenied) class extends React.PureComponent {
        render() {
            return WrappedComponent(this.props);
        }
    };
}

// TODO: for Hooks Component
// export function hooksWrapper(WrappedComponent, permissions, onDenied) {
//     return @permission(permissions, onDenied) class extends Component {
//         render() {
//             return WrappedComponent;
//         }
//     };
// }