import apiClient from '@/hooks/apiClient';
import type {Cosmetic, CosmeticResponse} from '../model/types'; // Предполагается, что типы вынесены в отдельный файл
// Предполагается, что типы вынесены в отдельный файл

export const addCosmetic = async (cosmetic: Cosmetic): Promise<any> => {
  try {
    return await apiClient.post('/admin/cosmetic/addCosmetic', cosmetic);
  } catch (err: any) {
    throw new Error('Ошибка добавления косметики');
  }
};

export const getAllCosmetics = async (): Promise<CosmeticResponse[]> => {
  try {
    const response = await apiClient.get('/admin/cosmetic/getAllCosmetic');
    return response.data;
  } catch (err: any) {
    throw new Error('Ошибка при получении данных');
  }
};

export const updateCosmetic = async (id: number, data: { name: string }) => {
  try {
    const response = await apiClient.put(`/admin/cosmetic/updateCosmetic/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Ошибка обновления косметики');
  }
};

export const deleteCosmetic = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/cosmetic/deleteCosmetic/${id}`);
};

export const updateCosmeticCatalog = async (cosmeticId: number, catalogId: number): Promise<void> => {
  const response = await apiClient.put(`/admin/cosmetic/updateCosmeticCatalog/${cosmeticId}`, {
    catalogId,
  });
  return response.data;
};