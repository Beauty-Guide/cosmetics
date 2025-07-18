import apiClient from '@/hooks/apiClient';
import type {CosmeticActionAdd, CosmeticActionView} from '../model/types';

export const addCosmeticAction = async (action: CosmeticActionAdd): Promise<void> => {
  try {
    await apiClient.post('/admin/cosmetic-action/addCosmeticAction', action);
  } catch (error) {
    throw new Error('Ошибка добавления действия косметики');
  }
};

export const getAllCosmeticActions = async (): Promise<CosmeticActionView[]> => {
  try {
    const response = await apiClient.get('/admin/cosmetic-action/getAllCosmeticAction');
    return response.data;
  } catch (error) {
    throw new Error('Ошибка при получении данных');
  }
};

export const updateCosmeticAction = async (id: number, data: { name: string }) => {
  const response = await apiClient.put(`/admin/cosmetic-action/updateCosmeticAction/${id}`, data);
  return response.data;
};

export const deleteCosmeticAction = async (id: number): Promise<boolean> => {
  try {
    const response = await apiClient.delete(`/admin/cosmetic-action/deleteCosmeticAction/${id}`);
    return response.status === 200;
  } catch (err: any) {
    if (err.response?.status === 409) {
      throw err.response.data;
    }
    return false;
  }
};