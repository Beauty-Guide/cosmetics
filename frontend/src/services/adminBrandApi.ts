import apiClient from './adminApi'; //
import {type BrandView} from '../model/types';

// === API методы ===
export const getAllBrands = async (): Promise<BrandView[]> => {
  const response = await apiClient.get('/admin/brand/getAllBrand');
  return response.data;
};

export const addBrand = async (brand: { name: string }): Promise<void> => {
  await apiClient.post('/admin/brand/addBrand', brand);
};

export const updateBrand = async (id: number, data: { name: string }) => {
  const response = await apiClient.put(`/admin/brand/updateBrand/${id}`, data);
  return response.data;
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
