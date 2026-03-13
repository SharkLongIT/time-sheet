import apiClient from "./apiClient";

const leaveRequestApi = {

    getAllCategoryUnitLeaveRequest(): Promise<any> {
        return apiClient.get('/api/services/app/LeaveRequest/GetAllCategoryUnitLeaveRequest');
    },
    updateLeaveRequest(data: any): Promise<any> {
        return apiClient.put('/api/services/app/LeaveRequest/UpdateLeaveRequest', data);
    },
    deleteLeaveRequest(id: number): Promise<any> {
        return apiClient.delete(`/api/services/app/LeaveRequest/DeleteLeaveRequest?id=${id}`);
    },
};
export default leaveRequestApi;
