import apiClient from "./apiClient";

const attendanceCaculatedRecordApi = {

    getAttCalcPersonalRecordsFE(data: any): Promise<any> {
        return apiClient.get('/api/services/app/AttendanceCalculatedRecord/GetAttCalcPersonalRecordsFE', { params: data });
    },
};
export default attendanceCaculatedRecordApi;
