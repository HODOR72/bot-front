import ApiClients from '../../utils/axios';
import { ImageResize, PostFileResponse } from '../../@types/files';

const { axiosBase } = ApiClients

export function uploadFileThunk(file: File) {
    return async () => {
        try {
            const formData = new FormData();
            formData.append(`file`, file);

            const response: { data: { data: PostFileResponse } } = await axiosBase.post(`api/v1/files/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.data.id;
        } catch (error) {
        }
        return false;
    }
}

export function getImageThunk(path: string, width: number, height: number, type: ImageResize) {
    return async () => {
        try {
            const response = await axiosBase.get(`api/v1/files/image/${path}/${width}/${height}/${type}`, {
                responseType: 'blob',
            });

            return response.data;
        } catch(error) {
        }
    }
}
