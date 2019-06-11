import { permission } from './permission';
import { withPermission } from './wrapper';

var { setGlobalPermissions, setGlobalPermissionsAsync, getGlobalPermissions, getGlobalPermissionsAsync } = permission;

export {
    setGlobalPermissions,
    setGlobalPermissionsAsync,
    getGlobalPermissions,
    getGlobalPermissionsAsync,
    withPermission
};

export default permission;