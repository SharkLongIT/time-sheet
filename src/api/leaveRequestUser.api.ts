import apiClient from "./apiClient";

const leaveRequestUserApi = {

    getAllLeaveRequest(data: any): Promise<any> {
        return apiClient.get('/api/services/app/LeaveRequestUser/GetAllLeaveRequest', { params: data });
    },
    getPeriodByUserId(data: any): Promise<any> {
        return apiClient.get('/api/services/app/LeaveRequestUser/GetPeriodByUserId', { params: data });
    },
    createLeaveRequest(data: any): Promise<any> {
        return apiClient.post('/api/services/app/LeaveRequestUser/CreateLeaveRequest', data);
    },
    editLeaveRequest(data: any): Promise<any> {
        return apiClient.post('/api/services/app/LeaveRequestUser/EditLeaveRequest', data);
    },
    deleteLeaveRequest(id: number): Promise<any> {
        return apiClient.delete(`/api/services/app/LeaveRequestUser/DeleteLeaveRequest?id=${id}`);
    },
    getLeaveRequestById(id: number): Promise<any> {
        return apiClient.get(`/api/services/app/LeaveRequestUser/GetLeaveRequestById?id=${id}`);
    },
    reSendLeaveRequest(id: number): Promise<any> {
        return apiClient.post(`/api/services/app/LeaveRequestUser/ReSendLeaveRequest?id=${id}`);
    },
    sendLeaveRequest(id: number): Promise<any> {
        return apiClient.post(`/api/services/app/LeaveRequestUser/SendLeaveRequest?id=${id}`);
    },
    getFile(filePath: string): Promise<any> {
        return apiClient.get(`/api/services/app/LeaveRequestUser/GetFile?filepath=${filePath}`);
    },
};
export default leaveRequestUserApi;
