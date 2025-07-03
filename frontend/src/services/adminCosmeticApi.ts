import apiClient from './adminApi';
import type {Cosmetic} from '../model/types'; // Предполагается, что типы вынесены в отдельный файл
// Предполагается, что типы вынесены в отдельный файл

export const addCosmetic = async (cosmetic: Cosmetic): Promise<any> => {
  try {
    const response = await apiClient.post('/admin/cosmetic/addCosmetic', cosmetic);
    return response.data; // обычно ответ API находится в .data
  } catch (err: any) {
    throw err; // важно пробросить ошибку, чтобы catch сработал на уровне вызова
  }
};

export const getAllCosmetics = async (): Promise<Cosmetic[]> => {
  const response = await apiClient.get('/admin/cosmetic/getAllCosmetic');
  return response.data;
};

export const deleteCosmetic = async (id: number): Promise<void> => {
  await apiClient.delete(`/remove/${id}`);
};