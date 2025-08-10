import React, {useCallback, useEffect, useState} from 'react';
import {
    getAnalyticsStats,
    getAnalyticViewsDayAllProducts,
    getBrandSearchAnalytics,
    getClickCounts,
    getCountries, getTopFavoriteCosmetics,
    getTopViewedCosmetics,
    getViewedProducts
} from '@/services/analyticsApi';
import BrandSearchAnalyticsTable from '@/pages/analytics/charts/BrandSearchAnalyticsTable.tsx';
import SimpleBarChart from "@/pages/analytics/charts/SimpleBarChart.tsx";
import SimplePieChart from "@/pages/analytics/charts/SimplePieChart.tsx";
import {Input} from "@/components/ui/input.tsx";
import TopViewedProducts from "@/pages/analytics/charts/TopViewedProducts.tsx";
import type {CosmeticResponse} from "@/model/types.ts";
import CosmeticViewsMultiChart from "@/pages/analytics/charts/CosmeticViewsMultiChart.tsx";
import {getAllCosmetics} from "@/services/adminCosmeticApi.ts";
import {Button} from "@/components/ui/button.tsx";
import {useTranslation} from "react-i18next";
import CosmeticClicksChart from "@/pages/analytics/charts/CosmeticClicksChart.tsx";
import FilterCombobox from '@/components/HomeComponents/FilterCombobox';
import TopFavoriteCosmetics, {type FavoriteCosmetic} from "@/pages/analytics/charts/TopFavoriteCosmetics.tsx";

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
    const [viewsData1, setViewsData1] = useState<Map<number, AnalyticViewedCosmetic[]>>(new Map());
    const [favoriteCosmetics, setFavoriteCosmetics] = useState<FavoriteCosmetic[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const {t} = useTranslation();
    const {i18n} = useTranslation();
    const [countries, setCountries] = useState<{ id: string, name: string }[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string[]>([]);

    useEffect(() => {
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        setStartDate(oneMonthAgo.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);

        fetchAnalytics(oneMonthAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]);
    }, []);

    useEffect(() => {
        getCountries(i18n.language).then((data) => {
            // Добавляем дефолтное значение "Все" в начало массива стран
            setCountries([
                {
                    id: 'all',
                    name: t("analytics.country.all")
                },
                {
                    id: 'withoutLocation',
                    name: t("analytics.country.withoutLocation")
                },
                ...data
            ]);
            setSelectedCountry(['all'])
        });
    }, []);

    const fetchAnalytics = useCallback(async (start: string, end: string, countryId?: string) => {
        try {
            setIsLoading(true);

            const [
                statsData,
                brandSearchData,
                analyticViewsDayAllProductsData,
                topViewedCosmeticsData,
                allCosmetics,
                topFavoriteCosmeticsData
            ] = await Promise.all([
                getAnalyticsStats(start, end, i18n.language, countryId),
                getBrandSearchAnalytics(start, end, i18n.language, countryId),
                getAnalyticViewsDayAllProducts(start, end, countryId),
                getTopViewedCosmetics(start, end, countryId),
                getAllCosmetics(),
                getTopFavoriteCosmetics(start, end, countryId),
            ]);

            setStats(statsData);
            setBrandSearchData(brandSearchData);
            setAnalyticViewsDayAllProducts(analyticViewsDayAllProductsData);
            setTopViewedCosmetics(topViewedCosmeticsData);
            setCosmetics(allCosmetics.cosmetics);
            setFavoriteCosmetics(topFavoriteCosmeticsData);

            const viewedSelectedData = await getViewedProducts([], start, end, countryId);
            const dataMap = new Map(Object.entries(viewedSelectedData).map(([key, value]) => [
                parseInt(key),
                (value as unknown as AnalyticViewedCosmetic[]).map(item => ({
                    ...item,
                    date: new Date(item.date).toISOString().split('T')[0]
                }))
            ]));
            setViewsData(dataMap);

            const viewedSelectedData1 = await getClickCounts([], start, end, countryId);
            const dataMap1 = new Map(Object.entries(viewedSelectedData1).map(([key, value]) => [
                parseInt(key),
                (value as unknown as AnalyticViewedCosmetic[]).map(item => ({
                    ...item,
                    date: new Date(item.date).toISOString().split('T')[0]
                }))
            ]));
            setViewsData1(dataMap1);

        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        } finally {
            setIsLoading(false);
        }
    }, [i18n.language, selectedCountry]); // Добавляем selectedCountry в зависимости

    const handleShowClick = () => {
        if (startDate && endDate) {
            fetchAnalytics(startDate, endDate, selectedCountry);
        }
    };


    return (
        <div className="p-2 sm:p-4 md:p-6 mb-6 bg-gray-100">
            <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-3 sm:p-6 mb-6">
                <h3 className="text-lg font-medium mb-4">{t("analytics")}</h3>

                <div className="mb-6 grid grid-cols-1 gap-4 sm:flex sm:items-center sm:space-x-4">
                    {/* Start Date Field */}
                    <div className="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                        <label htmlFor="start-date" className="text-sm sm:text-base font-medium text-gray-700">
                            {t("analytics.startDate")}
                        </label>
                        <Input
                            id="start-date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full sm:w-48 p-2 text-sm border-gray-300 rounded-md shadow-sm"
                            aria-label={t("analytics.startDate")}
                        />
                    </div>

                    {/* End Date Field */}
                    <div className="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                        <label htmlFor="end-date" className="text-sm sm:text-base font-medium text-gray-700">
                            {t("analytics.endDate")}
                        </label>
                        <Input
                            id="end-date"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full sm:w-48 p-2 text-sm border-gray-300 rounded-md shadow-sm"
                            aria-label={t("analytics.endDate")}
                        />
                    </div>

                    {/* Country Filter */}
                    {countries.length > 0 && (
                        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                            <label htmlFor="country-filter" className="text-sm sm:text-base font-medium text-gray-700">
                                {t("analytics.country")}
                            </label>
                            <FilterCombobox
                                label={""}
                                options={countries}
                                values={selectedCountry}
                                onChange={setSelectedCountry}
                                singleSelect
                                className="w-full sm:w-64"
                                aria-label={t("analytics.countryFilter")}
                            />
                        </div>
                    )}

                    {/* Show Button */}
                    <Button
                        onClick={handleShowClick}
                        className="w-full sm:w-auto px-4 py-2"
                        disabled={isLoading || !startDate || !endDate}
                        aria-label={t("analytics.showData")}
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
                            <CosmeticClicksChart
                                data={viewsData1}
                                startDate={startDate}
                                endDate={endDate}
                                cosmetics={cosmetics}
                            />
                            <TopFavoriteCosmetics
                                data={favoriteCosmetics}
                                startDate={startDate}
                                endDate={endDate}
                                />
                            <SimpleBarChart description={t("analytics.views")} data={stats.brands}
                                            title={t("analytics.top.brands")}/>

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