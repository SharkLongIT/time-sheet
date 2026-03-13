import apiClient from "./apiClient";

const attendanceTimeApi = {

    getAttendanceTimesForUser(data: any): Promise<any> {
        return apiClient.get('/api/services/app/AttendanceTime/GetAttendanceTimesForUser', { params: data });
    },
};
export default attendanceTimeApi;
