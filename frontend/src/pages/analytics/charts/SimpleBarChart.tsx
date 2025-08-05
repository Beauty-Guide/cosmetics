import React, { useState } from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { COLORS } from './constants';
import {useTranslation} from "react-i18next";

interface CountItem {
    label: string;
    count: number;
    info?: string;
    link?: string;
}

interface SimpleBarChartProps {
    data: CountItem[];
    description: string;
    title: string;
}

const SimpleBarChart = ({ data, description, title }: SimpleBarChartProps) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const { t } = useTranslation()

    const truncateLabel = (label: string, maxLength: number = isMobile ? 8 : 15) => {
        return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
    };

    const enrichedData = data.map(item => ({
        ...item,
        info: description,
        truncatedLabel: truncateLabel(item.label)
    }));

    const handleClick = (entry: CountItem) => {
        if (entry.link) {
            window.location.href = entry.link;
        }
    };

    const handleLegendClick = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveIndex(activeIndex === index ? null : index);
    };

    if (data.length === 0) {
        return (
            <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-4 sm:p-6 mb-6">
                <h3 className="text-lg font-medium mb-4">{title}</h3>
                <p>{t("analytics.brand.search.no.data")}</p>
            </div>
        );
    }

    // Рассчитываем максимальное значение для оси Y
    const maxCount = Math.max(...enrichedData.map(item => item.count), 1);
    const yDomain = [0, maxCount * 1.1];
    const yTicks = Array.from({ length: Math.min(maxCount + 2, 6) }, (_, i) =>
        Math.floor((maxCount * 1.1) * i / 5)
    );

    return (
        <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-4 sm:p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">{title}</h3>
            <div className="w-full overflow-x-auto">
                <div style={{ minWidth: isMobile ? `${data.length * 50}px` : '100%' }}>
                    <ResponsiveContainer width="100%" height={isMobile ? 300 : 350}>
                        <BarChart
                            data={enrichedData}
                            margin={{
                                top: 5,
                                right: 20,
                                left: 5,
                                bottom: 40
                            }}
                            layout="horizontal"
                        >
                            <XAxis
                                dataKey="label"
                                axisLine={{ stroke: '#666' }}
                                tickLine={{ stroke: '#666' }}
                                tick={{
                                    fontSize: 0,
                                    fill: 'transparent'
                                }}
                                height={10}
                            />
                            <YAxis
                                type="number"
                                domain={yDomain}
                                tickFormatter={(value) => Math.floor(value).toString()}
                                tick={{ fontSize: isMobile ? 10 : 12 }}
                                ticks={yTicks}
                                width={isMobile ? 30 : 40}
                            />

                            <Tooltip
                                content={({ active, payload, label }) => (
                                    <CustomTooltip
                                        active={active}
                                        payload={payload}
                                        label={label}
                                        description={payload?.[0]?.payload.info}
                                    />
                                )}
                                cursor={{ fill: '#f0f0f0' }}
                            />

                            <Bar
                                dataKey="count"
                                onClick={(entry: any) => handleClick(entry)}
                                barSize={isMobile ? 20 : 30}
                            >
                                {enrichedData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                        radius={[4, 4, 0, 0]}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
                {enrichedData.map((item, index) => (
                    <div
                        key={index}
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
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-xs sm:text-sm break-words max-w-[120px]">
                {item.truncatedLabel}
              </span>
                            <span className="ml-1 text-xs text-gray-500">({item.count})</span>
                        </div>

                        {(activeIndex === index) && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
                                <div className="bg-white border border-gray-200 rounded shadow-lg p-2 text-xs whitespace-nowrap">
                                    {item.label}
                                </div>
                                <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-white border-r border-b border-gray-200 transform rotate-45 -translate-x-1/2"></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const CustomTooltip = ({ active, payload, label, description }: {
    active?: boolean;
    payload?: any[];
    label?: string;
    description?: string;
}) => {
    if (active && payload && payload.length > 0) {
        const count = payload[0]?.value;
        return (
            <div className="bg-white border border-gray-200 rounded shadow-lg p-3 text-sm max-w-[200px]">
                <p className="font-semibold mb-1">{label}</p>
                <p className="text-gray-600">
                    {description}: <strong>{count}</strong>
                </p>
            </div>
        );
    }

    return null;
};

export default SimpleBarChart;