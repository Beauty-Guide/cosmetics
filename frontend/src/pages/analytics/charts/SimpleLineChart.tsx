import React from 'react';
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts';

interface ProductViewCount {
    date: string;
    cosmeticId: number | null;
    viewCount: number;
    info?: string;
}

interface SimpleLineChartProps {
    data: ProductViewCount[];
    description: string; // Добавляем проп description
    title: string;
}

const SimpleLineChart: React.FC<SimpleLineChartProps> = ({data, description, title}) => {
    if (data.length === 0) {
        return (<div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">{title}</h3>
            <p>Нет данных для отображения</p>
        </div>);
    }


    // Обогащаем данные: добавляем description в поле info
    const enrichedData = data.map(item => ({
        ...item,
        info: description // Используем description как info
    }));

    // Вычисляем максимальное значение для оси Y
    const maxViewCount = Math.max(...enrichedData.map(item => item.viewCount));
    const domainMax = maxViewCount + maxViewCount * 0.1; // +10%

    return (
        <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={enrichedData} margin={{top: 5, right: 20, left: 10, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="date"/>
                    <YAxis
                        domain={[0, domainMax]}
                        tickFormatter={(value) => Math.floor(value).toString()}
                    />
                    <Tooltip
                        content={({active, payload, label}) => (
                            <CustomTooltip
                                active={active}
                                payload={payload}
                                label={label}
                                description={payload?.[0]?.payload.info} // Берем info из данных
                            />
                        )}
                        cursor={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="viewCount"
                        stroke="#8884d8"
                        dot={{r: 3, strokeWidth: 1}}
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

// Кастомный тултип — как в SimpleBarChart
const CustomTooltip = ({
                           active,
                           payload,
                           label,
                           description,
                       }: {
    active?: boolean;
    payload?: Array<{ value: number; payload: ProductViewCount }>;
    label?: string;
    description?: string;
}) => {
    if (active && payload && payload.length > 0) {
        const count = payload[0].value;
        return (
            <div className="custom-tooltip bg-white border border-gray-300 rounded-lg shadow-md p-4">
                <p className="label text-gray-700 font-semibold">{label}</p>
                <p className="desc text-gray-500 text-sm">
                    {description} : {count}
                </p>
            </div>
        );
    }

    return null;
};

export default SimpleLineChart;