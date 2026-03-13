import apiClient from "./apiClient";

const leaveRequestDepartmentApi = {
    getAllLeaveRequestDepartment(data: any): Promise<any> {
        return apiClient.get('/api/services/app/LeaveRequestDepartment/GetAllLeaveRequestDepartment', { params: data });
    },
    // uploadFileFromMobile(data: any): Promise<any> {
    //     return apiClient.get('/api/services/app/LeaveRequestAtt/UploadFileFromMobile', { params: data });
    // },
    reApproveLeaveRequestDepartment(id: number): Promise<any> {
        // return apiClient.post('/api/services/app/LeaveRequestDepartment/ReApproveLeaveRequestDepartment?');
        return apiClient.post(`/api/services/app/LeaveRequestDepartment/ReApproveLeaveRequestDepartment?id=${id}`);
    },
    approveLeaveRequestDepartment(id: number): Promise<any> {
        // return apiClient.post('/api/services/app/LeaveRequestDepartment/ReApproveLeaveRequestDepartment?');
        return apiClient.post(`/api/services/app/LeaveRequestDepartment/ApproveLeaveRequestDepartment?id=${id}`);
    },
    getAllUsersViewDepartment(data: any): Promise<any> {
        return apiClient.get('/api/services/app/LeaveRequestDepartment/GetAllUsersViewDepartment', { params: data });
    },
    getUserCalendarRecordsViewDepartment(data: any): Promise<any> {
        return apiClient.get('/api/services/app/LeaveRequestDepartment/GetUserCalendarRecordsViewDepartment', { params: data });
    },
    createLeaveRequest(data: any): Promise<any> {
        return apiClient.post('/api/services/app/LeaveRequestDepartment/CreateLeaveRequest', data);
    },
};
export default leaveRequestDepartmentApi;
