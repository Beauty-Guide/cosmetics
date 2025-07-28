import React from 'react';
import { Cell, LabelList, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { COLORS } from './constants'; // импортируем цвета из файла constants.ts

interface CountItem {
    label: string;
    count: number;
    info?: string; // Добавляем необязательное поле info
}

interface SimplePieChartProps {
    data: CountItem[];
    title: string;
}

const SimplePieChart: React.FC<SimplePieChartProps> = ({ data, title }) => {
    if (data.length === 0) {
        return (
            <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6 mb-6">
                <h3 className="text-lg font-medium mb-4">{title}</h3>
                <p>Нет данных для отображения</p>
            </div>
        );
    }

    return (
        <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="count"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={60}
                        labelLine={false}
                        label={({ name, value }) => {
                            // Ограничиваем длину названия для лучшего отображения
                            const displayName = name.length > 10 ? `${name.substring(0, 16)}` : name;
                            return `${displayName}: ${value}`;
                        }}
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        content={({ active, payload }) => (
                            <CustomTooltip
                                active={active}
                                payload={payload}
                            />
                        )}
                        cursor={false}
                    />
                    <LabelList
                        dataKey="label"
                        position="outside"
                        formatter={(value: string) => value.length > 10 ? `${value.substring(0, 8)}...` : value}
                        style={{
                            fontSize: '10px',
                            fill: '#333',
                            fontWeight: 'bold',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            maxWidth: '80px'
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
        const data = payload[0].payload;
        return (
            <div className="custom-tooltip bg-white border border-gray-300 rounded-lg shadow-md p-4">
                <p className="label text-gray-700 font-semibold">{`${data.label} : ${data.count}`}</p>
                {data.info && (
                    <p className="desc text-gray-500 text-sm">{data.info}</p>
                )}
            </div>
        );
    }

    return null;
};

export default SimplePieChart;