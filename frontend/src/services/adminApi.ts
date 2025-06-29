import axios, { AxiosInstance } from 'axios';

// Создаем экземпляр Axios
const apiClient: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // URL Spring Boot backend
});

// Перехватчик запросов — добавляем токен из localStorage
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// === API методы ===

export const addCosmetic = async (cosmetic: Cosmetic) => {
    try {
        const response = await apiClient.post('/admin/cosmetic/addCosmetic', cosmetic);
        return response.data;
    } catch (error) {
        throw new Error('Ошибка добавления косметики');
    }
};

export const addSkinType = async (skinType: SkinType) => {
    try {
        const response = await apiClient.post('/admin/skin-type/addSkinType', skinType);
        return response.data;
    } catch (error) {
        throw new Error('Ошибка добавления типа кожи');
    }
};

export const addCosmeticAction = async (action: CosmeticActionAdd) => {
    try {
        const response = await apiClient.post('/admin/cosmetic-action/addCosmeticAction', action);
        return response.data;
    } catch (error) {
        throw new Error('Ошибка добавления действия косметики');
    }
};

export const getAllCosmeticActions = async (): Promise<CosmeticActionView[]> => {
    try {
        const response = await apiClient.get('/admin/cosmetic-action/getAllCosmeticAction');
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
        const response = await apiClient.get('/admin/skin-type/getAllSkinType');
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
        const response = await apiClient.delete('/admin/cosmetic-action/deleteCosmeticAction/' + id);
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            throw new Error(response.data.message || 'Ошибка удаления');
        }
    } catch (error: any) {
        let errorMessage = 'Ошибка удаления';
        if (error.response?.data) {
            const serverError: AppError = error.response.data;
            errorMessage = serverError.message || errorMessage;
        }

        throw new Error(errorMessage);
    }
};

export const deleteSkinType = async (id: number): Promise<void> => {
    try {
        const response = await apiClient.delete('/admin/skin-type/deleteSkinType/' + id);
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            throw new Error('Ошибка удаления');
        }
    } catch (error) {
        throw new Error('Ошибка удаления');
    }
};

export const addCatalog = async (catalog: Catalog) => {
    try {
        const response = await apiClient.post('/admin/catalog/addCatalog', catalog);
        return response.data;
    } catch (error) {
        throw new Error('Ошибка добавления каталога');
    }
};

export const getAllCatalogs = async (): Promise<Catalog[]> => {
    try {
        const response = await apiClient.get('/admin/catalog/getAllCatalogs');
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            throw new Error('Не удалось загрузить данные');
        }
    } catch (error) {
        throw new Error('Ошибка при получении данных');
    }
};

// === Типы ===

export interface Catalog {
    id?: number;
    name: string;
    parentId?: number | null;
    children?: Catalog[];
}

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

    imageUrls?: string[]; // необязательное поле
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