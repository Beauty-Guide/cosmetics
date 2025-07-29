// @/pages/analytics/AnalyticsPage.tsx
import React, {useCallback, useEffect, useState} from 'react';
import {
    getAnalyticsStats,
    getAnalyticViewsDayAllProducts,
    getBrandSearchAnalytics,
    getTopViewedCosmetics,
    getViewedProducts
} from '@/services/analyticsApi';
import BrandSearchAnalyticsTable from '@/pages/analytics/charts/BrandSearchAnalyticsTable.tsx';
import SimpleBarChart from "@/pages/analytics/charts/SimpleBarChart.tsx";
import SimplePieChart from "@/pages/analytics/charts/SimplePieChart.tsx";
import {Input} from "@/components/ui/input.tsx";
import FavoriteCosmeticCount from "@/pages/analytics/charts/FavoriteCosmeticCount.tsx";
import TopViewedProducts from "@/pages/analytics/charts/TopViewedProducts.tsx";
import type {CosmeticResponse} from "@/model/types.ts";
import CosmeticViewsMultiChart from "@/pages/analytics/charts/CosmeticViewsMultiChart.tsx";
import {getAllCosmetics} from "@/services/adminCosmeticApi.ts";

interface CountItem {
    label: string;
    count: number;
}

interface Stats {
    brands: CountItem[];
    skinTypes: CountItem[];
    actions: CountItem[];
}

interface AnalyticViewedCosmetic {
    cosmeticId: number;
    name: string;
    viewCount: number;
    date: string;
}

export default function AnalyticsPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [brandSearchData, setBrandSearchData] = useState<any[]>([]);
    const [analyticViewsDayAllProducts, setAnalyticViewsDayAllProducts] = useState<any[]>([]);
    const [cosmetics, setCosmetics] = useState<CosmeticResponse[]>([]);
    const [topViewedCosmetics, setTopViewedCosmetics] = useState<any[]>([]);
    const [viewsData, setViewsData] = useState<Map<number, AnalyticViewedCosmetic[]>>(new Map());
    const [isLoading, setIsLoading] = useState(true);

    // Инициализация дат при первом рендере
    useEffect(() => {
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        setStartDate(oneMonthAgo.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
    }, []);

    const fetchAnalytics = useCallback(async (start: string, end: string) => {
        try {
            setIsLoading(true);

            const [
                statsData,
                brandSearchData,
                analyticViewsDayAllProductsData,
                topViewedCosmeticsData,
                allCosmetics
            ] = await Promise.all([
                getAnalyticsStats(start, end),
                getBrandSearchAnalytics(start, end),
                getAnalyticViewsDayAllProducts(start, end),
                getTopViewedCosmetics(start, end),
                getAllCosmetics()
            ]);

            setStats(statsData);
            setBrandSearchData(brandSearchData);
            setAnalyticViewsDayAllProducts(analyticViewsDayAllProductsData);
            setTopViewedCosmetics(topViewedCosmeticsData);
            setCosmetics(allCosmetics.cosmetics);

            const viewedSelectedData = await getViewedProducts([], start, end);
            const dataMap = new Map(Object.entries(viewedSelectedData).map(([key, value]) => [
                parseInt(key),
                (value as unknown as AnalyticViewedCosmetic[]).map(item => ({
                    ...item,
                    date: new Date(item.date).toISOString().split('T')[0]
                }))
            ]));
            setViewsData(dataMap);

        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Загрузка данных при изменении дат с debounce
    useEffect(() => {
        if (!startDate || !endDate) return;

        const timer = setTimeout(() => {
            fetchAnalytics(startDate, endDate);
        }, 500);

        return () => clearTimeout(timer);
    }, [startDate, endDate, fetchAnalytics]);

    if (isLoading) return <div>Loading...</div>;
    if (!stats || !brandSearchData) return <div>No data available</div>;

    return (
        <div className={"p-6 mb-6"} style={{backgroundColor: '#EDEDED'}}>
            <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6 mb-6">
                <h3 className="text-lg font-medium mb-2">Аналитика по времени</h3>
                <div className="mb-4 flex flex-col md:flex-row items-center md:space-x-4">
                    <div className="flex items-center space-x-2">
                        <label className="mr-2">Дата начала</label>
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border p-1 md:w-48"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <label className="ml-2 mr-2">Дата конца</label>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border p-1 md:w-48"
                        />
                    </div>
                </div>
                <div className="border-t border-gray-300 pt-6"/>
                <TopViewedProducts data={analyticViewsDayAllProducts}/>
                <CosmeticViewsMultiChart
                    data={viewsData}
                    cosmetics={cosmetics}
                    topViewedCosmetics={topViewedCosmetics}
                    startDate={startDate}
                    endDate={endDate}
                />
                <FavoriteCosmeticCount/>
                <SimpleBarChart description={"Просмотров"} data={stats.brands} title={"Топ: Бренды"}/>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><SimplePieChart data={stats.skinTypes} title={"Топ: Типы кожи"}/></div>
                    <div><SimplePieChart data={stats.actions} title={"Топ: Действия"}/></div>
                </div>

                <BrandSearchAnalyticsTable data={brandSearchData}/>
            </div>
        </div>
    );
}