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


export const getAnalyticsStats = async (startDate?: string, endDate?: string) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await apiClient.get('/api/analytics/statsSearchFilter', { params });
    return response.data;
};

export const getBrandSearchAnalytics = async (startDate?: string, endDate?: string) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await apiClient.get('/api/analytics/brand-search-stats', { params });
    return response.data;
};