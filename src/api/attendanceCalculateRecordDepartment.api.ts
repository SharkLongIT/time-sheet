import apiClient from "./apiClient";

const attendanceCalculateRecordDepartmentApi = {

    getUserCalendarRecordsViewDepartment(data: any): Promise<any> {
        return apiClient.get('/api/services/app/AttendanceCalculatedRecordDepartment/GetUserCalendarRecordsViewDepartment', { params: data });
    },
    getTotalLateAbsentEarlyLeave(month: number): Promise<any> {
        return apiClient.get(`/api/services/app/AttendanceCalculatedRecordDepartment/GetTotalLateAbsentEarlyLeave?month=${month}`);

    },
};

export default attendanceCalculateRecordDepartmentApi;
