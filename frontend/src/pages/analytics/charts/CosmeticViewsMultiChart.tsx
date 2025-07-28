// @/pages/analytics/charts/CosmeticViewsMultiChart.tsx
import React, {useEffect, useMemo, useState} from 'react';
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import FilterCombobox from "@/components/HomeComponents/FilterCombobox.tsx";
import type {CosmeticResponse} from "@/model/types.ts";

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

    const colorPalette = useMemo(() => [
        '#8884d8', '#82ca9d', '#ffc658',
        '#ff8042', '#0088FE', '#00C49F'
    ], []);

    useEffect(() => {
        if (topViewedCosmetics.length > 0) {
            const initialCosmeticIds = topViewedCosmetics.map((cosmetic) => String(cosmetic.cosmeticId));
            setSelectedCosmetics(initialCosmeticIds);
        }
    }, [topViewedCosmetics]);

    const chartData = useMemo(() => {
        if (data.size === 0) return [];

        const allDates = new Set<string>();
        data.forEach((views) => {
            views.forEach((view) => {
                allDates.add(view.date);
            });
        });

        const sortedDates = Array.from(allDates).sort();
        return sortedDates.map((date) => {
            const dateEntry: any = {date};
            data.forEach((views, cosmeticId) => {
                // Преобразование cosmeticId в строку для сравнения
                if (selectedCosmetics.length === 0 || selectedCosmetics.includes(String(cosmeticId))) {
                    const viewForDate = views.find((v) => v.date === date);
                    dateEntry[`${views[0].name}`] = viewForDate ? viewForDate.viewCount : 0;
                }
            });
            return dateEntry;
        });
    }, [data, selectedCosmetics]);

    if (data.size === 0) {
        return (<div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Просмотры выбранных товаров</h3>
            <p>Нет данных для отображения</p>
        </div>);
    }

    return (
        <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Просмотры выбранных товаров</h3>
            <div className="mb-4">
                <FilterCombobox
                    label="Выберите косметику"
                    onChange={(selectedIds) => {
                        console.log('Selected IDs:', selectedIds); // Логирование выбранных ID
                        setSelectedCosmetics(selectedIds);
                    }}
                    options={cosmetics}
                    values={selectedCosmetics}
                />
            </div>
            <div style={{width: '100%', height: 400}}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{top: 20, right: 30, left: 20, bottom: 30}}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="date" angle={-45} textAnchor="end" height={60}/>
                        <YAxis/>
                        <Tooltip content={<CustomTooltip/>}/>
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