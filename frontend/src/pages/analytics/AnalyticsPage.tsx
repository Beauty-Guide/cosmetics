// @/pages/analytics/AnalyticsPage.tsx
import React, { useEffect, useState } from 'react';
import { getAnalyticsStats, getBrandSearchAnalytics } from '@/services/analyticsApi';
import BrandSearchAnalyticsTable from '@/pages/analytics/charts/BrandSearchAnalyticsTable.tsx';
import SimpleBarChart from "@/pages/analytics/charts/SimpleBarChart.tsx";
import SimplePieChart from "@/pages/analytics/charts/SimplePieChart.tsx";
import { Input } from "@/components/ui/input.tsx";

interface CountItem {
    label: string;
    count: number;
}

interface Stats {
    brands: CountItem[];
    skinTypes: CountItem[];
    actions: CountItem[];
}

export default function AnalyticsPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [brandSearchData, setBrandSearchData] = useState<any[]>([]); // 存储 BrandSearchAnalyticsTable 的数据

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const today = new Date();
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

                setStartDate(oneMonthAgo.toISOString().split('T')[0]);
                setEndDate(today.toISOString().split('T')[0]);
                const statsData = await getAnalyticsStats(startDate, endDate);
                setStats(statsData);

                const brandSearchData = await getBrandSearchAnalytics(startDate, endDate);
                setBrandSearchData(brandSearchData);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        };

        fetchAnalytics();
    }, [startDate, endDate]);

    if (!stats || !brandSearchData) return <div>Loading...</div>;

    return (
        <div className={"p-6 mb-6"}>
            <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6 mb-6">
            <h3 className="text-lg font-medium mb-2">Аналитика по времени</h3>

            <div className="mb-4 flex flex-col md:flex-row items-center md:space-x-4">
                <div className="flex items-center space-x-2">
                    <label className="mr-2">Дата начала</label>
                    <Input
                        type="date"
                        value={startDate || ''}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border p-1 md:w-48"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <label className="ml-2 mr-2">Дата конца</label>
                    <Input
                        type="date"
                        value={endDate || ''}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border p-1 md:w-48"
                    />
                </div>
            </div>

            <h3 className="text-lg font-medium mb-2">Топ: Бренды</h3>
            <SimpleBarChart data={stats.brands} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-medium mb-2">Топ: Типы кожи</h3>
                    <SimplePieChart data={stats.skinTypes} />
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-2">Топ: Действия</h3>
                    <SimplePieChart data={stats.actions} />
                </div>
            </div>

            <BrandSearchAnalyticsTable data={brandSearchData} />
        </div>
        </div>
    );
}