import type {SkinTypeView, User} from "@/model/types.ts";
import apiClient from "@/hooks/apiClient.ts";

export const getAllSeller = async (): Promise<User[]> => {
    try {
        const response = await apiClient.get('/api/seller/getAllSeller');
        return response.data;
    } catch (error) {
        throw new Error('Ошибка при получении данных');
    }
};