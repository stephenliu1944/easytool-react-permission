import { permission } from './permission';
import { withPermission } from './wrapper';

var { setUserPermissions, setUserPermissionsAsync, getUserPermissions, getUserPermissionsAsync } = permission;

export {
    setUserPermissions,
    setUserPermissionsAsync,
    getUserPermissions,
    getUserPermissionsAsync,
    withPermission
};

export default permission;