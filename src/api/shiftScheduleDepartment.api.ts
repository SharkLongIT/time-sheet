import { IAbpNotificationsResponse, INotificationPayload, INotificationResult } from "~/interface/notification";
import apiClient from "./apiClient";

const shiftScheduleDepartmentApi = {

    getShiftSchedulesDepartment(data: any): Promise<any> {
        return apiClient.get('/api/services/app/ShiftScheduleDepartment/GetShiftSchedulesDepartment', { params: data });
    },
    getWorkCalendarTimeForUser(data: any): Promise<any> {
        return apiClient.get('/api/services/app/ShiftScheduleDepartment/GetWorkCalendarTimeForUser', { params: data });
    },
};
export default shiftScheduleDepartmentApi;
