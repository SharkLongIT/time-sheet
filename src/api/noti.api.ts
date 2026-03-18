import { IAbpNotificationsResponse, INotificationPayload, INotificationResult } from "~/interface/notification";
import apiClient from "./apiClient";

const notiApi = {

    getNotifications(data: INotificationPayload): Promise<IAbpNotificationsResponse<INotificationResult>> {
        return apiClient.get('/api/services/app/Notification/GetUserNotifications', { params: data });
    },
    setAllNotificationsAsRead(): Promise<any> {
        return apiClient.post('/api/services/app/Notification/SetAllNotificationsAsRead');
    },
    deleteNoti(id: any): Promise<any> {
        // return apiClient.delete('/api/services/app/Notification/DeleteNotification', input);
        return apiClient.delete(`/api/services/app/Notification/DeleteNotification?id=${id}`);
    },
};
export default notiApi;
