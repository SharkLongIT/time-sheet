const abp = {
    auth: {
        grantedPermissions: {} as Record<string, boolean | string>,

        isGranted(permission: string): boolean {
            const value = this.grantedPermissions[permission];
            return value === true || value === "true";
        }
    }
};

export default abp;