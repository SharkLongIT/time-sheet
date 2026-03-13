import apiClient from "./apiClient";

const leaveRequestAttApi = {

    uploadFileFromMobile(data: any): Promise<any> {
        return apiClient.post('/api/services/app/LeaveRequestAtt/UploadFileFromMobile', { params: data });
    },
    uploadFileFe(data: any): Promise<any> {
        return apiClient.post('/api/services/app/LeaveRequestAtt/UploadFileFe', { params: data });
    },
    createLeavRequestAtt(data: any): Promise<any> {
        return apiClient.post('/api/services/app/LeaveRequestAtt/CreateLeavRequestAtt', data);
    },
    updateLeavRequestAtt(data: any): Promise<any> {
        return apiClient.put('/api/services/app/LeaveRequestAtt/UpdateLeavRequestAtt', data);
    },
    saveLeaveRequestAtt(data: any): Promise<any> {
        return apiClient.post('/api/services/app/LeaveRequestAtt/SaveLeaveRequestAtt', data);
    },
};
export default leaveRequestAttApi;
