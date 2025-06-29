// src/services/adminApi.ts
import axios from 'axios';

// const apiClient = axios.create({
//     baseURL: 'http://localhost:8080', // URL Spring Boot backend
//     withCredentials: true, // если используется Spring Security и сессии
// });


//токен берем из куков или локалсторедж statemanager react  mobx redacs
const apiClient = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX0FETUlOIl0sInN1YiI6ImFkbWluIiwiaWF0IjoxNzUxMTk1MzUxLCJleHAiOjE3NTExOTU5NTF9.dlXSoQo1xVPAUQn858CRQg5SLpBOylblU79qhWBxu8Y`,
    },
});

export const addCosmetic = async (cosmetic: Cosmetic) => {
    try {
        const response = await apiClient.post('/admin/addCosmetic', cosmetic);
        return response.data;
    } catch (error) {
        throw new Error('Ошибка добавления косметики');
    }
};

export const addSkinType = async (skinType: SkinType) => {
    try {
        const response = await apiClient.post('/admin/addSkinType', skinType);
        return response.data;
    } catch (error) {
        throw new Error('Ошибка добавления типа кожи');
    }
};

export const addCosmeticAction = async (action: CosmeticActionAdd) => {
    try {
        const response = await apiClient.post('/admin/addCosmeticAction', action);
        return response.data;
    } catch (error) {
        throw new Error('Ошибка добавления действия косметики');
    }
};

export const getAllCosmeticActions = async (): Promise<CosmeticActionView[]> => {
    try {
        const response = await apiClient.get('/admin/getAllCosmeticAction');
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            throw new Error('Не удалось загрузить данные');
        }
    } catch (error) {
        throw new Error('Ошибка при получении данных');
    }
};


export const getAllSkinType = async (): Promise<SkinTypeView[]> => {
    try {
        const response = await apiClient.get('/admin/getAllSkinType');
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            throw new Error('Не удалось загрузить данные');
        }
    } catch (error) {
        throw new Error('Ошибка при получении данных');
    }
};

export interface AppError {
    code: number;
    message: string;
}

export const deleteCosmeticAction = async (id: number): Promise<void> => {
    try {
        const response = await apiClient.delete('/admin/deleteCosmeticAction/' + id);
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error: any) {
        let errorMessage = 'Ошибка удаления';
        // Проверяем, есть ли ответ от сервера и он содержит JSON
        if (error.response?.data) {
            const serverError: AppError = error.response.data;
            errorMessage = serverError.message || errorMessage;
        }

        throw new Error(errorMessage);
    }
};

export const deleteSkinType = async (id: number): Promise<void> => {
    try {
        const response = await apiClient.delete('/admin/deleteSkinType/' + id);
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            throw new Error('Ошибка удаления');
        }
    } catch (error) {
        throw new Error('Ошибка удаления');
    }
};

export const addCatalog = async (action: Catalog) => {
    try {
        const response = await apiClient.post('/admin/addCatalog', action);
        return response.data;
    } catch (error) {
        throw new Error('Ошибка добавления действия косметики');
    }
};

// Получение всех каталогов (для выбора родителя)
export const getAllCatalogs = async (): Promise<Catalog[]> => {
    try {
        const response = await apiClient.get('/admin/getAllCatalogs');
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            throw new Error('Не удалось загрузить данные');
        }
    } catch (error) {
        throw new Error('Ошибка при получении данных');
    }
};

export interface Catalog {
    id?: number;
    name: string;
    parentId?: number | null;
    children?: Catalog[]; // <-- добавлено для поддержки иерархии
}

// Типы
export type Cosmetic = {
    name: string;
    description?: string;

    brandId: number;
    catalogId: number;

    keyIngredientIds: number[];
    actionIds: number[];
    skinTypeIds: number[];

    compatibility?: string;
    usageRecommendations?: string;
    applicationMethod?: string;

    imageUrls?: string[]; // необязательное поле, можно заполнить потом
};

export interface CatalogDto {
    id: number;
    name: string;
    parentId?: number | null;
    children?: CatalogDto[];
}

export type SkinType = {
    name: string;
};

export type SkinTypeView = {
    id: number;
    name: string;
};

export type CosmeticActionAdd = {
    name: string;
};

export type CosmeticActionView = {
    id: number;
    name: string;
};