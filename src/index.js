import { permission } from './permission';
import { wrapper } from './wrapper';

var { setUserPermissions, setUserPermissionsAsync, getUserPermissions, getUserPermissionsAsync } = permission;

export {
    setUserPermissions,
    setUserPermissionsAsync,
    getUserPermissions,
    getUserPermissionsAsync,
    wrapper
};

export default permission;