import apiClient from '@/hooks/apiClient';
import type {Ingredient, IngredientView} from '../model/types';

export const addIngredient = async (ingredient: Ingredient): Promise<void> => {
  try {
    await apiClient.post('/admin/ingredient/addIngredient', ingredient);
  } catch (error) {
    throw new Error('Ошибка добавления ингредиента');
  }
};

export const getAllIngredients = async (): Promise<IngredientView[]> => {
  try {
    const response = await apiClient.get('/admin/ingredient/getAllIngredient');
    return response.data;
  } catch (error) {
    throw new Error('Ошибка при получении данных');
  }
};

export const updateIngredient = async (id: number, data: { name?: string }) => {
  try {
    const response = await apiClient.put(`/admin/ingredient/updateIngredient/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Ошибка обновления ингредиента');
  }
};

export const deleteIngredient = async (id: number): Promise<boolean> => {
  try {
    const response = await apiClient.delete(`/admin/ingredient/deleteIngredient/${id}`);
    return response.status === 200;
  } catch (err: any) {
    if (err.response?.status === 409) {
      throw err.response.data;
    }
    return false;
  }
};