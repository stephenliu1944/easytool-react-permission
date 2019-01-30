export default function SetPermissionException(message = '') {
    this.title = 'set permission error: ';
    this.message = message;

    this.toString = function() {
        return this.title + this.message;
    };
}