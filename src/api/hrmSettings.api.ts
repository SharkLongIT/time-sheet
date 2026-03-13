import apiClient from "./apiClient";

const hrmSettingsApi = {

    getAllSettings(): Promise<any> {
        return apiClient.get('/api/services/app/HrmSettings/GetAllSettings');
    },
};
export default hrmSettingsApi;
