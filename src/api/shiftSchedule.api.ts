import { IAbpNotificationsResponse, INotificationPayload, INotificationResult } from "~/interface/notification";
import apiClient from "./apiClient";

const shiftScheduleApi = {

    getWorkCalendarTimeForUserFe(data: any): Promise<any> {
        return apiClient.get('/api/services/app/ShiftSchedule/GetWorkCalendarTimeForUserFe', { params: data });
    },
};
export default shiftScheduleApi;
