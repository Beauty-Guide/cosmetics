import apiClient from "@/api/apiClient.ts";


export interface CountItem {
    label: string;
    count: number;
}

export interface Stats {
    brands: CountItem[];
    skinTypes: CountItem[];
    actions: CountItem[];
}

export interface BrandSearchStats {
    brand: string;
    skinTypes: CountItem[];
    actions: CountItem[];
    queries: CountItem[];
}

interface FavoriteCosmeticCount {
    id: number;
    name: string;
    favoriteCount: number;
}
interface ProductViewCount {
    id: number;
    name: string;
    viewCount: number;
}

interface TopViewedCosmetic {
    cosmeticId: number;
    name: string;
    viewCount: number;
}

export const getTopViewedCosmetics = async (
    startDate: string | null,
    endDate: string | null,
    countryId?: string | null
): Promise<TopViewedCosmetic[]> => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (countryId) params.countryId = countryId[0];

    try {
        const response = await apiClient.get<TopViewedCosmetic[]>('/api/analytics/getTopViewedCosmetics', { params });
        return response.data;
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        throw error;
    }
};

export const getViewedProducts = async (
    cosmeticIds: number[] | null,
    startDate: string | null,
    endDate: string | null,
    countryId?: string | null
): Promise<ProductViewCount[]> => {
    const data = {} as any;
    const params = {} as any;

    if (cosmeticIds) data.cosmeticIds = cosmeticIds;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (countryId) params.countryId = countryId[0];

    try {
        const response = await apiClient.post<ProductViewCount[]>('/api/analytics/getViews', data, { params });
        return response.data;
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        throw error;
    }
};
export const getAnalyticViewsDayAllProducts = async (startDate?: string | null, endDate?: string | null, countryId?: string | null): Promise<ProductViewCount[]> => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (countryId) params.countryId = countryId[0];

    try {
        const response = await apiClient.get<ProductViewCount[]>('/api/analytics/analyticViewsDayAllProducts', { params });
        return response.data;
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        throw error;
    }
};

export const getTopFavoriteCosmetics = async (startDate?: string | null, endDate?: string | null, countryId?: string | null): Promise<FavoriteCosmeticCount[]> => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (countryId) params.countryId = countryId[0];

    try {
        const response = await apiClient.get('/api/analytics/topFavorite', { params });
        return response.data;
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        throw error;
    }
};

export const getTopFavoriteCosmeticBags = async (startDate?: string | null, endDate?: string | null, countryId?: string | null): Promise<FavoriteCosmeticCount[]> => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (countryId) params.countryId = countryId[0];

    try {
        const response = await apiClient.get('/api/analytics/topFavoriteCosmeticBags', { params });
        return response.data;
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        throw error;
    }
};

export const getAnalyticsStats = async (startDate?: string | null, endDate?: string | null, lang?: string | null, countryId?: string | null) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (lang) params.lang = lang;
    if (countryId) params.countryId = countryId[0];
    const response = await apiClient.get('/api/analytics/statsSearchFilter', { params });
    return response.data;
};

export const getBrandSearchAnalytics = async (startDate?: string | null, endDate?: string | null, lang?: string | null, countryId?: string | null) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (lang) params.lang = lang;
    if (countryId) params.countryId = countryId[0];
    const response = await apiClient.get('/api/analytics/brand-search-stats', { params });
    return response.data;
};

export const getClickCounts= async (
    cosmeticIds: number[] | null,
    startDate: string | null,
    endDate: string | null,
    countryId?: string | null
): Promise<ProductViewCount[]> => {    const params = {};
    if (cosmeticIds) params.cosmeticIds = cosmeticIds;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (countryId) params.countryId = countryId[0];
    const response = await apiClient.get('/api/analytics/clicks', { params });
    return response.data;
};

export interface CountryResponse {
    id: number;
    name: string;
    cities: CityResponse[];
}

export interface CityResponse {
    id: number;
    name: string;
}

export const getCountries = async (lang?: string | null): Promise<{id: string, name: string}[]> => {
    try {
        const response = await apiClient.get<CountryResponse[]>('/api/analytics/locations', {
            params: {
                lang: lang || 'en' // default to English if not specified
            }
        });
        return response.data.map(country => ({
            id: String(country.id),
            name: country.name
        }));
    } catch (error) {
        console.error('Error fetching countries:', error);
        throw error;
    }
};

