export const isGranted = (permission: string): boolean => {
    const permissions = globalThis.abp?.auth?.grantedPermissions || {};
    return permissions[permission] === true || permissions[permission] === "true";
};
