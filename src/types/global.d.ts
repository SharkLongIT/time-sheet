export { };

declare global {
    var abp: {
        auth: {
            grantedPermissions: Record<string, boolean | string>;
        };
    };
}