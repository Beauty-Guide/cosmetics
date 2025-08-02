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
import {Button} from "@/components/ui/button.tsx";
import {useTranslation} from "react-i18next";

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
    const [isLoading, setIsLoading] = useState(false); // Изменено начальное значение на false
    const { t } = useTranslation();
    const { i18n } = useTranslation();

    useEffect(() => {
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        setStartDate(oneMonthAgo.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);

        // Вызываем fetchAnalytics автоматически при первом рендере
        fetchAnalytics(oneMonthAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]);
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
                getAnalyticsStats(start, end, i18n.language),
                getBrandSearchAnalytics(start, end, i18n.language),
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
    }, [i18n.language]);

    const handleShowClick = () => {
        if (startDate && endDate) {
            fetchAnalytics(startDate, endDate);
        }
    };

    return (
        <div className="p-2 sm:p-4 md:p-6 mb-6 bg-gray-100">
            <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-3 sm:p-6 mb-6">
                <h3 className="text-lg font-medium mb-4">{t("analytics")}</h3>

                <div className="mb-6 flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
                    <div className="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <label className="text-sm sm:text-base">{t("analytics.startDate")}</label>
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full sm:w-48 p-2 text-sm"
                        />
                    </div>
                    <div className="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <label className="text-sm sm:text-base">{t("analytics.endDate")}</label>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full sm:w-48 p-2 text-sm"
                        />
                    </div>
                    <Button
                        onClick={handleShowClick}
                        className="w-full sm:w-auto mt-2 sm:mt-0"
                        disabled={isLoading || !startDate || !endDate}
                    >
                         {t("analytics.show")}
                    </Button>
                </div>

                {stats && (
                    <>
                        <div className="border-t border-gray-300 my-4"/>

                        <div className="space-y-6">
                            <TopViewedProducts data={analyticViewsDayAllProducts}/>
                            <CosmeticViewsMultiChart
                                data={viewsData}
                                cosmetics={cosmetics}
                                topViewedCosmetics={topViewedCosmetics}
                                startDate={startDate}
                                endDate={endDate}
                            />
                            <FavoriteCosmeticCount/>
                            <SimpleBarChart description={t("analytics.views")} data={stats.brands} title={t("analytics.top.brands")}/>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="min-w-0">
                                    <SimplePieChart data={stats.skinTypes} title={t("analytics.top.skinTypes")}/>
                                </div>
                                <div className="min-w-0">
                                    <SimplePieChart data={stats.actions} title={t("analytics.top.actions")}/>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <BrandSearchAnalyticsTable data={brandSearchData}/>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}