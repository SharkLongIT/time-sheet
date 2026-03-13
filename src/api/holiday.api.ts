import apiClient from "./apiClient";

const holidayApi = {

    getHolidaySettings(data: any): Promise<any> {
        return apiClient.get('/api/services/app/HolidaySettings/GetHolidaySettings', { params: data });
    },
};
export default holidayApi;
