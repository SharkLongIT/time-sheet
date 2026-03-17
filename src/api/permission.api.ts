import apiClient from "./apiClient";

const permissionApi = {

    getMyPermissions(): Promise<any> {
        return apiClient.get('/api/services/app/Permission/GetMyPermissions');
    },
};
export default permissionApi;
