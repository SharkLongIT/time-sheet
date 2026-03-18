import userExporterApi from "~/api/userExporter.api"

export const getUserById = async (userId: number) => {
    const res = await userExporterApi.getUserById(userId);
    const data = res.data.result;
    return data;
}