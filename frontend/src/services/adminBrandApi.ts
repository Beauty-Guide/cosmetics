import apiClient from '@/hooks/apiClient';
import {type BrandView} from '../model/types';

// === API методы ===
export const getAllBrands = async (): Promise<BrandView[]> => {
  try {
    const response = await apiClient.get('/admin/brand/getAllBrand');
    return response.data;
  } catch (error) {
    throw new Error('Ошибка при получении данных');
  }
};

export const addBrand = async (brand: { name: string }): Promise<void> => {
  try {
    await apiClient.post('/admin/brand/addBrand', brand);
  } catch (error) {
    throw new Error('Ошибка добавления бренда');
  }
};

export const updateBrand = async (id: number, data: { name: string }) => {
  try {
    const response = await apiClient.put(`/admin/brand/updateBrand/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Ошибка при обновлении бренда');
  }
};

export const deleteBrand = async (id: number): Promise<boolean> => {
  try {
    const response = await apiClient.delete(`/admin/brand/deleteBrand/${id}`);
    return response.status === 200;
  } catch (err: any) {
    if (err.response?.status === 409) {
      throw err.response.data;
    }
    return false;
  }
};
