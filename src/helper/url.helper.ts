import apiClient from "~/api/apiClient";

export const buildUrl = (path: string) => {
    const baseUrl = apiClient.defaults.baseURL?.replace(/\/+$/, '');
    const finalPath = path.replace(/^\/+/, '');
    return `${baseUrl}/${finalPath}`;
};