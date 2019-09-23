import { permission } from './permission';
import { withPermission } from './wrapper';

var { setGlobalPermissions, setGlobalPermissionsPromise, getGlobalPermissions, getGlobalPermissionsPromise } = permission;

export {
    setGlobalPermissions,
    setGlobalPermissionsPromise,
    getGlobalPermissions,
    getGlobalPermissionsPromise,
    withPermission
};

export default permission;