import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'abp_permissions';

const PermissionService = {

    /**
     * Kiểm tra quyền
     */
    hasPermission: (key: string): boolean => {

        const granted =
            globalThis.abp?.auth?.grantedPermissions || {};

        const value = granted[key];

        return value === true || value === 'true';
    },

    /**
     * Lưu permissions sau khi login
     */
    savePermissions: async (permissions: Record<string, boolean>) => {

        globalThis.abp = {
            auth: {
                grantedPermissions: permissions,
            },
        };
        // console.log(globalThis.abp)

        await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(permissions)
        );
    },

    /**
     * Load permissions khi app start
     */
    loadPermissions: async () => {

        const stored = await AsyncStorage.getItem(STORAGE_KEY);

        if (!stored) return;

        try {

            const permissions = JSON.parse(stored);

            globalThis.abp = {
                auth: {
                    grantedPermissions: permissions,
                },
            };

        } catch (err) {
            console.log("Load permissions error", err);
        }
    },

    /**
     * Clear permissions khi logout
     */
    clearPermissions: async () => {

        globalThis.abp = {
            auth: {
                grantedPermissions: {},
            },
        };

        await AsyncStorage.removeItem(STORAGE_KEY);
    },

};

export default PermissionService;