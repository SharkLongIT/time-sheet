import apiClient from "./apiClient";

const userExporterApi = {

    getUserById(id: number): Promise<any> {
        return apiClient.get(`/api/services/app/UserExporter/GetUserById?userId=${id}`);

    },
};
export default userExporterApi;
