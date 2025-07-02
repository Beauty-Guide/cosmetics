import apiClient from './adminApi'; //
import {BrandView} from '../model/types';

// === API методы ===
export const getAllBrands = async (): Promise<BrandView[]> => {
    const response = await apiClient.get('/admin/brand/getAllBrand');
    return response.data;
};

export const addBrand = async (brand: { name: string }): Promise<void> => {
    await apiClient.post('/admin/brand/addBrand', brand);
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
