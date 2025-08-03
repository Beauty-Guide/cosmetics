import React, { useEffect, useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import FilterCombobox from "@/components/HomeComponents/FilterCombobox.tsx";
import type { CosmeticResponse } from "@/model/types.ts";
import { useTranslation } from "react-i18next";
import { COLORS } from './constants';

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

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
        const filteredPayload = payload.filter((entry: any) => entry.value > 0);
        if (filteredPayload.length === 0) return null;

        return (
            <div className="custom-tooltip bg-white border border-gray-300 rounded-lg shadow-md p-4">
                <p className="label text-gray-700 font-semibold">{`${label}`}</p>
                {filteredPayload.map((entry: any, index: number) => (
                    <p key={index} className="desc text-gray-500 text-sm">
                        {entry.name}: <strong>{entry.value}</strong>
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
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const { t } = useTranslation();

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
            const dateEntry: any = { date };
            data.forEach((views, cosmeticId) => {
                if (selectedCosmetics.length === 0 || selectedCosmetics.includes(String(cosmeticId))) {
                    const viewForDate = views.find((v) => v.date === date);
                    dateEntry[views[0].name] = viewForDate ? viewForDate.viewCount : 0;
                }
            });
            return dateEntry;
        });

        const maxViewCount = Math.max(...allViewCounts, 1);
        return { chartData, maxViewCount };
    }, [data, selectedCosmetics]);

    const enrichedLegendData = useMemo(() => {
        return selectedCosmetics
            .map((idStr, index) => {
                const cosmeticId = Number(idStr);
                const views = data.get(cosmeticId) || [];
                if (views.length === 0) return null;

                const totalViews = views.reduce((sum, v) => sum + v.viewCount, 0);
                const name = views[0].name;
                const truncatedLabel = name.length > 15 ? `${name.slice(0, 15)}...` : name;

                const peakView = views.reduce((max, v) => (v.viewCount > max.viewCount ? v : max), views[0]);
                const lastView = views[views.length - 1];

                return {
                    id: cosmeticId,
                    label: name,
                    truncatedLabel,
                    count: totalViews,
                    color: COLORS[index % COLORS.length],
                    peakView,
                    lastView,
                };
            })
            .filter(Boolean) as Array<{
            id: number;
            label: string;
            truncatedLabel: string;
            count: number;
            color: string;
            peakView: AnalyticViewedCosmetic;
            lastView: AnalyticViewedCosmetic;
        }>;
    }, [selectedCosmetics, data]);

    const handleLegendClick = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveIndex(activeIndex === index ? null : index);
    };

    const handleSelectionChange = (selectedIds: string[]) => {
        setSelectedCosmetics(selectedIds);
        setActiveIndex(null);
    };

    if (data.size === 0) {
        return (
            <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-4 sm:p-6 mb-6">
                <h3 className="text-lg font-medium mb-4">{t("analytics.selected.product.views")}</h3>
                <p>{t("analytics.brand.search.no.data")}</p>
            </div>
        );
    }

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

            {selectedCosmetics.length > 0 ? (
                <>
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
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
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
                                    content={<CustomTooltip />}
                                    wrapperStyle={{ zIndex: 1000 }}
                                />
                                {selectedCosmetics.map((cosmeticId, index) => {
                                    const productName = data.get(Number(cosmeticId))?.[0]?.name || '';
                                    return (
                                        <Line
                                            key={cosmeticId}
                                            type="monotone"
                                            dataKey={productName}
                                            stroke={COLORS[index % COLORS.length]}
                                            activeDot={{ r: 8 }}
                                        />
                                    );
                                })}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {enrichedLegendData.map((item, index) => (
                            <div
                                key={item.id}
                                className="flex items-center relative"
                                onMouseEnter={() => !isMobile && setActiveIndex(index)}
                                onMouseLeave={() => !isMobile && setActiveIndex(null)}
                            >
                                <div
                                    className="flex items-center cursor-pointer"
                                    onClick={(e) => isMobile && handleLegendClick(index, e)}
                                >
                                    <div
                                        className="w-3 h-3 rounded-sm mr-2"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-xs sm:text-sm break-words max-w-[120px]">
                                        {item.truncatedLabel}
                                    </span>
                                    <span className="ml-1 text-xs text-gray-500">({item.count})</span>
                                </div>

                                {activeIndex === index && (
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10 w-[280px] sm:w-[320px]">
                                        <div className="custom-tooltip bg-white border border-gray-300 rounded-lg shadow-md p-4">
                                            <p className="text-gray-700 font-semibold text-sm sm:text-base mb-2">{item.label}</p>

                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="text-gray-500">
                                                    <span className="block font-medium">{t("analytics.totalViews")}:</span>
                                                    <span className="font-semibold text-gray-700">{item.count}</span>
                                                </div>

                                                <div className="text-gray-500">
                                                    <span className="block font-medium">{t("analytics.peakViews")}:</span>
                                                    <span className="font-semibold text-gray-700">{item.peakView.viewCount}</span>
                                                    <span className="text-gray-400 text-xs block">({item.peakView.date})</span>
                                                </div>
                                            </div>

                                            {item.lastView.date !== item.peakView.date && (
                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <p className="text-gray-500 text-sm">
                                                        <span className="font-medium">{t("analytics.lastView")}:</span>{' '}
                                                        <span className="font-semibold text-gray-700">{item.lastView.viewCount}</span>{' '}
                                                        <span className="text-gray-400">({item.lastView.date})</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute left-1/2 -bottom-1 w-3 h-3 bg-white border border-gray-300 transform rotate-45 -translate-x-1/2"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <p className="text-gray-500 text-center py-8"></p>
            )}
        </div>
    );
};

export default CosmeticViewsMultiChart;