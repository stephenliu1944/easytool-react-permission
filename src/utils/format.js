import { isArray, isString, isNumber } from 'Utils/common';

export function formatPermission(value) {
    var permissions = [];

    if (isArray(value)) {
        permissions = value;
    } else if (isNumber(value)) {
        permissions.push(value);
    } else if (isString(value)) {
        if (value.includes(',')) {
            // TODO: 移除开头和结尾的 ","
            permissions = value.split(',');
        } else {
            permissions.push(value);
        }
    }

    return permissions;
}