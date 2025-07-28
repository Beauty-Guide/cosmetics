import React from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { COLORS } from './constants'; // импортируем цвета из файла constants.ts

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
    const enrichedData = data.map(item => ({
        ...item,
        info: description
    }));

    const handleClick = (entry: CountItem) => {
        if (entry.link) {
            window.location.href = entry.link;
        }
    };
    if (data.length === 0) {
        return (<div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">{title}</h3>
            <p>Нет данных для отображения</p>
        </div>);
    }

    return (
        <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={enrichedData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <XAxis
                        dataKey="label"
                        interval={0}
                        height={90}
                        tick={(props) => {
                            const { x, y, payload } = props;
                            return (
                                <g transform={`translate(${x},${y})`} textAnchor="end">
                                    <text
                                        x={0}
                                        y={0}
                                        dy={16}
                                        fill="#666"
                                        transform="rotate(-45)"
                                        fontSize={12}
                                    >
                                        {payload.value}
                                    </text>
                                </g>
                            );
                        }}
                    />
                    <YAxis
                        tickFormatter={(value) => Math.floor(value).toString()}
                        domain={[0, (Math.max(...enrichedData.map(item => item.count), 1)) * 1.1]}
                        ticks={Array.from({ length: Math.max(...enrichedData.map(item => item.count), 1) + 1 }, (_, i) => i)}
                    />
                    <Tooltip
                        content={({ active, payload, label }) => (
                            <CustomTooltip
                                active={active}
                                payload={payload}
                                label={label}
                                description={payload?.[0]?.payload.info} // Используйте поле info из данных
                            />
                        )}
                        cursor={false}
                    />
                    <Bar dataKey="count" onClick={(entry: any) => handleClick(entry)}>
                        {enrichedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const CustomTooltip = ({ active, payload, label, description }) => {
    if (active && payload && payload.length > 0) {
        const count = payload[0]?.value;
        return (
            <div className="custom-tooltip bg-white border border-gray-300 rounded-lg shadow-md p-4">
                <p className="label text-gray-700 font-semibold">{`${label}`}</p>
                <p className="desc text-gray-500 text-sm">{description} : {count}</p>
            </div>
        );
    }

    return null;
};

export default SimpleBarChart;