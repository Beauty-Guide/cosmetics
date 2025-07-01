import apiClient from './adminApi';
import { Cosmetic } from '../types'; // Предполагается, что типы вынесены в отдельный файл

export const addCosmetic = async (cosmetic: Cosmetic): Promise<any> => {
    try {
        const response = await apiClient.post('/admin/cosmetic/addCosmetic', cosmetic);
        return response.data; // обычно ответ API находится в .data
    } catch (err: any) {
        throw err; // важно пробросить ошибку, чтобы catch сработал на уровне вызова
    }
};
