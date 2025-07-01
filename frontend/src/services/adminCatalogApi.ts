import apiClient from './adminApi'; //
import {Catalog} from '../model/types';

export const addCatalog = async (catalog: Catalog): Promise<void> => {
    try {
        await apiClient.post('/admin/catalog/addCatalog', catalog);
    } catch (error) {
        throw new Error('Ошибка добавления каталога');
    }
};

export const getAllCatalogs = async (): Promise<Catalog[]> => {
    try {
        const response = await apiClient.get('/admin/catalog/getAllCatalogs');
        return response.data;
    } catch (error) {
        throw new Error('Ошибка при получении данных');
    }
};