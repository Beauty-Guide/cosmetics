import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { COLORS } from './constants';
import {useTranslation} from "react-i18next";

interface CountItem {
    label: string;
    count: number;
    info?: string;
}

interface SimplePieChartProps {
    data: CountItem[];
    title: string;
}

const SimplePieChart: React.FC<SimplePieChartProps> = ({ data, title }) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const chartRef = React.useRef<HTMLDivElement>(null);
    const [chartSize, setChartSize] = React.useState({ width: 300, height: 300 });
    const { t } = useTranslation()


    // Адаптация размера под контейнер
    React.useEffect(() => {
        const updateSize = () => {
            if (chartRef.current) {
                const width = chartRef.current.offsetWidth;
                const height = isMobile ? Math.min(width, 300) : 300;
                setChartSize({ width, height });
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [isMobile]);

    if (data.length === 0) {
        return (
            <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-4 sm:p-6 mb-6">
                <h3 className="text-lg font-medium mb-4">{title}</h3>
                <p>{t("analytics.brand.search.no.data")}</p>
            </div>
        );
    }

    // Оптимизация отображения подписей
    const renderCustomizedLabel = ({
                                       cx,
                                       cy,
                                       midAngle,
                                       innerRadius,
                                       outerRadius,
                                       percent,
                                       index,
                                   }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isMobile ? 10 : 12}
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div
            className="border border-gray-300 rounded-lg shadow-sm bg-white p-4 sm:p-6 mb-6"
            ref={chartRef}
        >
            <h3 className="text-lg font-medium mb-4">{title}</h3>
            <div className="w-full" style={{ height: `${chartSize.height}px` }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="count"
                            nameKey="label"
                            cx="50%"
                            cy="50%"
                            outerRadius={isMobile ? '70%' : '80%'}
                            innerRadius={isMobile ? '40%' : '50%'}
                            paddingAngle={2}
                            label={renderCustomizedLabel}
                            labelLine={false}
                        >
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    stroke="#fff"
                                    strokeWidth={1}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            content={({ active, payload }) => (
                                <CustomTooltip active={active} payload={payload} />
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            {/* Легенда с переносами слов */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center">
                        <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-xs sm:text-sm break-words max-w-[120px]">
              {item.label}
            </span>
                        <span className="ml-1 text-xs text-gray-500">({item.count})</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CustomTooltip: React.FC<{
    active?: boolean;
    payload?: any[];
}> = ({ active, payload }) => {
    const { t } = useTranslation()
    if (active && payload && payload.length > 0) {
        const data = payload[0].payload;
        return (
            <div className="bg-white border border-gray-200 rounded shadow-lg p-3 text-sm max-w-[180px]">
                <p className="font-semibold mb-1 break-words">{data.label}</p>
                <p className="text-gray-600">
                    {t("analytics.views")}: <strong>{data.count}</strong>
                </p>
                {data.info && (
                    <p className="text-gray-500 text-xs mt-1 break-words">{data.info}</p>
                )}
            </div>
        );
    }

    return null;
};

export default SimplePieChart;