import React, {useEffect, useMemo, useState} from 'react';
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import FilterCombobox from "@/components/HomeComponents/FilterCombobox.tsx";
import type {CosmeticResponse} from "@/model/types.ts";
import {useTranslation} from "react-i18next";

interface AnalyticViewedCosmetic {
    cosmeticId: number;
    name: string;
    viewCount: number;
    date: string;
}

interface CosmeticViewsMultiChartProps {
    data: Map<number, AnalyticViewedCosmetic[]>;
    cosmetics: CosmeticResponse[];
    topViewedCosmetics: CosmeticResponse[];
    startDate?: string;
    endDate?: string;
}

const CustomTooltip = ({active, payload, label}: any) => {
    if (active && payload && payload.length > 0) {
        const filteredPayload = payload.filter((entry: any) => entry.value > 0);
        if (filteredPayload.length === 0) return null;

        return (
            <div className="custom-tooltip bg-white border border-gray-300 rounded-lg shadow-md p-4">
                <p className="label text-gray-700 font-semibold">{`Дата: ${label}`}</p>
                {filteredPayload.map((entry: any, index: number) => (
                    <p key={index} className="desc text-gray-500 text-sm">
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const CosmeticViewsMultiChart: React.FC<CosmeticViewsMultiChartProps> = ({
                                                                             data,
                                                                             cosmetics,
                                                                             topViewedCosmetics,
                                                                             startDate,
                                                                             endDate
                                                                         }) => {
    const [selectedCosmetics, setSelectedCosmetics] = useState<string[]>([]);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const { t } = useTranslation()
    const colorPalette = useMemo(() => [
        '#8884d8', '#82ca9d', '#ffc658',
        '#ff8042', '#0088FE', '#00C49F',
        '#FFBB28', '#FF8042', '#A4DE6C'
    ], []);

    useEffect(() => {
        if (topViewedCosmetics.length > 0) {
            const initialCosmeticIds = topViewedCosmetics.map((cosmetic) => String(cosmetic.cosmeticId));
            setSelectedCosmetics(initialCosmeticIds);
        }
    }, [topViewedCosmetics]);

    const { chartData, maxViewCount } = useMemo(() => {
        if (data.size === 0) return { chartData: [], maxViewCount: 0 };

        const allDates = new Set<string>();
        const allViewCounts: number[] = [];

        data.forEach((views) => {
            views.forEach((view) => {
                allDates.add(view.date);
                allViewCounts.push(view.viewCount);
            });
        });

        const sortedDates = Array.from(allDates).sort();
        const chartData = sortedDates.map((date) => {
            const dateEntry: any = {date};
            data.forEach((views, cosmeticId) => {
                if (selectedCosmetics.length === 0 || selectedCosmetics.includes(String(cosmeticId))) {
                    const viewForDate = views.find((v) => v.date === date);
                    dateEntry[`${views[0].name}`] = viewForDate ? viewForDate.viewCount : 0;
                }
            });
            return dateEntry;
        });

        // Находим максимальное значение просмотров среди всех данных
        const maxViewCount = Math.max(...allViewCounts, 1);
        return { chartData, maxViewCount };
    }, [data, selectedCosmetics]);

    if (data.size === 0) {
        return (
            <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-4 sm:p-6 mb-6">
                <h3 className="text-lg font-medium mb-4">{t("analytics.selected.product.views")}</h3>
                <p>{t("analytics.brand.search.no.data")}</p>
            </div>
        );
    }

    // Добавляем 10% к максимальному значению для лучшего отображения
    const domainMax = Math.ceil(maxViewCount * 1.1);

    return (
        <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-4 sm:p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">{t("analytics.selected.product.views")}</h3>

            <div className="mb-4">
                <FilterCombobox
                    label=""
                    onChange={(selectedIds) => {
                        setSelectedCosmetics(selectedIds);
                    }}
                    options={cosmetics}
                    values={selectedCosmetics}
                    hasMaxWidth={false}
                />
            </div>

            <div className="w-full h-[300px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 10,
                            left: 20,
                            bottom: 40
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                            tickMargin={10}
                            padding={{ bottom: 10 }}
                        />
                        <YAxis
                            domain={[0, domainMax]}
                            tickFormatter={(value) => Math.floor(value).toString()}
                            tick={{ fontSize: 12 }}
                            width={40}
                        />
                        <Tooltip
                            content={<CustomTooltip/>}
                            wrapperStyle={{ zIndex: 1000 }}
                        />
                        {selectedCosmetics.map((cosmeticId, index) => {
                            const productName = data.get(Number(cosmeticId))?.[0]?.name || '';
                            return (
                                <Line
                                    key={cosmeticId}
                                    type="monotone"
                                    dataKey={productName}
                                    stroke={colorPalette[index % colorPalette.length]}
                                    activeDot={{r: 8}}
                                />
                            );
                        })}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CosmeticViewsMultiChart;