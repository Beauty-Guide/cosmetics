import React from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { COLORS } from './constants'; // импортируем цвета из файла constants.ts

interface CountItem {
    label: string;
    count: number;
}

const SimpleBarChart = ({ data }: { data: CountItem[] }) => (
    <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-6 mb-6">
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
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
                    domain={[0, Math.max(...data.map(item => item.count), 1)]}
                    ticks={Array.from({ length: Math.max(...data.map(item => item.count), 1) + 1 }, (_, i) => i)}
                />
                <Tooltip cursor={false} />
                <Bar dataKey="count">
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
);

export default SimpleBarChart;