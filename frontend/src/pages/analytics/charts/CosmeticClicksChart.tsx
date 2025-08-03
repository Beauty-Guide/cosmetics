import React, { useMemo, useState, useEffect } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTranslation } from 'react-i18next';
import type { CosmeticResponse } from "@/model/types";
import FilterCombobox from '@/components/HomeComponents/FilterCombobox';
import { COLORS } from './constants';

interface AnalyticClickItem {
    cosmeticId: number;
    name: string;
    viewCount: number;
    date: string;
}

interface CosmeticClicksChartProps {
    data: Map<number, AnalyticClickItem[]>;
    cosmetics: CosmeticResponse[];
    startDate?: string;
    endDate?: string;
}

interface ChartDataPoint {
    date: string;
    [key: string]: string | number;
}

interface LegendItem {
    id: string;
    lineKey: string;
    label: string;
    truncatedLabel: string;
    color: string;
    count: number;
    peakView: {
        viewCount: number;
        date: string;
    };
    lastView: {
        viewCount: number;
        date: string;
    };
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

const CosmeticClicksChart: React.FC<CosmeticClicksChartProps> = ({
                                                                     data,
                                                                     cosmetics,
                                                                 }) => {
    const [selectedCosmetics, setSelectedCosmetics] = useState<number[]>([]);
    const [activeLegendIndex, setActiveLegendIndex] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (cosmetics.length > 0) {
            setSelectedCosmetics([cosmetics[0].id]);
        }
    }, [cosmetics]);

    const handleSelectionChange = (values: string[]) => {
        setSelectedCosmetics(values.length > 0 ? values.map(Number) : []);
    };

    const cosmeticMap = useMemo(() => {
        const map = new Map<number, string>();
        cosmetics.forEach(c => map.set(c.id, c.name));
        return map;
    }, [cosmetics]);

    const allLines = useMemo(() => {
        if (!(data instanceof Map)) return [];

        const lines = new Set<string>();
        for (const [cosmeticId, items] of data) {
            const cosmeticName = cosmeticMap.get(Number(cosmeticId)) || `Product ${cosmeticId}`;
            items.forEach(item => {
                lines.add(`${item.name} - ${cosmeticName}`);
            });
        }
        return Array.from(lines).sort();
    }, [data, cosmeticMap]);

    const { chartData, maxViewCount } = useMemo(() => {
        if (!(data instanceof Map) || data.size === 0) {
            return { chartData: [], maxViewCount: 0 };
        }

        const grouped: Record<string, ChartDataPoint> = {};
        let max = 0;

        for (const [cosmeticId, items] of data) {
            const cosmeticName = cosmeticMap.get(Number(cosmeticId)) || `Product ${cosmeticId}`;

            items.forEach(item => {
                const lineKey = `${item.name} - ${cosmeticName}`;

                if (!grouped[item.date]) {
                    grouped[item.date] = { date: item.date };
                }

                grouped[item.date][lineKey] = item.viewCount;

                if (item.viewCount > max) {
                    max = item.viewCount;
                }
            });
        }

        const sortedData = Object.values(grouped).sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        return { chartData: sortedData, maxViewCount: max };
    }, [data, cosmeticMap]);

    const visibleLines = useMemo(() => {
        if (selectedCosmetics.length === 0) return [];

        return allLines.filter(line => {
            const [_, cosmeticName] = line.split(' - ');
            const cosmeticId = cosmetics.find(c => c.name === cosmeticName)?.id;
            return cosmeticId && selectedCosmetics.includes(cosmeticId);
        });
    }, [allLines, selectedCosmetics, cosmetics]);

    const legendData = useMemo(() => {
        return visibleLines.map((line, index) => {
            const [marketplace, cosmeticName] = line.split(' - ');
            const cosmeticId = cosmetics.find(c => c.name === cosmeticName)?.id;
            const totalCount = chartData.reduce((sum, point) => sum + (point[line] as number || 0), 0);

            let peakView = { viewCount: 0, date: '' };
            let lastView = { viewCount: 0, date: '' };

            chartData.forEach(point => {
                const count = point[line] as number || 0;
                if (count > peakView.viewCount) {
                    peakView = { viewCount: count, date: point.date };
                }
                if (count > 0) {
                    lastView = { viewCount: count, date: point.date };
                }
            });

            return {
                id: `${marketplace}-${cosmeticId}`,
                lineKey: line,
                label: line,
                truncatedLabel: `${marketplace} - ${cosmeticName.length > 15 ? cosmeticName.substring(0, 12) + '...' : cosmeticName}`,
                color: COLORS[index % COLORS.length],
                count: totalCount,
                peakView,
                lastView
            } as LegendItem;
        });
    }, [visibleLines, chartData, cosmetics]);

    const handleLegendClick = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveLegendIndex(activeLegendIndex === index ? null : index);
    };

    const domainMax = Math.ceil(maxViewCount * 1.1);

    if (!(data instanceof Map) || data.size === 0) {
        return (
            <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-4 sm:p-6 mb-6">
                <h3 className="text-lg font-medium mb-4">{t("analytics.selected.product.click")}</h3>
                <p>{t("analytics.brand.search.no.data")}</p>
            </div>
        );
    }

    return (
        <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-4 sm:p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">{t("analytics.selected.product.click")}</h3>

            <div className="mb-4">
                <FilterCombobox
                    label=""
                    onChange={handleSelectionChange}
                    options={cosmetics.map(c => ({ id: String(c.id), name: c.name }))}
                    values={selectedCosmetics.map(String)}
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
                                {visibleLines.map((line, index) => (
                                    <Line
                                        key={line}
                                        type="monotone"
                                        dataKey={line}
                                        stroke={COLORS[index % COLORS.length]}
                                        activeDot={{r: 8}}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {legendData.length > 0 && (
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                            {legendData.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="flex items-center relative"
                                    onMouseEnter={() => !isMobile && setActiveLegendIndex(index)}
                                    onMouseLeave={() => !isMobile && setActiveLegendIndex(null)}
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

                                    {activeLegendIndex === index && (
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
                    )}
                </>
            ) : (
                <p className="text-gray-500 text-center py-8"></p>
            )}
        </div>
    );
};

export default CosmeticClicksChart;