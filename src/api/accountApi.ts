import { ILoginPayload, IResponseLogin, IUser } from "~/interface/auth";
import apiClient from "./apiClient";
import { IAbpResponse, IApiBaseResponse } from "~/interface/common";

const accountApi = {
    sendPasswordResetCode(data: any) {
        return apiClient.post('/api/services/app/Account/SendPasswordResetCode', data);
    },
    updateCurrentUserProfile(data: any) {
        return apiClient.put('/api/services/app/Profile/UpdateCurrentUserProfile', data);
    },

};
export default accountApi;

