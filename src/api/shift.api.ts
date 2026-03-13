import { IAbpNotificationsResponse, INotificationPayload, INotificationResult } from "~/interface/notification";
import apiClient from "./apiClient";

const shiftApi = {

    getAllShifts(data: any): Promise<any> {
        return apiClient.get('/api/services/app/Shift/GetAllShifts', { params: data });
    },
};
export default shiftApi;
